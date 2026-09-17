"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ActivityComment } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentSection({
  activityId,
  initialComments,
}: {
  activityId: string;
  initialComments: ActivityComment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!authorName.trim() || !body.trim()) {
      setError("Preencha seu nome e o comentário.");
      return;
    }

    setSending(true);
    const supabase = createClient();

    const { data, error: insertError } = await supabase
      .from("activity_comments")
      .insert({
        activity_id: activityId,
        author_name: authorName.trim(),
        body: body.trim(),
      })
      .select()
      .single();

    setSending(false);

    if (insertError || !data) {
      setError("Não foi possível enviar o comentário. Tente novamente.");
      return;
    }

    setComments((prev) => [data as ActivityComment, ...prev]);
    setBody("");
  }

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-xl font-semibold">
        Comentários {comments.length > 0 && `(${comments.length})`}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        {error && (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Seu nome"
          maxLength={80}
          className="w-full max-w-xs rounded-md border px-3 py-2 text-sm"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Deixe seu comentário sobre esta atividade..."
          rows={3}
          maxLength={2000}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {sending ? "Enviando..." : "Comentar"}
        </button>
      </form>

      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg border bg-white p-4">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="font-medium">{comment.author_name}</span>
                <span className="text-xs text-gray-400">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">
          Nenhum comentário ainda. Seja o primeiro a comentar!
        </p>
      )}
    </div>
  );
}
