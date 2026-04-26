#!/usr/bin/env node

import { program } from "commander";
import { compressMultiple } from "./compressor.js";
import packageJson from "../package.json" with { type: "json" };

function parseQuality(argv) {
  const qualityArg = argv.find((arg) => /^--q-\d+$/.test(arg));

  if (!qualityArg) return null;

  return Number(qualityArg.replace("--q-", ""));
}

const qualityNumber = parseQuality(process.argv);

program
  .name("pdf-compress")
  .version(packageJson.version)
  .description("Compress PDF files")
  .argument("<paths...>", "PDF file or directory")
  .option("-o, --output <path>", "custom output path")
  .option("--q-low", "low quality")
  .option("--q-medium", "medium quality")
  .option("--q-high", "high quality")
  .option("--no-image", "compress text only")
  .option("--image-only", "compress image only")
  .action(async (paths, options) => {
    try {
      let level = "high";

      if (options.qLow) level = "low";
      if (options.qMedium) level = "medium";
      if (options.qHigh) level = "high";

      const results = await compressMultiple(paths, {
        level,
        quality: qualityNumber,
        noImage: options.noImage,
        imageOnly: options.imageOnly,
      });

      for (const result of results) {
        console.log("\n✅ Compression completed");
        console.log(`File: ${result.inputPath}`);
        console.log(`Output: ${result.outputPath}`);
        console.log(
          `Original: ${(result.originalSize / 1024 / 1024).toFixed(2)} MB`,
        );
        console.log(
          `Compressed: ${(result.compressedSize / 1024 / 1024).toFixed(2)} MB`,
        );
        console.log(`Saved: ${result.ratio}%`);
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  });

program.parse();
