import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './featured-categories.component.html',
  styleUrl: './featured-categories.component.scss'
})
export class FeaturedCategoriesComponent {

  @ViewChild('categoriesSection')
  categoriesSection!: ElementRef<HTMLElement>;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly destroyRef: DestroyRef
  ) {

    afterNextRender(() => {

      // afterNextRender does not run during SSR, and this guard also keeps the
      // browser-only APIs below out of any server rendering path.
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      const section = this.categoriesSection?.nativeElement;

      if (!section) {
        return;
      }

      // Keep SSR content visible unless the browser can enhance it with the
      // scroll animation.
      if (typeof IntersectionObserver === 'undefined') {
        return;
      }

      section.classList.add('is-pending');

      try {
        const observer = new IntersectionObserver(
          (entries) => {

            entries.forEach((entry) => {

              if (entry.isIntersecting) {

                section.classList.add('visible');

                // Animation runs only once.
                observer.unobserve(section);
              }

            });

          },
          {
            threshold: 0.2
          }
        );

        observer.observe(section);

        this.destroyRef.onDestroy(() => observer.disconnect());
      } catch {
        // If setup fails, preserve the visible SSR fallback.
        section.classList.remove('is-pending');
      }

    });

  }
}
