import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  map,
  Observable
} from 'rxjs';

import {
  HomeHeroData,
  HomeHeroResponse
} from '../mdoels/home-hero';

import {
  ConfigService
} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly http =
    inject(HttpClient);

  private readonly configService =
    inject(ConfigService);

  private readonly heroUrl =
    `${this.configService.apiBaseUrl}/home/hero`;

  getHero(): Observable<HomeHeroData> {

    return this.http
      .get<HomeHeroResponse>(
        this.heroUrl
      )
      .pipe(
        map(response => response.data)
      );
  }
}