import { NgIf } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject, NgZone, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ArrowRight, CheckCircle2, LucideAngularModule, X } from 'lucide-angular';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

import { Product } from '../../core/mdoels/product';

export interface AddToCartToastPayload {
  product: Pick<Product, 'name' | 'image'>;
}

@Component({
  selector: 'app-add-to-cart-toast',
  standalone: true,
  imports: [NgIf, LucideAngularModule],
  templateUrl: './add-to-cart-toast.component.html',
  styleUrl: './add-to-cart-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('cartToastMotion', [
      state('inactive', style({ opacity: 0, transform: 'translateY(-12px) scale(0.98)' })),
      state('active', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      state('removed', style({ opacity: 0, transform: 'translateY(-8px) scale(0.98)' })),
      transition('inactive => active', animate('{{ easeTime }}ms cubic-bezier(0.22, 1, 0.36, 1)')),
      transition('active => removed', animate('{{ easeTime }}ms ease-in'))
    ])
  ],
  host: {
    '[class]': 'toastClasses',
    '[@cartToastMotion]': '_state',
    '[style.display]': 'displayStyle',
    '(click)': 'tapToast()',
    '(mouseenter)': 'stickAround()',
    '(mouseleave)': 'delayedHideToast()'
  }
})
export class AddToCartToastComponent extends Toast<AddToCartToastPayload> {
  readonly CheckCircle2 = CheckCircle2;
  readonly ArrowRight = ArrowRight;
  readonly X = X;

  private readonly router = inject(Router);

  constructor(
    toastrService: ToastrService,
    toastPackage: ToastPackage<AddToCartToastPayload>,
    ngZone: NgZone
  ) {
    super(toastrService, toastPackage, ngZone);
  }

  get product(): AddToCartToastPayload['product'] | undefined {
    return this.toastPackage.config.payload?.product;
  }

  viewCart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    void this.router.navigate(['/cart']).then(() => this.remove());
  }

  close(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.remove();
  }
}
