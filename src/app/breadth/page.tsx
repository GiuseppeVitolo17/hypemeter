import Link from "next/link";

export default function BreadthPage() {
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
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Breadth</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
            Market breadth measures participation: how many stocks are advancing versus declining. Broad participation
            usually confirms trend quality better than moves led by only a few names.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            On Monmeter, this card reflects whether the broader signal set is aligned or fragmented. Higher breadth
            generally indicates stronger market backing behind current direction.
          </p>
        </section>

        <footer className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Source</p>
          <a
            href="https://en.wikipedia.org/wiki/Breadth_of_market"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-sm text-cyan-300 underline decoration-cyan-400/60 underline-offset-2"
          >
            Wikipedia - Breadth of market
          </a>
        </footer>
      </div>
    </main>
  );
}
