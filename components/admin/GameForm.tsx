"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { createClient } from "@/lib/supabase/client";
import { guessMimeType } from "@/lib/mime";
import type { Game } from "@/types/database";

export function GameForm({ initialData }: { initialData?: Game }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [theme, setTheme] = useState(initialData?.theme ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialData);

  async function uploadBuild(storagePrefix: string, file: File) {
    const supabase = createClient();
    const zip = await JSZip.loadAsync(file);

    const entries = Object.values(zip.files).filter((entry) => !entry.dir);

    if (!entries.some((entry) => entry.name.toLowerCase() === "index.html")) {
      throw new Error(
        "O .zip precisa conter um arquivo index.html na raiz (zip o conteúdo da pasta build/web, não a pasta em si)."
      );
    }

    let done = 0;
    for (const entry of entries) {
      const blob = await entry.async("blob");
      const path = `${storagePrefix}/${entry.name}`;
      const { error: uploadError } = await supabase.storage
        .from("games")
        .upload(path, blob, {
          contentType: guessMimeType(entry.name),
          upsert: true,
        });
      if (uploadError) throw uploadError;
      done += 1;
      setProgress(`Enviando arquivos... (${done}/${entries.length})`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isEditing && !zipFile) {
      setError("Selecione o .zip com o build do jogo (gerado pelo pygbag).");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      let storage_prefix = initialData?.storage_prefix;

      if (zipFile) {
        storage_prefix = crypto.randomUUID();
        setProgress("Lendo o .zip...");
        await uploadBuild(storage_prefix, zipFile);
      }

      if (isEditing && initialData) {
        const { error: updateError } = await supabase
          .from("games")
          .update({ title, theme, description, published, storage_prefix })
          .eq("id", initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("games")
          .insert({ title, theme, description, published, storage_prefix });
        if (insertError) throw insertError;
      }

      router.push("/admin/jogos");
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
          placeholder="Ex: Tabuada, Frações..."
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
          Build do jogo (.zip){" "}
          {isEditing && "(deixe em branco para manter o build atual)"}
        </label>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setZipFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-md border px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-400">
          Gere o build com <code>pygbag</code> e compacte o conteúdo da pasta{" "}
          <code>build/web</code> (o index.html precisa ficar na raiz do zip).
          Veja o guia em <code>docs/JOGOS.md</code>.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm">
          Publicado (visível para todos)
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? progress || "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
