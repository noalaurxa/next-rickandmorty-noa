import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Character, fetchCharacterById, fetchAllCharacters } from "@/lib/api";

export const revalidate = 864000;

export async function generateStaticParams() {
  try {
    const characters = await fetchAllCharacters();
    return characters.map((c) => ({ id: c.id.toString() }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const character = await fetchCharacterById(id);
    return {
      title: `${character.name} | Rick & Morty Explorer`,
      description: `Learn about ${character.name} — a ${character.species} (${character.status}) from ${character.origin.name}. Appeared in ${character.episode.length} episodes.`,
    };
  } catch {
    return { title: "Character | Rick & Morty Explorer" };
  }
}

function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "alive": return "bg-[var(--glow-green)]";
    case "dead": return "bg-[var(--glow-red)]";
    default: return "bg-[var(--glow-gray)]";
  }
}

function statusTextClass(status: string): string {
  switch (status.toLowerCase()) {
    case "alive": return "status-alive";
    case "dead": return "status-dead";
    default: return "status-unknown";
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function extractEpisodeNumber(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-4 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
        {label}
      </span>
      <span className="text-sm text-slate-200 font-medium">{value}</span>
    </div>
  );
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let character: Character | null = null;
  try {
    character = await fetchCharacterById(id);
  } catch {
    notFound();
  }

  if (!character) notFound();

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-12 lg:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[var(--accent)] transition-colors mb-8 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Explorer
      </Link>

      <div className="glass p-6 sm:p-8 lg:p-10 fade-in-up">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 0 30px rgba(0,188,212,0.25), 0 0 60px rgba(124,58,237,0.15)",
              }}
            >
              <Image
                src={character.image}
                alt={character.name}
                width={400}
                height={400}
                unoptimized
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-6">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {character.name}
            </h1>

            <div className="flex items-center gap-3">
              <span className={`pulse-dot ${statusColor(character.status)}`} />
              <span className={`text-sm font-semibold uppercase tracking-wider ${statusTextClass(character.status)}`}>
                {character.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InfoCard label="Species" value={character.species} />
              <InfoCard label="Type" value={character.type || "N/A"} />
              <InfoCard label="Gender" value={character.gender} />
              <InfoCard label="Origin" value={character.origin.name} />
              <InfoCard label="Location" value={character.location.name} />
              <InfoCard
                label="Episodes"
                value={`${character.episode.length} episode${character.episode.length !== 1 ? "s" : ""}`}
              />
            </div>

            <p className="text-xs text-slate-500">
              Created {formatDate(character.created)}
            </p>
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="mt-10 fade-in-up" style={{ animationDelay: "0.15s" }}>
        <h2 className="text-xl font-bold text-slate-300 mb-4">Episode Appearances</h2>
        <div className="flex flex-wrap gap-2">
          {character.episode.slice(0, 10).map((epUrl) => {
            const num = extractEpisodeNumber(epUrl);
            return (
              <span
                key={epUrl}
                className="glass px-3 py-1.5 text-xs font-mono font-semibold text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-default"
              >
                EP {num}
              </span>
            );
          })}
          {character.episode.length > 10 && (
            <span className="px-3 py-1.5 text-xs font-mono text-slate-500">
              +{character.episode.length - 10} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}