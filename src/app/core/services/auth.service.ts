import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal
} from '@angular/core';

import { map, Observable } from 'rxjs';

import type {
  LoginResponse,
  User
} from '../mdoels/user';

import { ConfigService } from './config.service';

interface LoginRequest {
  email: string;
  password: string;
}

interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    access_Token: string;
  };
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http =
    inject(HttpClient);

  private readonly platformId =
    inject(PLATFORM_ID);

  private readonly configService =
    inject(ConfigService);

  // =========================
  // Endpoints
  // =========================

  private readonly authUrl =
    `${this.configService.apiBaseUrl}/auth`;

  private readonly loginUrl =
    `${this.authUrl}/login`;

  private readonly refreshUrl =
    `${this.authUrl}/refresh`;

    private readonly registerUrl =
    `${this.authUrl}/register`;

  // =========================
  // Storage
  // =========================

  private readonly storageKey =
    'current_user';

  private readonly tokenKey =
    'access_token';

  private readonly refreshTokenKey =
    'refresh_token';

  // =========================
  // User State
  // =========================

  private readonly currentUserState =
    signal<User | null>(
      this.getStoredUser()
    );

  readonly currentUser =
    this.currentUserState.asReadonly();

  readonly isLoggedIn =
    computed(
      () =>
        this.currentUserState() !== null
    );

  // =========================
  // Login
  // =========================

  login(
    email: string,
    password: string
  ): Observable<User> {

    const payload: LoginRequest = {
      email,
      password
    };

    return this.http
      .post<LoginResponse>(
        this.loginUrl,
        payload
      )
      .pipe(
        map(response => {

          const user =
            response.data.user;

          const accessToken =
            response.data.access_Token;

          const refreshToken =
            response.data.refresh_Token;

          this.setSession(
            user,
            accessToken,
            refreshToken
          );

          return user;
        })
      );
  }

  // =========================
  // Refresh Token
  // =========================

  refreshToken(): Observable<string> {

    const refreshToken =
      this.getRefreshToken();

    return this.http
      .post<RefreshResponse>(
        this.refreshUrl,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${refreshToken}`
          }
        }
      )
      .pipe(
        map(response => {

          const newAccessToken =
            response.data.access_Token;

          this.setAccessToken(
            newAccessToken
          );

          return newAccessToken;
        })
      );
  }

  // =========================
  // Logout
  // =========================

  logout(): void {

    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      localStorage.removeItem(
        this.storageKey
      );

      localStorage.removeItem(
        this.tokenKey
      );

      localStorage.removeItem(
        this.refreshTokenKey
      );
    }

    this.currentUserState.set(null);
  }

  // =========================
  // Get Access Token
  // =========================

  getToken(): string | null {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return null;
    }

    return localStorage.getItem(
      this.tokenKey
    );
  }

  // =========================
  // Get Refresh Token
  // =========================

  getRefreshToken(): string | null {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return null;
    }

    return localStorage.getItem(
      this.refreshTokenKey
    );
  }

  // =========================
  // Set Access Token
  // =========================

  setAccessToken(
    token: string
  ): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    localStorage.setItem(
      this.tokenKey,
      token
    );
  }

  // =========================
  // Save Session
  // =========================

  private setSession(
    user: User,
    accessToken: string,
    refreshToken: string
  ): void {

    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(user)
      );

      localStorage.setItem(
        this.tokenKey,
        accessToken
      );

      localStorage.setItem(
        this.refreshTokenKey,
        refreshToken
      );
    }

    this.currentUserState.set(user);
  }

  // =========================
  // Get Stored User
  // =========================

  private getStoredUser(): User | null {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return null;
    }

    const storedUser =
      localStorage.getItem(
        this.storageKey
      );

    if (!storedUser) {
      return null;
    }

    try {

      return JSON.parse(
        storedUser
      ) as User;

    } catch {

      localStorage.removeItem(
        this.storageKey
      );

      return null;
    }
  }
// =========================
// Register
// =========================

register(
  name: string,
  email: string,
  password: string
): Observable<User> {

  const payload: RegisterRequest = {
    name,
    email,
    password
  };

  return this.http
    .post<RegisterResponse>(
      this.registerUrl,
      payload
    )
    .pipe(
      map(response => {

        return response.data.user;

      })
    );
}

  
}