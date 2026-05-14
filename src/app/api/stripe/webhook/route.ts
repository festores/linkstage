import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import type Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const PLAN_MAP: Record<string, string> = {
  [process.env.STRIPE_PRO_PRICE_ID ?? '']: 'pro',
  [process.env.STRIPE_CREATOR_PRICE_ID ?? '']: 'creator',
};

async function updateUserPlan(subscription: Stripe.Subscription, db: ReturnType<typeof createServiceClient>) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;
  const priceId = subscription.items.data[0]?.price.id;
  const plan = PLAN_MAP[priceId] ?? 'free';
  const active = subscription.status === 'active' || subscription.status === 'trialing';
  await db.from('profiles').update({
    plan: active ? plan : 'free',
    stripe_subscription_id: active ? subscription.id : null,
  }).eq('id', userId);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  const db = createServiceClient();
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await updateUserPlan(event.data.object as Stripe.Subscription, db);
      break;
  }
  return NextResponse.json({ received: true });
}