import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/types/database";

export default async function AtividadesPage({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string }>;
}) {
  const { tema } = await searchParams;
  const supabase = await createClient();

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .returns<Activity[]>();

  const themes = Array.from(
    new Set((activities ?? []).map((a) => a.theme))
  ).sort();

  const filtered = tema
    ? (activities ?? []).filter((a) => a.theme === tema)
    : activities ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Atividades</h1>

      {themes.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/atividades"
            className={`rounded-full px-3 py-1 text-sm ${
              !tema ? "bg-blue-600 text-white" : "bg-white border text-gray-700"
            }`}
          >
            Todos
          </Link>
          {themes.map((theme) => (
            <Link
              key={theme}
              href={`/atividades?tema=${encodeURIComponent(theme)}`}
              className={`rounded-full px-3 py-1 text-sm ${
                tema === theme
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-700"
              }`}
            >
              {theme}
            </Link>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((activity) => (
            <Link
              key={activity.id}
              href={`/atividades/${activity.id}`}
              className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <span className="mb-2 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                {activity.theme}
              </span>
              <h3 className="font-semibold">{activity.title}</h3>
              {activity.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {activity.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nenhuma atividade encontrada.</p>
      )}
    </div>
  );
}
