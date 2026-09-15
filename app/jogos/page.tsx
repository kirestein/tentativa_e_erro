import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Game } from "@/types/database";

export default async function JogosPage() {
  const supabase = await createClient();

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .returns<Game[]>();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Jogos</h1>

      {games && games.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/jogos/${game.id}`}
              className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {game.theme && (
                <span className="mb-2 inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  {game.theme}
                </span>
              )}
              <h3 className="font-semibold">{game.title}</h3>
              {game.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {game.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nenhum jogo publicado ainda.</p>
      )}
    </div>
  );
}
