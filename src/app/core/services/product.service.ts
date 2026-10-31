import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import {
  Product,
  ProductsResponse
} from '../mdoels/product';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  private readonly baseUrl =
    `${this.configService.apiBaseUrl}/products`;

  getAllProducts(): Observable<Product[]> {

    return this.http
      .get<ProductsResponse>(this.baseUrl)
      .pipe(
        map(response => response.products)
      );
  }

  getProductsByCategory(
    categoryType: string
  ): Observable<Product[]> {

    return this.http
      .get<ProductsResponse>(
        this.baseUrl,
        {
          params: {
            categoryType
          }
        }
      )
      .pipe(
        map(response => response.products)
      );
  }

  getProductById(
    productId: number
  ): Observable<Product> {

    return this.http
      .get<{ product: Product }>(
        `${this.baseUrl}/${productId}`
      )
      .pipe(
        map(response => response.product)
      );
  }
}