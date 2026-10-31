import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import {
  CategoriesResponse,
  Category
} from '../mdoels/category';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  private readonly baseUrl =
    `${this.configService.apiBaseUrl}/categories`;

  getCategories(): Observable<Category[]> {

    return this.http
      .get<CategoriesResponse>(this.baseUrl)
      .pipe(
        map(response => response.categories)
      );
  }

  getCategoryById(
    categoryId: string
  ): Observable<Category> {

    return this.http
      .get<{ category: Category }>(
        `${this.baseUrl}/${categoryId}`
      )
      .pipe(
        map(response => response.category)
      );
  }
}