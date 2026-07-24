import { Button, Checkbox, SearchInput, Tooltip } from '@commonforge/ui';
import {
  ArrowRight,
  Bell,
  Moon,
  Sparkles,
  Star,
  Sun,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('pod-client-theme', dark ? 'dark' : 'light');
    } catch {
      /* ignore */
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

  const navItems = ['Components', 'Tokens', 'Patterns', 'Pricing'];

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
            value={query}
            onValueChange={setQuery}
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
  const [agree, setAgree] = useState<boolean | 'indeterminate'>(false);
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
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface px-3 py-1 text-xs text-text-muted shadow-sm">
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
            className="mt-12 flex w-full max-w-md flex-col gap-3 rounded-xl border border-border-default bg-surface/60 p-5 text-left shadow-sm backdrop-blur"
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
                  onValueChange={setEmail}
                  placeholder="you@company.com"
                  leftIcon={<Bell size={16} />}
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

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <Header />
      <Hero />
    </div>
  );
}
