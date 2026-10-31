import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

import {
  LucideAngularModule,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  LogOut,
  UserRound,
  PackageCheck
} from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  readonly Heart = Heart;
  readonly ShoppingCart = ShoppingCart;
  readonly Menu = Menu;
  readonly X = X;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly Bell = Bell;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;
  readonly UserRound = UserRound;
  readonly PackageCheck = PackageCheck;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);

  readonly cartCount = this.cartService.cartCount;
  readonly clientReady = signal(false);
notificationCount = signal(3);

openNotifications(): void {
  console.log('Notifications clicked');
}
  // Auth state
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;

  isMenuOpen = false;
  isUserMenuOpen = false;
  isDarkMode = false;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.isDarkMode =
          localStorage.getItem('theme') === 'dark';

        document.documentElement.classList.toggle(
          'dark',
          this.isDarkMode
        );
      }

      this.clientReady.set(true);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
    this.closeMenu();
    this.router.navigate(['/home']);
  }

  @HostListener('document:click', ['$event'])
  closeUserMenuOnOutsideClick(event: MouseEvent): void {
    const userMenu =
      this.elementRef.nativeElement.querySelector('.user-menu');

    if (!userMenu?.contains(event.target as Node)) {
      this.closeUserMenu();
    }
  }

  @HostListener('document:keydown.escape')
  closeUserMenuOnEscape(): void {
    this.closeUserMenu();
  }

  toggleTheme(): void {

    // منع تشغيل Browser APIs أثناء SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isDarkMode = !this.isDarkMode;

    document.documentElement.classList.toggle(
      'dark',
      this.isDarkMode
    );

    localStorage.setItem(
      'theme',
      this.isDarkMode ? 'dark' : 'light'
    );
  }
}