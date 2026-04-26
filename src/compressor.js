import { stat, readdir } from "fs/promises";
import { spawn } from "child_process";
import path from "path";

function getOutputPath(inputPath, customOutput) {
  if (customOutput) return customOutput;

  const parsed = path.parse(inputPath);

  return path.join(parsed.dir, `${parsed.name}-compressed${parsed.ext}`);
}

function getPdfSetting(level = "high") {
  const map = {
    low: "/screen",
    medium: "/ebook",
    high: "/printer",
  };

  return map[level] ?? "/printer";
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

function runGhostscript(inputPath, outputPath, level) {
  return new Promise((resolve, reject) => {
    const gsCommand = process.platform === "win32" ? "gswin64c" : "gs";

    const args = [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      `-dPDFSETTINGS=${getPdfSetting(level)}`,
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    const processGs = spawn(gsCommand, args);

    processGs.on("error", reject);

    processGs.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Ghostscript exited with code ${code}`));
      }
    });
  });
}

export async function compressPdf(inputPath, outputPath = null, options = {}) {
  outputPath = getOutputPath(inputPath, outputPath);

  const level = options.level ?? "high";

  const before = await stat(inputPath);

  await runGhostscript(inputPath, outputPath, level);

  const after = await stat(outputPath);

  const originalSize = before.size;
  const compressedSize = after.size;

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
