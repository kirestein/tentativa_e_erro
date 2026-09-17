import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fazendo Matemática",
  description: "Atividades de matemática e jogos educativos",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold">
              Fazendo Matemática
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/atividades" className="hover:text-blue-600">
                Atividades
              </Link>
              <Link href="/jogos" className="hover:text-blue-600">
                Jogos
              </Link>
              <Link href="/sobre" className="hover:text-blue-600">
                Sobre
              </Link>
              <Link
                href="/admin"
                className="rounded-md border px-3 py-1.5 hover:bg-gray-100"
              >
                Área do professor
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
          Fazendo Matemática
        </footer>
      </body>
    </html>
  );
}
