import { Badge, Button, Checkbox, SearchInput, Tooltip } from 'pod-test-ui';
import {
  ArrowRight,
  Bell,
  Check,
  ExternalLink,
  Moon,
  Sparkles,
  Star,
  Sun,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Agentation } from 'agentation';
import { IssueCard } from './components/IssueCard.js';
import { enrichAgentationOutput } from './lib/pod-agentation.js';

function ThemeToggle() {
  // Initial value comes from the bootstrap script in index.html (default = dark).
  const [dark, setDark] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('pod-client-theme', dark ? 'dark' : 'light');
    } catch {
      /* ignore quota / private mode */
    }
  }, [dark]);

  return (
    <Tooltip content={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Button
        variant="outline"
        size="sm"
        iconOnly
        leftIcon={dark ? <Sun size={16} /> : <Moon size={16} />}
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle color theme"
      />
    </Tooltip>
  );
}

function Header() {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const navItems = ['Components', 'Tokens', 'Patterns', 'Pricing'];

  // ⌘K / Ctrl+K focuses the search box (matches the visual shortcut hint).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-glow-accent-inset">
            <Sparkles size={16} />
          </div>
          <span className="text-base font-semibold tracking-tight text-text-primary">
            POD
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-muted hover:text-text-primary"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-[260px] lg:block">
          <SearchInput
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search docs…"
            size="sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Tooltip content="Star on GitHub">
            <Button
              variant="outline"
              size="sm"
              iconOnly
              leftIcon={<Star size={16} />}
              aria-label="Star on GitHub"
            />
          </Tooltip>
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button variant="primary" size="sm">
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState<boolean | 'indeterminate'>(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (agree !== true) {
      setError('Please confirm you agree to receive updates.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setEmail('');
      setAgree(false);
    }, 900);
  };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-b from-accent-subtle/60 via-canvas/60 to-canvas"
      />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface px-3 py-1 text-xs text-text-muted shadow-foundation-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span>New — Design tokens v1.1 released</span>
            <span className="text-text-disabled">·</span>
            <a href="#changelog" className="text-accent hover:underline">
              See what's new
            </a>
          </div>

          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary md:text-6xl">
            Build interfaces with{' '}
            <span className="text-accent">tokens that match Figma</span>.
          </h1>

          <p className="max-w-xl text-base text-text-muted md:text-lg">
            POD ships React components, design tokens, and a docs site — all
            token-driven, dark-mode-ready, and synced from Figma. No handoffs.
            No drift.
          </p>

          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
            >
              Get started for free
            </Button>
            <Button variant="outline" size="lg" leftIcon={<Zap size={18} />}>
              View documentation
            </Button>
          </div>

          <p className="mt-2 text-xs text-text-disabled">
            No credit card required · Open source · MIT licensed
          </p>

          <form
            onSubmit={subscribe}
            className="mt-12 flex w-full max-w-md flex-col gap-3 rounded-xl border border-border-default bg-surface/60 p-5 text-left shadow-foundation-xs backdrop-blur"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold text-text-primary">
                Get release notes in your inbox
              </h2>
              <p className="text-xs text-text-muted">
                One email when we ship something significant — that's it.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <SearchInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  leftIcon={<Bell size={16} />}
                  shortcutKeys={null}
                  error={error && !email.includes('@') ? error : undefined}
                  aria-label="Email address"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                Subscribe
              </Button>
            </div>

            <Checkbox
              checked={agree}
              onCheckedChange={setAgree}
              label="I'd like product updates"
              description="Unsubscribe anytime. We won't share your email."
              error={
                error && email.includes('@') && agree !== true
                  ? error
                  : undefined
              }
            />
          </form>
        </div>
      </div>
    </section>
  );
}

function ClaimPayoutCard() {
  const SHARES = 247.5;
  const PRICE_PER_SHARE = 1.0;
  const PAYOUT = SHARES * PRICE_PER_SHARE;

  const [autoClaim, setAutoClaim] = useState<boolean | 'indeterminate'>(false);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const onClaim = async () => {
    setClaiming(true);
    await new Promise((r) => setTimeout(r, 900));
    setClaiming(false);
    setClaimed(true);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

  return (
    <section className="mx-auto w-full max-w-md px-6 py-12">
      <article className="flex flex-col gap-5 rounded-xl border border-border-default bg-surface p-6 shadow-foundation-sm">
        <header className="flex items-center justify-between gap-3">
          <Badge color="green" closable={false}>RESOLVED YES</Badge>
          <span className="text-xs text-text-muted">Resolved Nov 6, 2024</span>
        </header>

        <div className="flex items-start gap-3 rounded-lg border border-success/40 bg-success-subtle p-4">
          <div className="mt-0.5 shrink-0">
            <Check size={16} className="text-success" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-text-primary">Final outcome: Yes</p>
            <p className="text-text-muted">Donald Trump won the 2024 election.</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg bg-canvas/40 p-4">
          <PayoutRow label="Shares"            value={SHARES.toLocaleString()} />
          <PayoutRow label="× Price per share" value={fmt(PRICE_PER_SHARE)} />
          <div className="mt-1 flex items-center justify-between border-t border-border-subtle pt-3">
            <span className="text-sm font-medium text-text-primary">= Total payout</span>
            <span className="text-lg font-semibold tabular-nums text-text-primary">{fmt(PAYOUT)}</span>
          </div>
        </div>

        <Checkbox
          checked={autoClaim}
          onCheckedChange={setAutoClaim}
          label="Auto-claim future resolutions in this category"
          description="Saving akan otomatis cair tanpa konfirmasi manual."
        />

        <footer className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-4">
          <Button
            variant="primary"
            size="md"
            loading={claiming}
            disabled={claimed}
            className="flex-1"
            onClick={onClaim}
          >
            {claimed ? 'Claimed' : `Claim ${fmt(PAYOUT)}`}
          </Button>
          <Button variant="outline" size="md" rightIcon={<ExternalLink size={14} />}>
            View market
          </Button>
        </footer>

        {claimed && (
          <p role="status" className="text-xs text-success">
            Payout sent to your wallet — tx confirmed.
          </p>
        )}
      </article>
    </section>
  );
}

function PayoutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium tabular-nums text-text-secondary">{value}</span>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <Header />
      <Hero />
      <IssueCard />
      <ClaimPayoutCard />
      {import.meta.env.DEV && (
        <Agentation
          onCopy={(_markdown) => {
            // No-op — copyToClipboard handles the default. We override below.
          }}
          copyToClipboard={false}
          onSubmit={(_output, annotations) => {
            const enriched = enrichAgentationOutput(annotations);
            navigator.clipboard.writeText(enriched);
            console.info('[POD-Agentation] Enriched output copied:', enriched);
          }}
          onAnnotationAdd={(annotation) => {
            // Also copy single annotation enriched on add — convenience for owner workflow.
            const enriched = enrichAgentationOutput([annotation]);
            navigator.clipboard.writeText(enriched);
          }}
        />
      )}
    </div>
  );
}
