import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

import {
  cancelOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrdersResponse
} from '../mdoels/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly configService = inject(ConfigService);

  private readonly baseUrl =
    `${this.configService.apiBaseUrl}/orders`;

  private getAuthorizationHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders(
      token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}
    );
  }

  // ==========================================
  // Create Order
  // POST /orders
  // ==========================================

  createOrder(
    payload: CreateOrderRequest
  ): Observable<CreateOrderResponse> {

    return this.http.post<CreateOrderResponse>(
      this.baseUrl,
      payload,
      {
        headers: this.getAuthorizationHeaders()
      }
    );
  }

  // ==========================================
  // Get My Orders
  // GET /orders
  // ==========================================

  getMyOrders(): Observable<GetOrdersResponse> {

    return this.http.get<GetOrdersResponse>(
      this.baseUrl,
      {
        headers: this.getAuthorizationHeaders()
      }
    );
  }

  // ==========================================
  // Get Order By ID
  // GET /orders/:id
  // ==========================================

  getOrderById(
    orderId: string
  ): Observable<GetOrderResponse> {

    return this.http.get<GetOrderResponse>(
      `${this.baseUrl}/${orderId}`,
      {
        headers: this.getAuthorizationHeaders()
      }
    );
  }
  cancelOrder(
  orderId: string
): Observable<cancelOrderResponse> {

  return this.http.patch<cancelOrderResponse>(
    `${this.baseUrl}/${orderId}/cancel`,
    {},
    {
      headers: this.getAuthorizationHeaders()
    }
  );
}
}