'use client';
import { supabase } from '@/lib/supabase';
import { NICHES } from '@/lib/niches';
import type { Profile, Link as LinkType } from '@/types';

interface Props { profile: Profile; links: LinkType[] }

export default function PublicPageClient({ profile, links }: Props) {
  const niche = NICHES[profile.niche as keyof typeof NICHES] ?? NICHES.musician;
  const initials = (profile.display_name ?? profile.username).split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  async function handleLinkClick(link: LinkType) {
    supabase.from('analytics').insert({ profile_id: profile.id, link_id: link.id, event_type: 'link_click' }).then(() => {});
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: '#f8f8fc' }}>
      <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-xl border border-white/60 bg-white">
        <div className="px-6 pt-8 pb-6 text-center" style={{ background: niche.color50, borderBottom: `1px solid ${niche.color100}` }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name ?? ''} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: niche.color100 }} />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3" style={{ background: niche.color100, color: niche.color800 }}>
              {initials}
            </div>
          )}
          <h1 className="font-bold text-base" style={{ color: niche.color800 }}>{profile.display_name ?? profile.username}</h1>
          <p className="text-xs mt-1" style={{ color: niche.color600 }}>@{profile.username}</p>
          {profile.bio && <p className="text-xs mt-2 leading-relaxed" style={{ color: niche.color600 }}>{profile.bio}</p>}
        </div>

        <div className="px-5 py-4 space-y-3">
          {links.length === 0 && <p className="text-center text-sm text-gray-400 py-6">No links yet.</p>}
          {links.map((link, i) => (
            <button key={link.id} onClick={() => handleLinkClick(link)}
              className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 border transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={i === 0 ? { background: niche.color50, borderColor: niche.color100 } : { background: '#fff', borderColor: '#e5e7eb' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
                style={i === 0 ? { background: niche.color100, color: niche.color800 } : { background: '#f3f4f6', color: '#9ca3af' }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: i === 0 ? niche.color800 : '#111827' }}>{link.title}</p>
                {link.subtitle && <p className="text-xs truncate" style={{ color: i === 0 ? niche.color600 : '#9ca3af' }}>{link.subtitle}</p>}
              </div>
              <span style={{ color: i === 0 ? niche.color600 : '#d1d5db' }}>→</span>
            </button>
          ))}
        </div>

        {niche.socials.length > 0 && (
          <div className="px-5 pb-4 flex flex-wrap gap-2 justify-center">
            {niche.socials.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-lg border" style={{ borderColor: '#e5e7eb', color: '#9ca3af' }}>{s}</span>
            ))}
          </div>
        )}

        <div className="px-5 py-3 border-t border-gray-100 text-center">
          {profile.plan === 'free' ? (
            <a href="https://linkstage.io" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-300 hover:text-gray-400">
              Powered by Link<span style={{ color: niche.color600 }}>Stage</span>
            </a>
          ) : (
            <span className="text-xs text-gray-200">linkstage.io/{profile.username}</span>
          )}
        </div>
      </div>
    </div>
  );
}