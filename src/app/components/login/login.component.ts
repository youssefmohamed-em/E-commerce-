import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly loginError = signal('');

  email = '';
  password = '';
  rememberMe = false;

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {

    this.loginError.set('');

    if (!this.email || !this.password) {
      this.loginError.set(
        'Please enter your email and password.'
      );
      return;
    }

    this.isLoading.set(true);

    this.authService
      .login(this.email, this.password)
      .subscribe({
        next: user => {

          this.isLoading.set(false);

          if (!user) {
            this.loginError.set(
              'Invalid email or password.'
            );
            return;
          }

          this.toastr.success('Welcome back');

          const returnUrl =
            this.activatedRoute.snapshot.queryParamMap
              .get('returnUrl');

          this.router.navigateByUrl(
            returnUrl || '/home'
          );
        },

        error: () => {

          this.isLoading.set(false);

          this.loginError.set(
            'Something went wrong. Please try again.'
          );
        }
      });
  }
}