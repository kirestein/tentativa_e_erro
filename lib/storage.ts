const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function pdfPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/pdfs/${path}`;
}

export function gameIndexUrl(storagePrefix: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/games/${storagePrefix}/index.html`;
}
