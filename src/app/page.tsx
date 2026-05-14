import Link from 'next/link';

const NICHES = [
  { label: 'Musicians',      color: 'bg-purple-100 text-purple-800', icon: '🎵' },
  { label: 'Fitness Coaches', color: 'bg-orange-100 text-orange-800', icon: '💪' },
  { label: 'Podcasters',     color: 'bg-blue-100 text-blue-800',     icon: '🎙️' },
  { label: 'Visual Artists', color: 'bg-teal-100 text-teal-800',     icon: '🎨' },
  { label: 'Streamers',      color: 'bg-amber-100 text-amber-800',   icon: '🎮' },
];

const FEATURES = [
  { icon: '✦', title: 'Niche-perfect pages', desc: 'Not a blank template — a page that already speaks your creator language. Musicians get stream flows. Coaches get booking CTAs. Artists get commission forms.' },
  { icon: '📊', title: 'Analytics that actually help', desc: 'See which links convert, where your traffic comes from, and how your page performs week-over-week. All in a clean dashboard.' },
  { icon: '💸', title: 'Built to earn', desc: 'Add a tip button, sell products, capture email leads, or drive bookings — all from one URL. Monetization is first-class, not an afterthought.' },
];

const PLANS = [
  { name: 'Free', price: '$0', desc: 'Get started today', features: ['4 links', 'All niche templates', 'Basic analytics', 'LinkStage branding'], cta: 'Get started free', href: '/login', highlight: false },
  { name: 'Pro', price: '$7', per: '/mo', desc: 'For serious creators', features: ['Unlimited links', 'Full analytics', 'Custom domain', 'No branding'], cta: 'Start Pro', href: '/login?plan=pro', highlight: true },
  { name: 'Creator', price: '$15', per: '/mo', desc: 'Maximum monetization', features: ['Everything in Pro', 'Email collector', 'Tip button', 'Link scheduling', 'QR code'], cta: 'Start Creator', href: '/login?plan=creator', highlight: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-[family-name:var(--font-syne)] text-xl font-bold tracking-tight">
            Link<span className="text-purple-600">Stage</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
            <Link href="/login?signup=true" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">Get started free →</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-100 mb-6">
            ✦ Built for real creators — not just anyone
          </div>
          <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 mb-6">
            Your whole world.<br /><span className="text-purple-600">One link.</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
            LinkStage gives every creator a niche-perfect home page — not a generic list, but a page built for <em>how you actually work</em>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login?signup=true" className="bg-gray-900 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-700 transition-colors">Get your free page →</Link>
            <Link href="#pricing" className="bg-white text-gray-600 px-7 py-3.5 rounded-xl text-base font-semibold border border-gray-200 hover:border-gray-300 transition-colors">See pricing</Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">Free forever · No credit card required</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-14 max-w-xl mx-auto">
          {NICHES.map((n) => (
            <span key={n.label} className={`${n.color} text-sm font-medium px-3 py-1.5 rounded-full`}>{n.icon} {n.label}</span>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-gray-900 mb-3">Everything you need. Nothing you don't.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold text-gray-900 mb-3">Simple pricing. Real value.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-7 border flex flex-col ${plan.highlight ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-500 ring-offset-2' : 'border-gray-200 bg-white'}`}>
                {plan.highlight && <div className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full self-start mb-4">Most popular</div>}
                <div className="mb-5">
                  <div className="font-[family-name:var(--font-syne)] text-lg font-bold text-gray-900">{plan.name}</div>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                    {plan.per && <span className="text-gray-400 text-sm">{plan.per}</span>}
                  </div>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700"><span className="text-purple-500 mt-0.5">✓</span>{f}</li>
                  ))}
                </ul>
                <Link href={plan.href} className={`text-center py-3 rounded-xl text-sm font-semibold transition-colors ${plan.highlight ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-[family-name:var(--font-syne)] text-4xl font-extrabold mb-4">Ready to own your link?</h2>
          <p className="text-gray-400 text-lg mb-8">Your page is ready in 2 minutes. Free forever.</p>
          <Link href="/login?signup=true" className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl text-base font-bold hover:bg-gray-100 transition-colors">Create your LinkStage page →</Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} LinkStage · Built for creators, by creators</p>
      </footer>
    </div>
  );
}