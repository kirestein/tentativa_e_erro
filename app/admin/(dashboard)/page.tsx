import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: activitiesCount }, { count: gamesCount }] =
    await Promise.all([
      supabase.from("activities").select("*", { count: "exact", head: true }),
      supabase.from("games").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Painel</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/atividades"
          className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md"
        >
          <p className="text-3xl font-bold">{activitiesCount ?? 0}</p>
          <p className="text-gray-500">Atividades cadastradas</p>
        </Link>
        <Link
          href="/admin/jogos"
          className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md"
        >
          <p className="text-3xl font-bold">{gamesCount ?? 0}</p>
          <p className="text-gray-500">Jogos cadastrados</p>
        </Link>
      </div>
    </div>
  );
}
