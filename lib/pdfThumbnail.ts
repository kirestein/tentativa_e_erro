"use client";

// Gera uma imagem de capa a partir da primeira página de um PDF, inteiramente
// no navegador (sem precisar de um servidor com bibliotecas de PDF).
export async function generatePdfCoverBlob(file: File): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const targetWidth = 480;
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível criar o contexto do canvas.");

  await page.render({ canvas, canvasContext: context, viewport }).promise;

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85)
  );
  if (!blob) throw new Error("Não foi possível gerar a imagem de capa.");

  return blob;
}
