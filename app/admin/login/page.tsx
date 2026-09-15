"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginContent() {
  const params = useSearchParams();
  const error = params.get("error");

  async function handleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Área do professor</h1>
      <p className="text-sm text-gray-500">
        Entre com sua conta Google para gerenciar atividades e jogos.
      </p>
      {error === "unauthorized" && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          Essa conta Google não tem permissão de administrador.
        </p>
      )}
      {error === "auth" && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          Não foi possível concluir o login. Tente novamente.
        </p>
      )}
      <button
        onClick={handleLogin}
        className="rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800"
      >
        Entrar com Google
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
