'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { NICHES } from '@/lib/niches';
import { PLANS } from '@/lib/stripe';
import type { Profile, Link as LinkType, AnalyticsSummary } from '@/types';

type Tab = 'links' | 'profile' | 'analytics' | 'upgrade';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [tab, setTab] = useState<Tab>('links');
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editNiche, setEditNiche] = useState<keyof typeof NICHES>('musician');

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
if (!session) { router.push('/login'); return; }
const user = session.user;
      const [{ data: p }, { data: l }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('links').select('*').eq('profile_id', user.id).order('position'),
      ]);
      if (p) { setProfile(p); setEditName(p.display_name ?? ''); setEditBio(p.bio ?? ''); setEditNiche(p.niche); }
      if (l) setLinks(l);
      setLoading(false);
    }
    load();
  }, [router]);

  const niche = profile ? NICHES[profile.niche as keyof typeof NICHES] : NICHES.musician;
  const linkLimit = PLANS[profile?.plan ?? 'free'].linkLimit;
  const atLimit = links.length >= linkLimit;

  async function addLink() {
    if (!profile || !newTitle || !newUrl) return;
    setSaving(true);
    const { data, error } = await supabase.from('links').insert({
      profile_id: profile.id, title: newTitle, subtitle: newSubtitle || null,
      url: newUrl, position: links.length, is_featured: links.length === 0,
    }).select().single();
    if (!error && data) { setLinks([...links, data]); setNewTitle(''); setNewSubtitle(''); setNewUrl(''); }
    setSaving(false);
  }

  async function deleteLink(id: string) {
    await supabase.from('links').delete().eq('id', id);
    setLinks(links.filter((l) => l.id !== id));
  }

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    await supabase.from('profiles').update({ display_name: editName, bio: editBio, niche: editNiche }).eq('id', profile.id);
    setProfile({ ...profile, display_name: editName, bio: editBio, niche: editNiche });
    setSaving(false);
  }

  async function startCheckout(plan: 'pro' | 'creator') {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
      body: JSON.stringify({ plan }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'links', label: 'Links' }, { id: 'profile', label: 'Profile' },
    { id: 'analytics', label: 'Analytics' }, { id: 'upgrade', label: profile?.plan === 'free' ? '✦ Upgrade' : 'Plan' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <span className="font-[family-name:var(--font-syne)] font-bold text-lg">
          Link<span style={{ color: niche.color600 }}>Stage</span>
        </span>
        <div className="flex items-center gap-3">
          {profile && <Link href={`/${profile.username}`} target="_blank" className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5">View page ↗</Link>}
          <button onClick={() => { supabase.auth.signOut(); router.push('/'); }} className="text-xs text-gray-400 hover:text-gray-600">Sign out</button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold">Dashboard</h1>
            {profile && <p className="text-sm text-gray-500 mt-0.5">linkstage.io/{profile.username}</p>}
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full border" style={{ background: niche.color50, color: niche.color800, borderColor: niche.color100 }}>
            {profile?.plan?.toUpperCase()} plan
          </span>
        </div>

        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}>{t.label}</button>
          ))}
        </div>

        {tab === 'links' && (
          <div className="space-y-4">
            {links.length === 0 && <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">No links yet — add your first one below.</div>}
            {links.map((lk, i) => (
              <div key={lk.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={i === 0 ? { background: niche.color50, color: niche.color800 } : { background: '#f3f4f6', color: '#6b7280' }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{lk.title}</p>
                  {lk.subtitle && <p className="text-xs text-gray-400 truncate">{lk.subtitle}</p>}
                </div>
                {i === 0 && <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ background: niche.color50, color: niche.color800, borderColor: niche.color100 }}>Featured</span>}
                <button onClick={() => deleteLink(lk.id)} className="text-gray-300 hover:text-red-500 text-lg leading-none ml-1">×</button>
              </div>
            ))}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold mb-4">
                {atLimit ? <span className="text-amber-600">⚠ Link limit reached. <button onClick={() => setTab('upgrade')} className="underline">Upgrade to add more.</button></span> : 'Add a new link'}
              </h3>
              {!atLimit && (
                <div className="space-y-3">
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Link title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Subtitle (optional)" value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} />
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="URL (https://...)" type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
                  <button onClick={addLink} disabled={saving || !newTitle || !newUrl} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40" style={{ background: niche.color600 }}>
                    {saving ? 'Saving...' : '+ Add link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Display name</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Bio</label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" rows={3} value={editBio} onChange={(e) => setEditBio(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Creator type</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {(Object.entries(NICHES) as [keyof typeof NICHES, typeof NICHES[keyof typeof NICHES]][]).map(([key, n]) => (
                  <button key={key} onClick={() => setEditNiche(key)} className="py-2 rounded-lg border text-xs font-medium transition-all"
                    style={editNiche === key ? { background: n.color50, borderColor: n.color100, color: n.color800 } : { background: '#fff', borderColor: '#e5e7eb', color: '#6b7280' }}>
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving} className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: niche.color600 }}>
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[{ label: 'Total views', value: analytics?.total_views ?? 0 }, { label: 'Total clicks', value: analytics?.total_clicks ?? 0 }, { label: 'Views (7d)', value: analytics?.views_7d ?? 0 }, { label: 'Clicks (7d)', value: analytics?.clicks_7d ?? 0 }].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: niche.color600 }}>{s.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
            {(!analytics || analytics.total_views === 0) && <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">No data yet — share your page to start seeing analytics.</div>}
          </div>
        )}

        {tab === 'upgrade' && (
          <div className="space-y-4">
            {(['free', 'pro', 'creator'] as const).map((planKey) => {
              const plan = PLANS[planKey];
              const isCurrent = profile?.plan === planKey;
              return (
                <div key={planKey} className={`bg-white rounded-xl border p-5 ${isCurrent ? 'border-2' : 'border-gray-200'}`} style={isCurrent ? { borderColor: niche.color600 } : {}}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-2xl font-bold mt-0.5">${plan.price}{plan.price > 0 && <span className="text-sm font-normal text-gray-400">/mo</span>}</p>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: niche.color50, color: niche.color800 }}>Current plan</span>
                    ) : planKey !== 'free' && (
                      <button onClick={() => startCheckout(planKey)} className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: niche.color600 }}>Upgrade →</button>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-gray-600"><span style={{ color: niche.color600 }}>✓</span>{f}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}