import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { Activity } from "@/types/database";

export default async function AdminAtividadesPage() {
  const supabase = await createClient();

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Activity[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Atividades</h1>
        <Link
          href="/admin/atividades/nova"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nova atividade
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
            {(activities ?? []).map((activity) => (
              <tr key={activity.id}>
                <td className="px-4 py-2 font-medium">{activity.title}</td>
                <td className="px-4 py-2 text-gray-500">{activity.theme}</td>
                <td className="px-4 py-2">
                  {activity.published ? (
                    <span className="text-green-600">Publicada</span>
                  ) : (
                    <span className="text-gray-400">Rascunho</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/admin/atividades/${activity.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteButton
                      table="activities"
                      id={activity.id}
                      confirmMessage={`Excluir a atividade "${activity.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {(!activities || activities.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  Nenhuma atividade cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
