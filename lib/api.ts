export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export async function fetchAllCharacters(): Promise<Character[]> {
  const all: Character[] = [];
  let nextUrl: string | null = "https://rickandmortyapi.com/api/character";

  while (nextUrl) {
    const res = await fetch(nextUrl, { next: { revalidate: 864000 } });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error(`Expected JSON but got: ${contentType}`);
    }

    const data = await res.json();
    all.push(...data.results);
    nextUrl = data.info.next;
  }

  return all;
}

export async function fetchCharacterById(id: string | number): Promise<Character> {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character/${id}`,
    { next: { revalidate: 864000 } }
  );
  if (!res.ok) throw new Error("Character not found");
  return res.json();
}

export async function searchCharacters(params: Record<string, string>): Promise<Character[]> {
  const query = new URLSearchParams(params).toString();
  const url = `https://rickandmortyapi.com/api/character?${query}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return [];

  const data = await res.json();
  return data.results ?? [];
}