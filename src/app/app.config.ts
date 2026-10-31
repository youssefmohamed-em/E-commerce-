import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

import { provideToastr } from 'ngx-toastr';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient,withFetch,withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),
     provideHttpClient(
    withInterceptors([
      authInterceptor
    ]),
    withFetch()
  ),
    provideAnimations(),
    provideToastr({
      positionClass:"toast-top-right",
      timeOut:2500,
      progressBar:true,
      closeButton:true,
      preventDuplicates:true,
    })
  ]
};
