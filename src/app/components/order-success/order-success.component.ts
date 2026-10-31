import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  LucideAngularModule,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  ArrowRight
} from 'lucide-angular';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [
    LucideAngularModule
  ],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss'
})
export class OrderSuccessComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly CheckCircle2 = CheckCircle2;
  readonly PackageCheck = PackageCheck;
  readonly ShoppingBag = ShoppingBag;
  readonly ArrowRight = ArrowRight;

  readonly orderId =
    this.route.snapshot.paramMap.get('orderId') ?? '';

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  viewOrder(): void {
    this.router.navigate([
      '/orders',
      this.orderId
    ]);
  }
}