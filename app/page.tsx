import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Activity, Game } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: activities }, { data: games }] = await Promise.all([
    supabase
      .from("activities")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .returns<Activity[]>(),
    supabase
      .from("games")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .returns<Game[]>(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Fazendo Matemática</h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          Atividades em PDF por tema e jogos educativos para praticar
          matemática de um jeito divertido.
        </p>
      </section>

      <section className="mb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Últimas atividades</h2>
          <Link href="/atividades" className="text-sm text-blue-600 hover:underline">
            Ver todas
          </Link>
        </div>
        {activities && activities.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={`/atividades/${activity.id}`}
                className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <span className="mb-2 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {activity.theme}
                </span>
                <h3 className="font-semibold">{activity.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma atividade publicada ainda.</p>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Jogos</h2>
          <Link href="/jogos" className="text-sm text-blue-600 hover:underline">
            Ver todos
          </Link>
        </div>
        {games && games.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
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
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum jogo publicado ainda.</p>
        )}
      </section>
    </div>
  );
}
