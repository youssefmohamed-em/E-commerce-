import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule,
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  LucideAngularModule,
  Package,
  ArrowLeft,
  CreditCard,
  Banknote,
  MapPin,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle
} from 'lucide-angular';

import {
  Order,
  PaymentMethod
} from '../../core/mdoels/order';

import {
  OrderService
} from '../../core/services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent
  implements OnInit {

  private readonly orderService =
    inject(OrderService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  readonly order =
    signal<Order | null>(null);

  readonly loading =
    signal(false);

  readonly errorMessage =
    signal<string | null>(null);

  readonly Package = Package;
  readonly ArrowLeft = ArrowLeft;
  readonly CreditCard = CreditCard;
  readonly Banknote = Banknote;
  readonly MapPin = MapPin;
  readonly CheckCircle2 = CheckCircle2;
  readonly Clock3 = Clock3;
  readonly Truck = Truck;
  readonly XCircle = XCircle;


  ngOnInit(): void {

    const orderId =
      this.route.snapshot.paramMap.get(
        'orderId'
      );

    if (!orderId) {

      this.errorMessage.set(
        'Order ID is missing.'
      );

      return;
    }

    this.loadOrder(orderId);
  }


  loadOrder(
    orderId: string
  ): void {

    this.loading.set(true);

    this.errorMessage.set(null);

    this.orderService
      .getOrderById(orderId)
      .subscribe({

        next: response => {

          this.order.set(
            response.data
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Get order details error:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to load order details.'
          );
        }

      });
  }


  backToOrders(): void {

    this.router.navigate([
      '/orders'
    ]);
  }


  getPaymentLabel(
    paymentMethod?: PaymentMethod
  ): string {

    if (
      paymentMethod === 'credit_card'
    ) {

      return 'Credit / Debit Card';
    }

    return 'Cash on Delivery';
  }


  getPaymentIcon(
    paymentMethod?: PaymentMethod
  ) {

    return paymentMethod === 'credit_card'
      ? this.CreditCard
      : this.Banknote;
  }


  getStatusLabel(
    status?: string
  ): string {

    if (!status) {
      return 'Pending';
    }

    return status
      .replaceAll('_', ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );
  }


  getStatusClass(
    status?: string
  ): string {

    return `status-${status ?? 'pending'}`;
  }


  getPaymentStatusClass(
    status?: string
  ): string {

    return `payment-${status ?? 'pending'}`;
  }


  getItemsCount(
    order: Order
  ): number {

    return order.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }
}