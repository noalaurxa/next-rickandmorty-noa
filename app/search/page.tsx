"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Character, searchCharacters } from "@/lib/api";

export default function SearchPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const hasFilters = name || status || gender || type;

    if (!hasFilters) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(async () => {
      const params: Record<string, string> = {};
      if (name) params.name = name;
      if (status) params.status = status;
      if (gender) params.gender = gender;
      if (type) params.type = type;

      try {
        const data = await searchCharacters(params);
        setResults(data);
      } catch {
        setResults([]);
      }
      setSearched(true);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [name, status, gender, type]);

  return (
    <div className="min-h-screen px-4 py-16 sm:px-8">
      {/* ── Hero ── */}
      <section className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="mb-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent2)] to-[var(--accent)] bg-clip-text text-transparent">
            Search Characters
          </span>
        </h1>
        <p className="text-lg text-slate-400">
          Filter the multiverse by name, status, gender, or type.
        </p>
      </section>

      {/* ── Filter Panel ── */}
      <section className="glass mx-auto mb-14 max-w-4xl p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/40 focus:shadow-[0_0_20px_rgba(0,188,212,0.25)]"
          />
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Filter by type..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/40 focus:shadow-[0_0_20px_rgba(0,188,212,0.25)]"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/40"
          >
            <option value="" className="bg-[#0d1117]">All Statuses</option>
            <option value="alive" className="bg-[#0d1117]">Alive</option>
            <option value="dead" className="bg-[#0d1117]">Dead</option>
            <option value="unknown" className="bg-[#0d1117]">Unknown</option>
          </select>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/40"
          >
            <option value="" className="bg-[#0d1117]">All Genders</option>
            <option value="female" className="bg-[#0d1117]">Female</option>
            <option value="male" className="bg-[#0d1117]">Male</option>
            <option value="genderless" className="bg-[#0d1117]">Genderless</option>
            <option value="unknown" className="bg-[#0d1117]">Unknown</option>
          </select>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="mx-auto max-w-7xl">
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Results grid */}
        {!loading && searched && results.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((char, i) => (
              <Link
                key={char.id}
                href={`/character/${char.id}`}
                className="glass card-hover group flex flex-col overflow-hidden transition-all duration-300"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h2 className="truncate text-lg font-semibold text-white">
                    {char.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`pulse-dot ${
                        char.status === "Alive"
                          ? "bg-[var(--glow-green)]"
                          : char.status === "Dead"
                          ? "bg-[var(--glow-red)]"
                          : "bg-[var(--glow-gray)]"
                      }`}
                    />
                    <span
                      className={
                        char.status === "Alive"
                          ? "status-alive"
                          : char.status === "Dead"
                          ? "status-dead"
                          : "status-unknown"
                      }
                    >
                      {char.status}
                    </span>
                  </div>
                  <span className="mt-auto inline-block self-start rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-slate-400">
                    {char.species}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="mb-4 text-6xl">🌀</span>
            <h3 className="mb-2 text-2xl font-semibold text-white">
              No characters found
            </h3>
            <p className="text-slate-400">
              Try adjusting your filters to explore other dimensions.
            </p>
          </div>
        )}

        {/* Initial state */}
        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="mb-4 text-6xl">🔍</span>
            <h3 className="mb-2 text-2xl font-semibold text-white">
              Start searching to explore the multiverse!
            </h3>
            <p className="text-slate-400">
              Use the filters above to find your favourite characters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}