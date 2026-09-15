import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ActivityForm } from "@/components/admin/ActivityForm";
import type { Activity } from "@/types/database";

export default async function EditarAtividadePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: activity } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .maybeSingle<Activity>();

  if (!activity) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Editar atividade</h1>
      <ActivityForm initialData={activity} />
    </div>
  );
}
