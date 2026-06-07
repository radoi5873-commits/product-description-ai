export type ToneOption = 'professional' | 'commercial' | 'luxury' | 'dynamic';

export interface ProductInput {
  name: string;
  category: string;
  targetAudience: string;
  tone: ToneOption;
}

export interface GenerationResult {
  id: string;
  timestamp: number;
  input: ProductInput;
  title: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  cta: string;
  seoMeta: string;
}

export interface AppSettings {
  apiKey: string;
}
