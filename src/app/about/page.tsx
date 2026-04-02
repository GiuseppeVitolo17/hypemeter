import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About page for the Pokemon Awesome-style information, sources, copyright notice, and privacy policy.",
  alternates: {
    canonical: "/about",
  },
};

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">{title}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item}>* {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30">
          <p className="text-sm font-semibold tracking-[0.08em] text-fuchsia-300">POKEMONAWESOME!</p>
          <p className="mt-2 text-xs text-slate-400">PokemonsCompareStatisticsBookmarks</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Main Menu</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {["Pokemons", "Compare", "Statistics", "Bookmarks"].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-slate-800 px-2.5 py-1 text-slate-200">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SectionList title="Pokemon Data" items={["Evolutions", "Types", "Egg Groups"]} />
          <SectionList title="Forms / Variations" items={["Gigantamax Forms", "Mega Evolutions"]} />
          <SectionList title="Fun & Games" items={["Guess the Pokemon", "Trading Card Game"]} />
          <SectionList title="Misc." items={["About"]} />
        </div>

        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">About Pokemon Awesome</h1>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            Pokemon Awesome is basically just another random Pokemon-related web-application that appeared in the
            wild.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            The creator of this web application developed it simply for the sake of having fun, while also learning
            various aspects of software engineering and UI/UX design.
          </p>

          <h2 className="mt-7 text-lg font-bold">Contact:</h2>
          <p className="mt-2 text-sm text-slate-200">Afifudin/digimushrm</p>
          <p className="mt-2 text-sm text-slate-200">
            LinkedIn:{" "}
            <a className="text-cyan-300 hover:underline" href="https://www.linkedin.com/in/gvitolocs/">
              https://www.linkedin.com/in/gvitolocs/
            </a>
          </p>
          <p className="mt-1 text-sm text-slate-200">
            X:{" "}
            <a className="text-cyan-300 hover:underline" href="https://x.com/gvitolocs">
              https://x.com/gvitolocs
            </a>
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-lg font-bold">Content & Copyright</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            This unofficial web application offers certain information about Pokemon series or games. However, arts,
            visuals, and names featured herein are the properties of Nitendo, Game Freak, &amp; The Pokemon Company.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Please note that this web application is not official and is not linked to the company mentioned above.
            Some images used in this web application are copyrighted and belong to Nintendo, Game Freak, or The
            Pokemon Company. They are used in accordance with the laws of Fair Use. No copyright infringement
            intended.
          </p>
          <p className="mt-4 text-sm text-slate-200">
            The main data sources for the content of this web application are:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
            <li>
              * PokeAPI (<a className="text-cyan-300 hover:underline" href="https://pokeapi.co/">https://pokeapi.co/</a>)
            </li>
            <li>
              * Pokemon TCG API (
              <a className="text-cyan-300 hover:underline" href="https://pokemontcg.io/">
                https://pokemontcg.io/
              </a>
              )
            </li>
          </ul>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Special thanks to Simon Goellner for his awesome open-source Pokemon cards animation on{" "}
            <a className="text-cyan-300 hover:underline" href="https://poke-holo.simey.me/">
              https://poke-holo.simey.me/
            </a>
            .
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-lg font-bold">Privacy Policy</h2>
          <p className="mt-3 text-sm text-slate-200">
            Here&apos;s a straightforward summary of how we handle your information:
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200">
            <li>
              * Information Collection: No personal information is required to access this website or view any regular
              pages.
            </li>
            <li>
              * Third-Party Links: Our website may contain links to third-party websites. Please note that we are not
              responsible for their privacy practices. We encourage you to review their privacy policies.
            </li>
            <li>
              * Limitation of Liability: We do not guarantee uninterrupted, secure, or error-free access to the
              website, and we make no warranties regarding the accuracy of our content. We shall not be liable for any
              interruptions, delays, errors in the operation of the website, or any damages arising from its use.
            </li>
            <li>* Consent: By using our website, you consent to our Privacy Policy and agree to its terms.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-400">- Last updated at 14 April 2024.</p>
          <p className="mt-2 text-sm text-slate-300">We may update our Privacy Policy from time to time.</p>
        </section>

        <div className="mt-6">
          <Link href="/" className="text-sm text-cyan-300 hover:underline">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
