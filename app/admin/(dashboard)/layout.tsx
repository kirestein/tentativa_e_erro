import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-[70vh]">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/admin" className="hover:text-blue-600">
              Painel
            </Link>
            <Link href="/admin/atividades" className="hover:text-blue-600">
              Atividades
            </Link>
            <Link href="/admin/jogos" className="hover:text-blue-600">
              Jogos
            </Link>
          </nav>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {user?.email}
            <form action="/auth/signout" method="post">
              <button className="rounded-md border px-3 py-1.5 hover:bg-gray-100">
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
