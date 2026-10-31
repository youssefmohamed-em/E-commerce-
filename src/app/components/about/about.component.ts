import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  LucideAngularModule,
  ArrowRight,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Users,
  ShoppingBag,
  Star
} from 'lucide-angular';

import { AboutData } from '../../core/mdoels/about';
import { AboutService } from '../../core/services/about.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent
  implements OnInit, AfterViewInit, OnDestroy {

  aboutData: AboutData | null = null;

  readonly loading = signal(true);
  readonly error = signal(false);

  readonly ArrowRight = ArrowRight;
  readonly Heart = Heart;
  readonly ShieldCheck = ShieldCheck;
  readonly Truck = Truck;
  readonly Sparkles = Sparkles;
  readonly Users = Users;
  readonly ShoppingBag = ShoppingBag;
  readonly Star = Star;

  private observer?: IntersectionObserver;

  constructor(
    private readonly elRef: ElementRef<HTMLElement>,

    @Inject(PLATFORM_ID)
    private readonly platformId: object,

    private readonly aboutService: AboutService
  ) {}

  ngOnInit(): void {
    this.loadAboutData();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    /*
     * If the page is rendered already,
     * try to initialize the observer.
     *
     * If API data is not available yet,
     * loadAboutData() will initialize it
     * after Angular renders the response.
     */
    this.setupScrollAnimations();
  }

  private loadAboutData(): void {

    this.loading.set(true);
    this.error.set(false);

    this.aboutService
      .getAbout()
      .subscribe({

        next: (data) => {

          this.aboutData = data;

          this.loading.set(false);

          /*
           * Wait until Angular renders the
           * API data and creates the sections.
           */
          if (isPlatformBrowser(this.platformId)) {

            requestAnimationFrame(() => {

              this.setupScrollAnimations();

            });

          }
        },

        error: (error) => {

          console.error(
            'Failed to load About data:',
            error
          );

          this.aboutData = null;

          this.loading.set(false);
          this.error.set(true);
        }
      });
  }

  private setupScrollAnimations(): void {

    if (
      !isPlatformBrowser(this.platformId) ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    const sections =
      this.elRef.nativeElement
        .querySelectorAll<HTMLElement>(
          '.animate-section'
        );

    /*
     * API content might not have been rendered yet.
     */
    if (!sections.length) {
      return;
    }

    this.observer?.disconnect();

    /*
     * Prepare sections before observing them.
     */
    sections.forEach((section) => {

      section.classList.add(
        'animation-ready'
      );

    });

    this.observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            /*
             * Ignore sections that are not
             * inside the viewport.
             */
            if (!entry.isIntersecting) {
              return;
            }

            const element =
              entry.target as HTMLElement;

            /*
             * Trigger the animation.
             */
            element.classList.add(
              'in-view'
            );

            /*
             * Run the animation only once.
             */
            this.observer?.unobserve(
              element
            );

          });

        },
        {
          threshold: 0.15,

          rootMargin:
            '0px 0px -80px 0px'
        }
      );

    sections.forEach((section) => {

      this.observer?.observe(section);

    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
