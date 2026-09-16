import { NextResponse } from "next/server";
import { guessMimeType } from "@/lib/mime";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Supabase Storage forces `Content-Type: text/plain` and a locked-down
// Content-Security-Policy on public objects that look executable (like
// index.html) to stop public buckets from being used to host XSS payloads.
// That also blocks legitimate game builds (pygbag/WebAssembly) from running.
// This route re-serves those files from our own origin with the correct
// content type and no restrictive CSP, so the game can actually execute.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ prefix: string; path: string[] }> }
) {
  const { prefix, path } = await params;
  const filePath = path.join("/");

  const upstream = await fetch(
    `${SUPABASE_URL}/storage/v1/object/public/games/${prefix}/${filePath}`
  );

  if (!upstream.ok) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": guessMimeType(filePath),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
