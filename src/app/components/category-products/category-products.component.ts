import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { TitleCasePipe } from '@angular/common';

import { Product } from '../../core/mdoels/product';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AddToCartToastComponent } from '../../shared/add-to-cart-toast/add-to-cart-toast.component';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.scss'
})
export class CategoryProductsComponent implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly productService =
    inject(ProductService);

  private readonly cartService =
    inject(CartService);

  private readonly toastr =
    inject(ToastrService);

  readonly products =
    signal<Product[]>([]);

  readonly categoryId =
    signal('');

  readonly loading =
    signal(false);

  readonly error =
    signal(false);

  readonly searchTerm =
    signal('');

  readonly filteredProducts =
    computed(() => {

      const search =
        this.searchTerm()
          .trim()
          .toLowerCase();

      if (!search) {
        return this.products();
      }

      return this.products().filter(product =>
        product.name
          .toLowerCase()
          .includes(search)
      );
    });

  ngOnInit(): void {

    const categoryId =
      this.route.snapshot.paramMap.get(
        'categoryId'
      );

    if (!categoryId) {
      this.error.set(true);
      return;
    }

    this.categoryId.set(categoryId);

    this.loadProducts(categoryId);
  }

  private loadProducts(
    categoryId: string
  ): void {

    this.loading.set(true);
    this.error.set(false);

    this.productService
      .getProductsByCategory(categoryId)
      .subscribe({

        next: (products) => {

          this.products.set(products);

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load category products:',
            error
          );

          this.products.set([]);

          this.error.set(true);
          this.loading.set(false);
        }
      });
  }

  searchProducts(value: string): void {

    this.searchTerm.set(value);
  }

  clearSearch(): void {

    this.searchTerm.set('');
  }

  openProduct(productId: number): void {

    this.route.parent?.parent?.url.subscribe(() => {
      // navigation handled by routerLink
    });
  }

  addToCart(
    product: Product,
    event: Event
  ): void {

    event.stopPropagation();

    this.cartService.addToCart(
      product,
      this.categoryId()
    );

    this.toastr.success(
      'Added to cart successfully',
      product.name,
      {
        toastComponent:
          AddToCartToastComponent,

        toastClass:
          'premium-cart-toast',

        closeButton: false,

        tapToDismiss: false,

        payload: {
          product
        }
      }
    );
  }
}