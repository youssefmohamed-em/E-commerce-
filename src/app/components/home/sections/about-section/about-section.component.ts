import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  LucideAngularModule,
  ArrowRight,
  Heart,
  ShieldCheck,
  Sparkles
} from 'lucide-angular';

import { AboutData } from '../../../../core/mdoels/about';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss'
})
export class AboutSectionComponent
  implements AfterViewInit, OnDestroy {

  @Input({ required: true })
  aboutData!: AboutData;

  readonly ArrowRight = ArrowRight;
  readonly Heart = Heart;
  readonly ShieldCheck = ShieldCheck;
  readonly Sparkles = Sparkles;

  private observer?: IntersectionObserver;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,

    @Inject(PLATFORM_ID)
    private readonly platformId: object
  ) {}

  ngAfterViewInit(): void {

    if (
      !isPlatformBrowser(this.platformId) ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    this.setupScrollAnimation();
  }

  private setupScrollAnimation(): void {

    this.observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            const element =
              entry.target as HTMLElement;

            if (entry.isIntersecting) {

              element.classList.add(
                'is-visible'
              );

            } else {

              element.classList.remove(
                'is-visible'
              );

            }

          });

        },
        {
          threshold: 0.15,
          rootMargin:
            '0px 0px -80px 0px'
        }
      );

    const section =
      this.elementRef.nativeElement
        .querySelector(
          '.about-section'
        );

    if (section) {
      this.observer.observe(section);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
