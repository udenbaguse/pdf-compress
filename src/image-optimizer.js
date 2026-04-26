import sharp from "sharp";

/**
 * Optimasi gambar PDF
 *
 * quality:
 * 100 = preserve quality (default)
 * 70 = medium
 * 40 = aggressive
 */
export async function optimizeImage(imageBuffer, options = {}) {
  const quality = options.quality ?? 100;
  const format = options.format ?? "jpeg";
  const maxWidth = options.maxWidth ?? null;

  let pipeline = sharp(imageBuffer, {
    failOnError: false,
  });

  if (maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      withoutEnlargement: true,
    });
  }

  switch (format) {
    case "png":
      return pipeline
        .png({
          compressionLevel: 9,
          quality,
        })
        .toBuffer();

    case "webp":
      return pipeline
        .webp({
          quality,
        })
        .toBuffer();

    case "jpeg":
    default:
      return pipeline
        .jpeg({
          quality,
          mozjpeg: true,
        })
        .toBuffer();
  }
}
