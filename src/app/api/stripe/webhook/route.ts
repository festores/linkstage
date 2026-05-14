export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { stripe } = await import('@/lib/stripe');
  const { createServiceClient } = await import('@/lib/supabase');
  const Stripe = (await import('stripe')).default;

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = createServiceClient();
  const PLAN_MAP: Record<string, string> = {
    [process.env.STRIPE_PRO_PRICE_ID ?? '']: 'pro',
    [process.env.STRIPE_CREATOR_PRICE_ID ?? '']: 'creator',
  };

  if (['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
    const sub = event.data.object;
    const userId = sub.metadata?.userId;
    if (userId) {
      const priceId = sub.items.data[0]?.price.id;
      const plan = PLAN_MAP[priceId] ?? 'free';
      const active = sub.status === 'active' || sub.status === 'trialing';
      await db.from('profiles').update({
        plan: active ? plan : 'free',
        stripe_subscription_id: active ? sub.id : null,
      }).eq('id', userId);
    }
  }
  return NextResponse.json({ received: true });
}