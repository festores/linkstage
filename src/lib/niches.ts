import { Niche } from '@/types';

export interface NicheConfig {
  label: string;
  icon: string;
  color50: string;
  color100: string;
  color600: string;
  color800: string;
  defaultBio: string;
  defaultLinks: { title: string; subtitle: string; icon: string; url: string }[];
  socials: string[];
}

export const NICHES: Record<Niche, NicheConfig> = {
  musician: {
    label: 'Musician', icon: 'ti-music',
    color50: '#EEEDFE', color100: '#CECBF6', color600: '#534AB7', color800: '#3C3489',
    defaultBio: 'Indie artist · Singer/Songwriter · New music out now',
    defaultLinks: [
      { title: 'Stream my latest track', subtitle: 'Out now on all platforms', icon: 'ti-player-play', url: '#' },
      { title: 'Tour Dates & Tickets',   subtitle: 'See you on the road',      icon: 'ti-ticket',      url: '#' },
      { title: 'Official Merch Store',   subtitle: 'Limited drops',            icon: 'ti-shirt',       url: '#' },
      { title: 'Patreon — Exclusive Content', subtitle: 'Behind the music',    icon: 'ti-heart',       url: '#' },
    ],
    socials: ['Spotify', 'Apple Music', 'Instagram', 'TikTok'],
  },
  fitness: {
    label: 'Fitness', icon: 'ti-activity',
    color50: '#FAECE7', color100: '#F5C4B3', color600: '#993C1D', color800: '#712B13',
    defaultBio: 'Certified Coach · Online Training · Transforming lives',
    defaultLinks: [
      { title: 'Book a Free Coaching Call', subtitle: 'Limited spots available', icon: 'ti-calendar', url: '#' },
      { title: '12-Week Transformation',    subtitle: 'Program — $49',           icon: 'ti-trophy',   url: '#' },
      { title: 'Custom Nutrition Plans',    subtitle: 'Starting at $29/mo',      icon: 'ti-leaf',     url: '#' },
      { title: 'Join the Community',        subtitle: '2,400+ members',          icon: 'ti-users',    url: '#' },
    ],
    socials: ['Instagram', 'TikTok', 'YouTube', 'Twitter'],
  },
  podcaster: {
    label: 'Podcaster', icon: 'ti-microphone',
    color50: '#E6F1FB', color100: '#B5D4F4', color600: '#185FA5', color800: '#0C447C',
    defaultBio: 'Weekly conversations that change how you see the world',
    defaultLinks: [
      { title: 'Listen to the Latest Episode', subtitle: 'New episode every week', icon: 'ti-player-play', url: '#' },
      { title: 'Subscribe to the Newsletter',  subtitle: 'Free weekly insights',   icon: 'ti-mail',       url: '#' },
      { title: 'Support the Show',             subtitle: 'Buy me a coffee',        icon: 'ti-coffee',     url: '#' },
      { title: 'Episode Notes & Archive',      subtitle: 'All episodes',           icon: 'ti-book',       url: '#' },
    ],
    socials: ['Spotify', 'Apple Podcasts', 'YouTube', 'Twitter'],
  },
  artist: {
    label: 'Artist', icon: 'ti-palette',
    color50: '#E1F5EE', color100: '#9FE1CB', color600: '#0F6E56', color800: '#085041',
    defaultBio: 'Digital artist · Commissions open · Prints & downloads',
    defaultLinks: [
      { title: 'View Full Portfolio',    subtitle: '100+ artworks',          icon: 'ti-photo',         url: '#' },
      { title: 'Commission a Piece',     subtitle: 'Open · 2 wk turnaround', icon: 'ti-pencil',        url: '#' },
      { title: 'Prints & Digital Files', subtitle: 'Instant download',       icon: 'ti-shopping-cart', url: '#' },
      { title: 'Art Tutorial Course',    subtitle: 'Beginner to pro',        icon: 'ti-school',        url: '#' },
    ],
    socials: ['Instagram', 'Behance', 'ArtStation', 'Pinterest'],
  },
  streamer: {
    label: 'Streamer', icon: 'ti-device-gamepad',
    color50: '#FAEEDA', color100: '#FAC775', color600: '#854F0B', color800: '#633806',
    defaultBio: 'Variety streamer · LIVE every night 9PM EST',
    defaultLinks: [
      { title: 'Watch LIVE on Twitch',   subtitle: 'LIVE NOW · come hang',   icon: 'ti-radio',         url: '#' },
      { title: 'YouTube — Clips & VODs', subtitle: 'Best moments',           icon: 'ti-brand-youtube', url: '#' },
      { title: 'Channel Membership',     subtitle: 'Exclusive perks',        icon: 'ti-star',          url: '#' },
      { title: 'Official Merch Drop',    subtitle: 'Limited edition',        icon: 'ti-shirt',         url: '#' },
    ],
    socials: ['Twitch', 'YouTube', 'Discord', 'TikTok'],
  },
};