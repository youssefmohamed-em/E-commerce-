import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

import { Product } from '../../core/mdoels/product';

import { ToastrService } from 'ngx-toastr';
import { AddToCartToastComponent } from '../../shared/add-to-cart-toast/add-to-cart-toast.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  private readonly productService =
    inject(ProductService);

  private readonly router =
    inject(Router);

  private readonly cartService =
    inject(CartService);

  private readonly toastr =
    inject(ToastrService);

  readonly products =
    signal<Product[]>([]);

  readonly loading =
    signal(false);

  readonly searchTerm =
    signal('');

  readonly selectedCategory =
    signal('all');

  readonly sortOption =
    signal('featured');

  readonly categories = [
    'all',
    'accessories',
    'electronics',
    'fashion',
    'sneakers'
  ];

  readonly filteredProducts =
    computed(() => {

      const products =
        this.products();

      const search =
        this.searchTerm()
          .toLowerCase()
          .trim();

      const category =
        this.selectedCategory();

      const sort =
        this.sortOption();

      let result =
        products.filter(product => {

          const matchesSearch =
            product.name
              .toLowerCase()
              .includes(search);

          const matchesCategory =
            category === 'all' ||
            product.categoryType.toLowerCase() === category;

          return (
            matchesSearch &&
            matchesCategory
          );
        });

      result = [...result];

      switch (sort) {

        case 'price-low':

          result.sort(
            (a, b) =>
              a.price - b.price
          );

          break;

        case 'price-high':

          result.sort(
            (a, b) =>
              b.price - a.price
          );

          break;

        case 'name':

          result.sort(
            (a, b) =>
              a.name.localeCompare(b.name)
          );

          break;

        case 'featured':
        default:
          break;
      }

      return result;
    });

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {

    this.loading.set(true);

    this.productService
      .getAllProducts()
      .subscribe({

        next: products => {

          this.products.set(products);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Failed to load products:',
            error
          );

          this.products.set([]);

          this.loading.set(false);
        }
      });
  }

  setCategory(category: string): void {

    this.selectedCategory.set(
      category
    );
  }

  setSort(option: string): void {

    this.sortOption.set(
      option
    );
  }

  onSearch(value: string): void {

    this.searchTerm.set(
      value
    );
  }

  openProduct(product: Product): void {

    this.router.navigate([
      '/product',
      product.categoryType,
      product.id
    ]);
  }

  addToCart(
    product: Product,
    event: Event
  ): void {

    event.stopPropagation();

    this.cartService.addToCart(
      product,
      product.categoryType
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