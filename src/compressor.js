import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { readFile, writeFile, stat, readdir } from "fs/promises";
import path from "path";
import { optimizeImage } from "./image-optimizer.js";

function getOutputPath(inputPath, customOutput) {
  if (customOutput) return customOutput;

  const parsed = path.parse(inputPath);

  return path.join(parsed.dir, `${parsed.name}-compressed${parsed.ext}`);
}

function getQualityFromLevel(level = "high") {
  const map = {
    low: 40,
    medium: 70,
    high: 100,
  };

  return map[level] ?? 100;
}

function getResizeWidth(quality) {
  if (quality <= 40) return 1200;
  if (quality <= 70) return 1800;

  return null;
}

async function collectPdfFiles(targetPath) {
  const fileStat = await stat(targetPath);
  const files = [];

  if (fileStat.isDirectory()) {
    const dirFiles = await readdir(targetPath);

    for (const file of dirFiles) {
      if (file.toLowerCase().endsWith(".pdf")) {
        files.push(path.join(targetPath, file));
      }
    }

    return files;
  }

  files.push(targetPath);

  return files;
}

/**
 * Kompres PDF
 */
export async function compressPdf(inputPath, outputPath = null, options = {}) {
  const quality = options.quality ?? getQualityFromLevel(options.level);

  const noImage = options.noImage ?? false;
  const imageOnly = options.imageOnly ?? false;

  const maxWidth = getResizeWidth(quality);

  /**
   * readFile() => Buffer
   * pdfjs-dist butuh Uint8Array
   */
  const pdfBuffer = await readFile(inputPath);
  const pdfBytes = new Uint8Array(pdfBuffer);

  /**
   * Parse source PDF
   */
  const loadingTask = pdfjsLib.getDocument({
    data: pdfBytes,
  });

  const sourcePdf = await loadingTask.promise;

  /**
   * Build new optimized PDF
   */
  const outputPdf = await PDFDocument.create();

  /**
   * Load original PDF sekali saja
   * (lebih efisien daripada load tiap page)
   */
  const originalPdf = await PDFDocument.load(pdfBytes);

  for (let pageNumber = 1; pageNumber <= sourcePdf.numPages; pageNumber++) {
    const sourcePage = await sourcePdf.getPage(pageNumber);

    const viewport = sourcePage.getViewport({
      scale: 2,
    });

    /**
     * Check image object
     */
    if (!noImage) {
      const operatorList = await sourcePage.getOperatorList();

      let embedded = false;

      for (let i = 0; i < operatorList.fnArray.length; i++) {
        const fn = operatorList.fnArray[i];

        if (
          fn === pdfjsLib.OPS.paintImageXObject ||
          fn === pdfjsLib.OPS.paintJpegXObject
        ) {
          embedded = true;
          break;
        }
      }

      if (embedded || imageOnly) {
        /**
         * sementara pakai source PDF bytes
         * untuk image optimization pipeline
         */
        const imageBuffer = Buffer.from(pdfBytes);

        const optimizedImage = await optimizeImage(imageBuffer, {
          quality,
          format: "jpeg",
          maxWidth,
        });

        const image = await outputPdf.embedJpg(optimizedImage);

        const page = outputPdf.addPage([viewport.width, viewport.height]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });

        continue;
      }
    }

    /**
     * fallback:
     * preserve original page
     */
    const [copiedPage] = await outputPdf.copyPages(originalPdf, [
      pageNumber - 1,
    ]);

    outputPdf.addPage(copiedPage);
  }

  const compressedPdfBytes = await outputPdf.save({
    useObjectStreams: !imageOnly,
    addDefaultPage: false,
    objectsPerTick: 50,
  });

  outputPath = getOutputPath(inputPath, outputPath);

  await writeFile(outputPath, compressedPdfBytes);

  const originalSize = pdfBytes.length;
  const compressedSize = compressedPdfBytes.length;

  return {
    inputPath,
    outputPath,
    originalSize,
    compressedSize,
    saved: originalSize > compressedSize ? originalSize - compressedSize : 0,
    ratio:
      originalSize > 0
        ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
        : "0.00",
  };
}

export async function compressMultiple(paths, options = {}) {
  const allFiles = [];

  for (const target of paths) {
    const files = await collectPdfFiles(target);

    allFiles.push(...files);
  }

  const results = [];

  for (const file of allFiles) {
    const result = await compressPdf(file, null, options);

    results.push(result);
  }

  return results;
}
