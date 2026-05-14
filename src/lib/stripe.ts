import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null as string | null,
    linkLimit: 4,
    features: ['4 links', 'Basic analytics', 'LinkStage branding', 'All niche templates'],
  },
  pro: {
    name: 'Pro',
    price: 7,
    priceId: process.env.STRIPE_PRO_PRICE_ID as string,
    linkLimit: Infinity,
    features: ['Unlimited links', 'Full analytics', 'Custom domain', 'No branding'],
  },
  creator: {
    name: 'Creator',
    price: 15,
    priceId: process.env.STRIPE_CREATOR_PRICE_ID as string,
    linkLimit: Infinity,
    features: ['Everything in Pro', 'Email collector', 'Tip button', 'Link scheduling', 'QR code'],
  },
} as const;

export type PlanKey = keyof typeof PLANS;