import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private readonly config = environment;

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  get flavor(): string {
    return this.config.flavor;
  }

  get isProduction(): boolean {
    return this.config.production;
  }
}