import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  LucideAngularModule,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  LockKeyhole
} from 'lucide-angular';

import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { cartProduct } from '../../core/mdoels/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Icons
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly ArrowLeft = ArrowLeft;
  readonly LockKeyhole = LockKeyhole;

  // Cart state
  readonly cartItems = this.cartService.cartItems;
  readonly cartCount = this.cartService.cartCount;
  readonly subtotal = this.cartService.cartTotal;

  // Checkout popup
  readonly showLoginPopup = signal(false);

  increaseQuantity(item: cartProduct): void {
    this.cartService.increaseQuantity(
      item.productId,
      item.categoryId
    );
  }

  decreaseQuantity(item: cartProduct): void {
    this.cartService.decreaseQuantity(
      item.productId,
      item.categoryId
    );
  }

  removeItem(item: cartProduct): void {
    this.cartService.removeFromCart(
      item.productId,
      item.categoryId
    );
  }

  checkout(): void {

    if (!this.authService.isLoggedIn()) {
      this.showLoginPopup.set(true);
      return;
    }

    this.router.navigate(['/checkout']);
  }

  cancelLogin(): void {
    this.showLoginPopup.set(false);
  }

  goToLogin(): void {
    this.showLoginPopup.set(false);
    this.router.navigate(['/login']);
  }
}