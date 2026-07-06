// Downscales/re-encodes a picked image client-side before sending it to the
// server — phone camera photos can be several MB, and the assistant only
// needs enough resolution to read a label.
export async function downscaleImageFile(
  file: File,
  maxDimension = 1280,
  quality = 0.85,
): Promise<{ mimeType: string; data: Uint8Array }> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas is not supported in this browser.");
    }
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) {
      throw new Error("Failed to encode image.");
    }

    const buffer = await blob.arrayBuffer();
    return { mimeType: "image/jpeg", data: new Uint8Array(buffer) };
  } finally {
    bitmap.close();
  }
}
