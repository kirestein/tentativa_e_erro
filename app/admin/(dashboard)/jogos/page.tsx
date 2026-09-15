import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Game } from "@/types/database";

export default async function AdminJogosPage() {
  const supabase = await createClient();

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Game[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jogos</h1>
        <Link
          href="/admin/jogos/nova"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Novo jogo
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Tema</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(games ?? []).map((game) => (
              <tr key={game.id}>
                <td className="px-4 py-2 font-medium">{game.title}</td>
                <td className="px-4 py-2 text-gray-500">{game.theme}</td>
                <td className="px-4 py-2">
                  {game.published ? (
                    <span className="text-green-600">Publicado</span>
                  ) : (
                    <span className="text-gray-400">Rascunho</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/admin/jogos/${game.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteButton
                      table="games"
                      id={game.id}
                      confirmMessage={`Excluir o jogo "${game.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {(!games || games.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  Nenhum jogo cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
