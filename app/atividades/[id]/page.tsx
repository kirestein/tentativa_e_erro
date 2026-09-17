import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { pdfPublicUrl } from "@/lib/storage";
import { CommentSection } from "@/components/CommentSection";
import type { Activity, ActivityComment } from "@/types/database";

export default async function AtividadeDetailPage({
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

  const { data: comments } = await supabase
    .from("activity_comments")
    .select("*")
    .eq("activity_id", id)
    .order("created_at", { ascending: false })
    .returns<ActivityComment[]>();

  const fileUrl = pdfPublicUrl(activity.pdf_path);
  const lessonPlanUrl = activity.lesson_plan_path
    ? pdfPublicUrl(activity.lesson_plan_path)
    : null;
  const coverUrl = activity.cover_path ? pdfPublicUrl(activity.cover_path) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <span className="mb-2 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
        {activity.theme}
      </span>
      <h1 className="mb-2 text-3xl font-bold">{activity.title}</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={`Capa da atividade ${activity.title}`}
            className="w-full max-w-[220px] self-start rounded-lg border object-cover shadow-sm"
          />
        )}
        {activity.description && (
          <p className="text-gray-600">{activity.description}</p>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Baixar PDF
        </a>
        {lessonPlanUrl && (
          <a
            href={lessonPlanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            Baixar plano de aula
          </a>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <iframe src={fileUrl} className="h-[80vh] w-full" title={activity.title} />
      </div>

      <CommentSection activityId={activity.id} initialComments={comments ?? []} />
    </div>
  );
}
