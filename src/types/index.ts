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

export type ProviderOption = 'openai' | 'gemini' | 'anthropic';

export interface AppSettings {
  provider: ProviderOption;
  openaiApiKey: string;
  geminiApiKey: string;
  anthropicApiKey?: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  language?: string;
  emailNotifications?: boolean;

  // Shopify Integration Credentials
  shopifyShopUrl?: string;
  shopifyAccessToken?: string;
  shopifyActive?: boolean;

  // WooCommerce Integration Credentials
  wooUrl?: string;
  wooConsumerKey?: string;
  wooConsumerSecret?: string;
  wooActive?: boolean;
}
