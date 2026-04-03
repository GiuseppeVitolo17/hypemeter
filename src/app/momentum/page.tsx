import Link from "next/link";

export default function MomentumPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-cyan-200 transition-colors hover:bg-cyan-400/20"
          >
            Back to Monmeter
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-900/90 p-5 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-300">Market Term</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Momentum</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
            In finance, momentum means prices often continue moving in their recent direction for some time. Assets
            with strong recent performance can keep outperforming, while weaker assets may keep lagging.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            On Monmeter, this card summarizes directional strength across market-linked inputs. It does not predict
            certainty, but it helps describe whether trend persistence is currently supportive or fading.
          </p>
        </section>

        <footer className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Source</p>
          <a
            href="https://en.wikipedia.org/wiki/Momentum_(finance)"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-sm text-cyan-300 underline decoration-cyan-400/60 underline-offset-2"
          >
            Wikipedia - Momentum (finance)
          </a>
        </footer>
      </div>
    </main>
  );
}
