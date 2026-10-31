import { Component, inject } from '@angular/core';
import { Router,  } from '@angular/router';

import {
  LucideAngularModule,
  UserRound,
  Mail,
  LogOut,
  ShoppingBag,
  Heart,
  Settings
} from 'lucide-angular';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    LucideAngularModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;

  readonly UserRound = UserRound;
  readonly Mail = Mail;
  readonly LogOut = LogOut;
  readonly ShoppingBag = ShoppingBag;
  readonly Heart = Heart;
  readonly Settings = Settings;

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/home']);
  }
}