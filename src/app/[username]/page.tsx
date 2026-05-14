import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase';
import type { Profile, Link as LinkType } from '@/types';
import PublicPageClient from './PublicPageClient';
export const dynamic = 'force-dynamic';
interface Props { params: { username: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const db = createServiceClient();
  const { data: profile } = await db.from('profiles').select('display_name, bio, username').eq('username', params.username).single();
  if (!profile) return { title: 'Not found' };
  return {
    title: `${profile.display_name ?? profile.username} | LinkStage`,
    description: profile.bio ?? `Check out ${profile.display_name}'s links`,
  };
}

export default async function PublicCreatorPage({ params }: Props) {
  const db = createServiceClient();
  const { data: profile } = await db.from('profiles').select('*').eq('username', params.username).single();
  if (!profile) notFound();
  const { data: links } = await db.from('links').select('*').eq('profile_id', profile.id).eq('is_active', true).order('position');
  db.from('analytics').insert({ profile_id: profile.id, event_type: 'page_view' }).then(() => {});
  return <PublicPageClient profile={profile as Profile} links={(links ?? []) as LinkType[]} />;
}