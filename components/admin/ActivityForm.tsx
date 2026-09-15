"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  const [saving, setSaving] = useState(false);
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

      if (file) {
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("pdfs")
          .upload(path, file, { contentType: "application/pdf" });
        if (uploadError) throw uploadError;
        pdf_path = path;
      }

      if (isEditing && initialData) {
        const { error: updateError } = await supabase
          .from("activities")
          .update({ title, theme, description, published, pdf_path })
          .eq("id", initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("activities")
          .insert({ title, theme, description, published, pdf_path });
        if (insertError) throw insertError;
      }

      router.push("/admin/atividades");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
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
          Arquivo PDF {isEditing && "(deixe em branco para manter o atual)"}
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
