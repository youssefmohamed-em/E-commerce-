import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';

import { AuthService } from '../services/auth.service';

let isRefreshing = false;

const refreshTokenSubject =
  new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const authService =
    inject(AuthService);

  const accessToken =
    authService.getToken();

  const isAuthRequest =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh');

  // --------------------------------
  // Add Access Token
  // --------------------------------

  let authReq = req;

  if (
    accessToken &&
    !isAuthRequest
  ) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // --------------------------------
  // Send Request
  // --------------------------------

  return next(authReq).pipe(

    catchError(
      (error: HttpErrorResponse) => {

        // Don't refresh auth requests
        if (
          error.status !== 401 ||
          isAuthRequest
        ) {
          return throwError(
            () => error
          );
        }

        const refreshToken =
          authService.getRefreshToken();

        // No refresh token
        if (!refreshToken) {

          authService.logout();

          return throwError(
            () => error
          );
        }

        // --------------------------------
        // Refresh already in progress
        // --------------------------------

        if (isRefreshing) {

          return refreshTokenSubject.pipe(

            filter(
              token => token !== null
            ),

            take(1),

            switchMap(
              newAccessToken => {

                const retryRequest =
                  req.clone({
                    setHeaders: {
                      Authorization:
                        `Bearer ${newAccessToken}`
                    }
                  });

                return next(
                  retryRequest
                );
              }
            )
          );
        }

        // --------------------------------
        // Start Refresh
        // --------------------------------

        isRefreshing = true;

        refreshTokenSubject.next(null);

        return authService
          .refreshToken()
          .pipe(

            switchMap(
              newAccessToken => {

                isRefreshing = false;

                refreshTokenSubject.next(
                  newAccessToken
                );

                const retryRequest =
                  req.clone({
                    setHeaders: {
                      Authorization:
                        `Bearer ${newAccessToken}`
                    }
                  });

                return next(
                  retryRequest
                );
              }
            ),

            catchError(
              refreshError => {

                isRefreshing = false;

                refreshTokenSubject.next(
                  null
                );

                authService.logout();

                return throwError(
                  () => refreshError
                );
              }
            )
          );
      }
    )
  );
};