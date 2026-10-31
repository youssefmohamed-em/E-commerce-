import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import {
  LucideAngularModule,
  ArrowLeft,
  CreditCard,
  Banknote,
  ShieldCheck,
  LockKeyhole
} from 'lucide-angular';

import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';

import {
  CreateOrderRequest,
  PaymentMethod
} from '../../core/mdoels/order';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    DecimalPipe
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);

  readonly ArrowLeft = ArrowLeft;
  readonly CreditCard = CreditCard;
  readonly Banknote = Banknote;
  readonly ShieldCheck = ShieldCheck;
  readonly LockKeyhole = LockKeyhole;

  readonly cartItems = this.cartService.cartItems;
  readonly subtotal = this.cartService.cartTotal;

  readonly shippingCost = signal(10);

  readonly total = () =>
    this.subtotal() + this.shippingCost();

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly checkoutForm = this.fb.nonNullable.group({

    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/)
      ]
    ],

    address: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    city: [
      '',
      [
        Validators.required
      ]
    ],

    paymentMethod: [
      'cash_on_delivery' as PaymentMethod,
      Validators.required
    ]

  });

  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems().length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  get fullNameControl() {
    return this.checkoutForm.controls.fullName;
  }

  get phoneControl() {
    return this.checkoutForm.controls.phone;
  }

  get addressControl() {
    return this.checkoutForm.controls.address;
  }

  get cityControl() {
    return this.checkoutForm.controls.city;
  }

  selectPaymentMethod(
    method: PaymentMethod
  ): void {

    this.checkoutForm.controls.paymentMethod.setValue(
      method
    );
  }

 submitOrder(): void {

  this.errorMessage.set(null);

  if (this.checkoutForm.invalid) {
    this.checkoutForm.markAllAsTouched();
    return;
  }

  const items = this.cartItems();

  if (items.length === 0) {
    this.errorMessage.set('Your cart is empty.');
    return;
  }

  const formValue = this.checkoutForm.getRawValue();

  const payload: CreateOrderRequest = {
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    })),

    shippingAddress: {
      fullName: formValue.fullName.trim(),
      phone: formValue.phone.trim(),
      address: formValue.address.trim(),
      city: formValue.city.trim()
    },

    paymentMethod: formValue.paymentMethod
  };

  /*
   * Open a new tab immediately while this function
   * is still running as a result of the user's click.
   *
   * This helps avoid browser popup blockers.
   */
  let paymentWindow: Window | null = null;

  if (formValue.paymentMethod === 'credit_card') {
    paymentWindow = window.open('', '_blank');

    if (!paymentWindow) {
      this.errorMessage.set(
        'Please allow popups in your browser to continue with payment.'
      );

      return;
    }

    paymentWindow.opener = null;

    paymentWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Secure Payment</title>
          <meta charset="UTF-8">
        </head>
        <body style="
          margin:0;
          display:flex;
          align-items:center;
          justify-content:center;
          min-height:100vh;
          font-family:Arial,sans-serif;
        ">
          <div>
            <h2>Preparing secure payment...</h2>
            <p>Please wait.</p>
          </div>
        </body>
      </html>
    `);

    paymentWindow.document.close();
  }

  this.loading.set(true);

  this.orderService
    .createOrder(payload)
    .subscribe({

      next: response => {

        this.loading.set(false);

        const order = response.data.order;
        const payment = response.data.payment;

        /*
         * Cashflow card payment
         */
        if (order.paymentMethod === 'credit_card') {

          localStorage.setItem(
            'shoply-pending-order-id',
            order._id
          );

          if (!payment?.checkoutUrl) {
            paymentWindow?.close();
            this.errorMessage.set(
              'The order was created, but Cashflow did not return a payment link. Please check your orders or contact support before trying again.'
            );
            return;
          }

          if (paymentWindow) {

            paymentWindow.location.href =
              payment.checkoutUrl;

          } else {

            window.open(
              payment.checkoutUrl,
              '_blank'
            );

          }

          return;
        }

        /*
         * Cash on delivery
         */
        this.cartService.clearCart();

        this.router.navigate([
          '/order-success',
          order._id
        ]);
      },

      error: error => {

        this.loading.set(false);

        /*
         * If order creation fails,
         * close the payment tab we opened.
         */
        if (paymentWindow) {
          paymentWindow.close();
        }

        console.error(
          'Create order error:',
          error
        );

        this.errorMessage.set(
          error?.error?.message ||
          'Something went wrong while creating your order.'
        );
      }

    });
}

  goBack(): void {

    this.router.navigate(['/cart']);
  }
}
