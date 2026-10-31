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
  AboutData,
  AboutResponse
} from '../mdoels/about';

import {
  ConfigService
} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  private readonly http =
    inject(HttpClient);

  private readonly configService =
    inject(ConfigService);

  private readonly baseUrl =
    `${this.configService.apiBaseUrl}/about`;

  getAbout(): Observable<AboutData> {

    return this.http
      .get<AboutResponse>(
        this.baseUrl
      )
      .pipe(
        map(response => response.data)
      );
  }
}