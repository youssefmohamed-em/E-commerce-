export interface HomeHeroSlide {
  image: string;
  subtitle: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface HomeHeroData {
  slides: HomeHeroSlide[];
}

export interface HomeHeroResponse {
  success: boolean;
  data: HomeHeroData;
}