const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function pdfPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/pdfs/${path}`;
}

export function gameIndexUrl(storagePrefix: string) {
  // Served through our own proxy (see app/api/games) instead of the direct
  // Supabase Storage URL, because Storage forces text/plain + a locked-down
  // CSP on .html objects, which stops the game from actually running.
  return `/api/games/${storagePrefix}/index.html`;
}
