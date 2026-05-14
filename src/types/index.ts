export type Niche = 'musician' | 'fitness' | 'podcaster' | 'artist' | 'streamer';
export type Plan  = 'free' | 'pro' | 'creator';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  niche: Niche;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  subtitle: string | null;
  url: string;
  icon: string;
  position: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AnalyticsSummary {
  profile_id: string;
  total_views: number;
  total_clicks: number;
  views_7d: number;
  clicks_7d: number;
}