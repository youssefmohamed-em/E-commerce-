import {
  Component,
  inject,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Router } from '@angular/router';

import {
  LucideAngularModule,
  CheckCircle2,
  XCircle,
  LoaderCircle
} from 'lucide-angular';

import {
  interval,
  take,
  startWith,
  switchMap,
  takeWhile
} from 'rxjs';

import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [
    LucideAngularModule
  ],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent {

  private readonly orderService =
    inject(OrderService);

  private readonly router =
    inject(Router);

  private readonly cartService =
    inject(CartService);

  private readonly platformId =
    inject(PLATFORM_ID);

  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly LoaderCircle = LoaderCircle;

  readonly loading = signal(true);
  readonly paid = signal(false);
  readonly failed = signal(false);
  readonly pending = signal(false);
  readonly message = signal(
    'We are confirming your payment...'
  );

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      this.loading.set(false);
      this.pending.set(true);
      this.message.set(
        'Your payment is awaiting confirmation. Check its status after the page loads.'
      );
      return;
    }

    const orderId =
      localStorage.getItem(
        'shoply-pending-order-id'
      );

    if (!orderId) {

      this.loading.set(false);
      this.failed.set(true);

      this.message.set(
        'Order information was not found.'
      );

      return;
    }

    this.checkStatus(orderId);
  }

  checkAgain(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const orderId = localStorage.getItem('shoply-pending-order-id');

    if (!orderId) {
      this.pending.set(false);
      this.failed.set(true);
      this.message.set('Order information was not found.');
      return;
    }

    this.loading.set(true);
    this.pending.set(false);
    this.checkStatus(orderId);
  }

  private checkStatus(orderId: string): void {
    interval(2000)
      .pipe(
        startWith(0),

        switchMap(() =>
          this.orderService.getOrderById(
            orderId
          )
        ),

        takeWhile(
          response => {

            const status =
              response.data.paymentStatus;

            if (status === 'paid') {

              this.loading.set(false);
              this.paid.set(true);

              this.message.set(
                'Your payment was successful.'
              );

              this.clearPendingOrder();
              this.cartService.clearCart();

              return false;
            }

            if (status === 'failed') {

              this.loading.set(false);
              this.failed.set(true);

              this.message.set(
                'Cashflow reported that the payment was not completed. Your cart is still available if you want to try again.'
              );

              this.clearPendingOrder();

              return false;
            }

            return true;
          },
          true
        ),

        take(30)
      )
      .subscribe({

        complete: () => {
          if (this.loading()) {
            this.loading.set(false);
            this.pending.set(true);
            this.message.set(
              'Your payment is still awaiting confirmation from Cashflow. You can check again shortly or review your orders.'
            );
          }
        },

        error: error => {

          console.error(
            'Payment status error:',
            error
          );

          this.loading.set(false);
          this.pending.set(true);

          this.message.set(
            'We could not check the payment status right now. Your order is still awaiting confirmation.'
          );
        }

      });
  }

  private clearPendingOrder(): void {

    localStorage.removeItem(
      'shoply-pending-order-id'
    );
  }

  goHome(): void {

    this.router.navigate(['/']);
  }

  goToCart(): void {

    this.router.navigate(['/cart']);
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }
}
