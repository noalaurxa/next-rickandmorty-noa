import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { type Character, fetchAllCharacters } from "@/lib/api";

export const metadata: Metadata = {
  title: "Rick & Morty Explorer | Home",
  description:
    "Browse every character across infinite dimensions. Explore the complete Rick and Morty multiverse with detailed profiles, stats, and more.",
};

export const revalidate = 864000;

export default async function Home() {
  let characters: Character[] = [];

  try {
    characters = await fetchAllCharacters();
  } catch (error) {
    console.error("Failed to fetch characters:", error);
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      {/* ── Hero Section ── */}
      <section className="mx-auto max-w-4xl text-center mb-16">
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Explore the Multiverse
        </h1>

        <p className="text-xl sm:text-2xl text-white/60 font-medium mb-3">
          {characters.length} characters across infinite dimensions
        </p>

        <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
          Dive into the complete Rick&nbsp;&amp;&nbsp;Morty character database.
          Every species, every status, every dimension — all in one place.
        </p>
      </section>

      {/* ── Error State ── */}
      {characters.length === 0 && (
        <section className="flex flex-col items-center justify-center py-24 text-center">
          <span className="mb-4 text-6xl">🌀</span>
          <h3 className="mb-2 text-2xl font-semibold text-white">
            Could not reach the multiverse
          </h3>
          <p className="text-slate-400">
            The Rick &amp; Morty API is unreachable. Check your connection and try again.
          </p>
        </section>
      )}

      {/* ── Character Grid ── */}
      {characters.length > 0 && (
        <section className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {characters.map((char, index) => (
              <Link
                key={char.id}
                href={`/character/${char.id}`}
                className="glass card-hover fade-in-up flex flex-col items-center p-4 transition-all duration-300"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="w-full overflow-hidden rounded-xl mb-4">
                  <Image
                    src={char.image}
                    alt={char.name}
                    width={300}
                    height={300}
                    loading="lazy"
                    unoptimized
                    className="w-full h-auto object-cover"
                  />
                </div>

                <h2 className="text-lg font-semibold text-center mb-2 truncate w-full">
                  {char.name}
                </h2>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="pulse-dot"
                    style={{
                      backgroundColor:
                        char.status === "Alive"
                          ? "var(--glow-green)"
                          : char.status === "Dead"
                          ? "var(--glow-red)"
                          : "var(--glow-gray)",
                    }}
                  />
                  <span
                    className={
                      char.status === "Alive"
                        ? "status-alive text-sm"
                        : char.status === "Dead"
                        ? "status-dead text-sm"
                        : "status-unknown text-sm"
                    }
                  >
                    {char.status}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-0.5 text-xs text-white/70">
                    {char.species}
                  </span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-0.5 text-xs text-white/70">
                    {char.gender}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}