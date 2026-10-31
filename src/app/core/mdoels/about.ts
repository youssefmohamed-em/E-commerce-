export interface AboutHero {
  label: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  cardTitle: string;
  cardDescription: string;
  qualityTitle: string;
  qualityDescription: string;
  customerTitle: string;
  customerDescription: string;
}

export interface AboutStory {
  label: string;
  title: string;
  highlight: string;
  paragraphs: string[];
  image: string;
  highlightTitle: string;
  highlightDescription: string;
}

export interface MissionItem {
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface AboutMission {
  label: string;
  title: string;
  highlight: string;
  ending: string;
  description: string;
  items: MissionItem[];
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface WhyShoplyItem {
  title: string;
  description: string;
  icon: string;
}

export interface AboutWhyShoply {
  label: string;
  title: string;
  highlight: string;
  description: string;
  items: WhyShoplyItem[];
}

export interface AboutCta {
  label: string;
  title: string;
  highlight: string;
  description: string;
  buttonText: string;
}

export interface AboutData {
  hero: AboutHero;
  story: AboutStory;
  mission: AboutMission;
  stats: AboutStat[];
  whyShoply: AboutWhyShoply;
  cta: AboutCta;
}

export interface AboutResponse {
  success: boolean;
  data: AboutData;
}