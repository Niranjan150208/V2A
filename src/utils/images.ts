export async function compressImageToDataUrl(
  file: File,
  maxDimension = 720,
  quality = 0.68,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file such as JPG, PNG, or WebP.");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("Image must be smaller than 12 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("This browser could not prepare the image.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("Could not compress the image.")),
      "image/jpeg",
      quality,
    );
  });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Could not read the image."));
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(blob);
  });
}
