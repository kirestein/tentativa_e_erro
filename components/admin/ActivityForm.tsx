"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generatePdfCoverBlob } from "@/lib/pdfThumbnail";
import type { Activity } from "@/types/database";

export function ActivityForm({ initialData }: { initialData?: Activity }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [theme, setTheme] = useState(initialData?.theme ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [lessonPlanFile, setLessonPlanFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialData);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isEditing && !file) {
      setError("Selecione um arquivo PDF.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      let pdf_path = initialData?.pdf_path;
      let lesson_plan_path = initialData?.lesson_plan_path;
      let cover_path = initialData?.cover_path;

      if (file) {
        setProgress("Enviando PDF...");
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("pdfs")
          .upload(path, file, { contentType: "application/pdf" });
        if (uploadError) throw uploadError;
        pdf_path = path;

        try {
          setProgress("Gerando capa a partir do PDF...");
          const coverBlob = await generatePdfCoverBlob(file);
          const coverPath = `${crypto.randomUUID()}-capa.jpg`;
          const { error: coverUploadError } = await supabase.storage
            .from("pdfs")
            .upload(coverPath, coverBlob, { contentType: "image/jpeg" });
          if (coverUploadError) throw coverUploadError;
          cover_path = coverPath;
        } catch (coverErr) {
          // Não é crítico: a atividade continua funcionando sem capa.
          console.error("Falha ao gerar capa do PDF:", coverErr);
        }
      }

      if (lessonPlanFile) {
        setProgress("Enviando plano de aula...");
        const path = `${crypto.randomUUID()}-${lessonPlanFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("pdfs")
          .upload(path, lessonPlanFile, { contentType: "application/pdf" });
        if (uploadError) throw uploadError;
        lesson_plan_path = path;
      }

      setProgress("Salvando...");

      if (isEditing && initialData) {
        const { error: updateError } = await supabase
          .from("activities")
          .update({
            title,
            theme,
            description,
            published,
            pdf_path,
            lesson_plan_path,
            cover_path,
          })
          .eq("id", initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("activities").insert({
          title,
          theme,
          description,
          published,
          pdf_path,
          lesson_plan_path,
          cover_path,
        });
        if (insertError) throw insertError;
      }

      router.push("/admin/atividades");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
      setProgress("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Tema</label>
        <input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          required
          placeholder="Ex: Frações, Geometria, Álgebra..."
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Arquivo da atividade (PDF){" "}
          {isEditing && "(deixe em branco para manter o atual)"}
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Plano de aula (PDF, opcional){" "}
          {isEditing && "(deixe em branco para manter o atual)"}
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setLessonPlanFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm">
          Publicada (visível para todos)
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? progress || "Salvando..." : "Salvar"}
        </button>
        {isEditing && initialData && (
          <Link
            href={`/atividades/${initialData.id}`}
            target="_blank"
            className="text-sm text-blue-600 hover:underline"
          >
            Ver página pública ↗
          </Link>
        )}
      </div>
    </form>
  );
}
