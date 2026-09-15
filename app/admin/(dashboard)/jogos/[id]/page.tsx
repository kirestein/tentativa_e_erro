import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GameForm } from "@/components/admin/GameForm";
import type { Game } from "@/types/database";

export default async function EditarJogoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .maybeSingle<Game>();

  if (!game) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Editar jogo</h1>
      <GameForm initialData={game} />
    </div>
  );
}
