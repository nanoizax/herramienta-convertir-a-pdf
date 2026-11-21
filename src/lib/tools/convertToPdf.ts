import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { convertImage } from "./convertImage";

const PAGE_WIDTH = 595.28; // A4 en puntos
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const FONT_SIZE = 11;
const LINE_HEIGHT = 16;

/** Texto plano -> PDF paginado, con salto de linea por ancho (sin formato rico). */
async function textToPdfBytes(text: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const maxWidth = PAGE_WIDTH - MARGIN * 2;

  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && font.widthOfTextAtSize(candidate, FONT_SIZE) > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  for (const line of lines) {
    if (y < MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
    page.drawText(line, { x: MARGIN, y, size: FONT_SIZE, font, color: rgb(0, 0, 0) });
    y -= LINE_HEIGHT;
  }

  return pdfDoc.save();
}

async function imageToPdfBytes(file: File): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  let bytes: Uint8Array;
  let isJpeg: boolean;
  if (file.type === "image/jpeg" || file.type === "image/png") {
    bytes = new Uint8Array(await file.arrayBuffer());
    isJpeg = file.type === "image/jpeg";
  } else {
    // Otros formatos (ej. webp): normalizar a PNG en canvas antes de embeber,
    // pdf-lib solo sabe leer JPEG y PNG.
    const blob = await convertImage(file, { format: "image/png" });
    bytes = new Uint8Array(await blob.arrayBuffer());
    isJpeg = false;
  }

  const image = isJpeg ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);
  const maxW = PAGE_WIDTH - MARGIN * 2;
  const maxH = PAGE_HEIGHT - MARGIN * 2;
  const scale = Math.min(maxW / image.width, maxH / image.height, 1);
  const width = image.width * scale;
  const height = image.height * scale;

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  page.drawImage(image, {
    x: (PAGE_WIDTH - width) / 2,
    y: (PAGE_HEIGHT - height) / 2,
    width,
    height,
  });

  return pdfDoc.save();
}

export type ConvertToPdfSource = "docx" | "image" | "text";

export function detectSource(file: File): ConvertToPdfSource | "unsupported" {
  if (file.name.toLowerCase().endsWith(".docx")) return "docx";
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) return "text";
  return "unsupported";
}

export async function convertToPdf(file: File): Promise<Blob> {
  const source = detectSource(file);

  let bytes: Uint8Array;
  if (source === "docx") {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    bytes = await textToPdfBytes(text);
  } else if (source === "image") {
    bytes = await imageToPdfBytes(file);
  } else if (source === "text") {
    bytes = await textToPdfBytes(await file.text());
  } else {
    throw new Error("unsupported-format");
  }

  return new Blob([bytes], { type: "application/pdf" });
}
