import { Component, inject, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  // =========================
  // Signals
  // =========================

  readonly isLoading = signal(false);

  readonly errorMessage = signal('');

  readonly successMessage = signal('');

  readonly showPassword = signal(false);
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  // =========================
  // Form
  // =========================

  readonly signupForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]

  });


  //

  //
  // =========================
  // toggle password
  // =========================

   togglePassword():void{
    this.showPassword.update(
      show => !show
    )
  }
  //
  // =========================
  // Submit
  // =========================

  onSubmit(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.signupForm.invalid) {

      this.signupForm.markAllAsTouched();

      return;
    }

    const {
      name,
      email,
      password
    } = this.signupForm.getRawValue();

    this.isLoading.set(true);

    this.authService
      .register(
        name,
        email,
        password
      )
      .subscribe({

        next: (user) => {

          this.isLoading.set(false);

          this.successMessage.set(
            'Account created successfully'
          );

          console.log(
            'Registered user:',
            user
          );

          this.signupForm.reset();
        },

        error: (error) => {

          this.isLoading.set(false);

          console.error(
            'Signup error:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Something went wrong. Please try again.'
          );
        }

      });
  }
}