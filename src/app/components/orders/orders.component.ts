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
  Router
} from '@angular/router';

import {
  LucideAngularModule,
  Package,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  CreditCard,
  Banknote,
  MapPin,
  CheckCircle2,
  XCircle
} from 'lucide-angular';

import {
  Order,
  PaymentMethod
} from '../../core/mdoels/order';

import { OrderService } from '../../core/services/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    LucideAngularModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  private readonly orderService =
    inject(OrderService);

  private readonly router =
    inject(Router);

  private readonly toastr =
    inject(ToastrService);

  readonly orders =
    signal<Order[]>([]);

  readonly loading =
    signal(false);
readonly showCancelModal = signal(false);

readonly selectedOrderId =
  signal<string | null>(null);

readonly cancellingOrderId =
  signal<string | null>(null);

  readonly errorMessage =
    signal<string | null>(null);

  readonly Package = Package;
  readonly ShoppingBag = ShoppingBag;
  readonly ArrowRight = ArrowRight;
  readonly RefreshCw = RefreshCw;
  readonly CreditCard = CreditCard;
  readonly Banknote = Banknote;
  readonly MapPin = MapPin;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.loading.set(true);
    this.errorMessage.set(null);

    this.orderService
      .getMyOrders()
      .subscribe({

        next: response => {

          this.orders.set(
            response.data ?? []
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Get orders error:',
            error
          );

          this.loading.set(false);

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to load your orders.'
          );
        }

      });
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  viewOrder( orderId: string): void {
    this.router.navigate([
      '/orders',
      orderId
    ]);
  }

  continueShopping(): void {

    this.router.navigate(['/']);
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

  getPaymentStatusLabel(
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

  trackOrder(
    _: number,
    order: Order
  ): string {

    return order._id;
  }


  openCancelModal(orderId: string): void {

  this.selectedOrderId.set(orderId);
  this.showCancelModal.set(true);

}

closeCancelModal(): void {

  if (this.cancellingOrderId()) {
    return;
  }

  this.selectedOrderId.set(null);
  this.showCancelModal.set(false);

}

confirmCancelOrder(): void {

  const orderId = this.selectedOrderId();

  if (!orderId) {
    return;
  }

  this.cancellingOrderId.set(orderId);

  this.orderService
    .cancelOrder(orderId)
    .subscribe({

      next: response => {

        console.log(
          'Cancel order response:',
          response
        );

        this.orders.update(
          orders =>
            orders.map(order =>
              order._id === orderId
                ? response.data
                : order
            )
        );

        this.cancellingOrderId.set(null);
        this.selectedOrderId.set(null);
        this.showCancelModal.set(false);
        this.toastr.success(
          'Order cancelled successfully',
          'Order Cancelled'
        );

      },

      error: error => {

        console.error(
          'Cancel order error:',
          error
        );

        this.cancellingOrderId.set(null);

        this.errorMessage.set(
          error?.error?.message ||
          'Unable to cancel this order.'
        );

      }

    });

}
}