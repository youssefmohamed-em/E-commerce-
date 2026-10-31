import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/mdoels/category';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  private readonly categoryService =
    inject(CategoryService);

  readonly loading = signal(false);
  readonly error = signal(false);

  readonly categories =
    signal<Category[]>([]);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {

    this.loading.set(true);
    this.error.set(false);

    this.categoryService
      .getCategories()
      .subscribe({

        next: (categories) => {

          this.categories.set(categories);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Failed to load categories:',
            error
          );

          this.categories.set([]);

          this.error.set(true);
          this.loading.set(false);

        }

      });
  }
}