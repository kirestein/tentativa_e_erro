import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { gameIndexUrl } from "@/lib/storage";
import type { Game } from "@/types/database";

export default async function JogoDetailPage({
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

  const iframeUrl = gameIndexUrl(game.storage_prefix);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {game.theme && (
        <span className="mb-2 inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
          {game.theme}
        </span>
      )}
      <h1 className="mb-2 text-3xl font-bold">{game.title}</h1>
      {game.description && (
        <p className="mb-6 text-gray-600">{game.description}</p>
      )}

      <div className="overflow-hidden rounded-lg border bg-black">
        <iframe
          src={iframeUrl}
          className="aspect-video w-full"
          title={game.title}
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
        />
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Se o jogo demorar para carregar, aguarde alguns segundos — ele está
        sendo carregado direto no navegador.
      </p>
    </div>
  );
}
