import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FeaturedCategoriesComponent } from './sections/featured-categories/featured-categories.component';
import { AboutSectionComponent } from './sections/about-section/about-section.component';

import { AboutData } from '../../core/mdoels/about';
import { AboutService } from '../../core/services/about.service';

import { HomeHeroData } from '../../core/mdoels/home-hero';
import { HomeService } from '../../core/services/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FeaturedCategoriesComponent,
    RouterLink,
    AboutSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  aboutData: AboutData | null = null;

  heroData: HomeHeroData | null = null;

  currentSlide = 0;

  heroLoading = true;
  heroError = false;

  private autoPlayInterval?: ReturnType<typeof setInterval>;

  private readonly aboutService = inject(AboutService);

  private readonly homeService = inject(HomeService);

  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {

    this.loadHeroData();

    this.loadAboutData();

  }

  private loadHeroData(): void {

    this.heroLoading = true;
    this.heroError = false;

    this.homeService
      .getHero()
      .subscribe({

        next: (data) => {

          this.heroData = data;

          this.currentSlide = 0;

          this.heroLoading = false;

          this.startAutoPlay();

        },

        error: (error) => {

          console.error(
            'Failed to load Hero data:',
            error
          );

          this.heroData = null;

          this.heroLoading = false;

          this.heroError = true;

        }

      });

  }

  private loadAboutData(): void {

    this.aboutService
      .getAbout()
      .subscribe({

        next: (data) => {

          this.aboutData = data;

        },

        error: (error) => {

          console.error(
            'Failed to load About data:',
            error
          );

        }

      });

  }

  nextSlide(): void {

    if (
      !this.heroData ||
      this.heroData.slides.length === 0
    ) {
      return;
    }

    this.currentSlide =
      (this.currentSlide + 1) %
      this.heroData.slides.length;

    this.restartAutoPlay();

  }

  previousSlide(): void {

    if (
      !this.heroData ||
      this.heroData.slides.length === 0
    ) {
      return;
    }

    this.currentSlide =
      (
        this.currentSlide -
        1 +
        this.heroData.slides.length
      ) %
      this.heroData.slides.length;

    this.restartAutoPlay();

  }

  goToSlide(index: number): void {

    if (
      !this.heroData ||
      index < 0 ||
      index >= this.heroData.slides.length
    ) {
      return;
    }

    this.currentSlide = index;

    this.restartAutoPlay();

  }

  private startAutoPlay(): void {

    if (
      !isPlatformBrowser(this.platformId) ||
      !this.heroData ||
      this.heroData.slides.length <= 1
    ) {
      return;
    }

    this.stopAutoPlay();

    this.autoPlayInterval = setInterval(() => {

      if (!this.heroData) {
        return;
      }

      this.currentSlide =
        (this.currentSlide + 1) %
        this.heroData.slides.length;

    }, 5000);

  }

  private restartAutoPlay(): void {

    if (
      !isPlatformBrowser(this.platformId) ||
      !this.heroData ||
      this.heroData.slides.length <= 1
    ) {
      return;
    }

    this.startAutoPlay();

  }

  private stopAutoPlay(): void {

    if (this.autoPlayInterval) {

      clearInterval(this.autoPlayInterval);

      this.autoPlayInterval = undefined;

    }

  }

  ngOnDestroy(): void {

    this.stopAutoPlay();

  }
}