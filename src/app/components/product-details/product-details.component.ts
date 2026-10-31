import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { Product } from '../../core/mdoels/product';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

import { ToastrService } from 'ngx-toastr';
import { AddToCartToastComponent } from '../../shared/add-to-cart-toast/add-to-cart-toast.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly productService =
    inject(ProductService);

  private readonly cartService =
    inject(CartService);

  private readonly toastr =
    inject(ToastrService);

  readonly product =
    signal<Product | null>(null);

  readonly categoryId =
    signal('');

  readonly productNotFound =
    signal(false);

  addToCart(product: Product): void {

    this.cartService.addToCart(
      product,
      this.categoryId()
    );

    this.toastr.success(
      'Added to cart successfully',
      product.name,
      {
        toastComponent: AddToCartToastComponent,
        toastClass: 'premium-cart-toast',
        closeButton: false,
        tapToDismiss: false,
        payload: {
          product
        }
      }
    );
  }

  ngOnInit(): void {

    const categoryId =
      this.route.snapshot.paramMap.get(
        'categoryId'
      );

    const productId =
      this.route.snapshot.paramMap.get(
        'productId'
      );

    if (!categoryId || !productId) {

      this.productNotFound.set(true);

      return;
    }

    const numericProductId =
      Number(productId);

    if (Number.isNaN(numericProductId)) {

      this.productNotFound.set(true);

      return;
    }

    this.categoryId.set(categoryId);

    this.productService
      .getProductById(numericProductId)
      .subscribe({

        next: product => {

          this.product.set(product);

          this.productNotFound.set(false);
        },

        error: error => {

          console.error(
            'Failed to load product details:',
            error
          );

          this.productNotFound.set(true);
        }
      });
  }
}