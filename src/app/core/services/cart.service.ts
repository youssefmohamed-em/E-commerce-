import { Injectable, inject, signal, computed } from '@angular/core';

import { CategoryService } from './category.service';
import { cartProduct } from '../mdoels/cart';
import { Product } from '../mdoels/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly categoryService = inject(CategoryService);

  private readonly items = signal<cartProduct[]>([]);

  readonly cartItems = this.items.asReadonly();

  readonly cartCount = computed(() =>
    this.items().reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  readonly cartTotal = computed(() =>
    this.items().reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    )
  );

  addToCart(
    product: Product,
    categoryId: string
  ): void {

    const currentItems = this.items();

    const existingItem = currentItems.find(
      item =>
        item.productId === product.id &&
        item.categoryId === categoryId
    );

    if (existingItem) {

      this.items.set(
        currentItems.map(item =>
          item.productId === product.id &&
          item.categoryId === categoryId
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      );

      return;
    }

    this.items.set([
      ...currentItems,
      {
        productId: product.id,
        categoryId,
        quantity: 1,
        product
      }
    ]);

  }

  increaseQuantity(
    productId: number,
    categoryId: string
  ): void {

    this.items.update(items =>
      items.map(item =>
        item.productId === productId &&
        item.categoryId === categoryId
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );

  }

  decreaseQuantity(
    productId: number,
    categoryId: string
  ): void {

    this.items.update(items =>
      items
        .map(item =>
          item.productId === productId &&
          item.categoryId === categoryId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter(item => item.quantity > 0)
    );

  }

  removeFromCart(
    productId: number,
    categoryId: string
  ): void {

    this.items.update(items =>
      items.filter(
        item =>
          !(
            item.productId === productId &&
            item.categoryId === categoryId
          )
      )
    );

  }

  clearCart(): void {
    this.items.set([]);
  }

}