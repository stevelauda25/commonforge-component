import { Badge } from 'pod-test-ui';

export function MarketDetailHeader() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="text-xs uppercase tracking-wide text-text-muted">
        Markets · Crypto
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Will BTC close above $80k by end of Q4?
        </h1>
        <Badge color="green" closable={false}>RESOLVED</Badge>
      </div>
      <p className="mt-3 text-sm text-text-muted">
        Market resolved on 2026-12-31 23:59 UTC. Final outcome: YES.
      </p>
    </section>
  );
}
