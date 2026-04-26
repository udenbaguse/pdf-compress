# PDF-Compress

Compress PDF files aggressively while preserving visual quality as much as possible.

Supports:

- Single file compression
- Multiple file compression
- Folder compression
- CLI usage
- Programmatic usage (library)

---

## Installation

Install globally:

```bash
npm install -g pdf-compress
```
---

## Why pdf-compress?

Most PDF compressors reduce quality too aggressively.

pdf-compress focuses on:

- smaller file size
- preserving visual quality
- aggressive object optimization
- image optimization
- simple CLI usage


## Features

- Compress single PDF
- Compress multiple PDFs
- Compress PDF folders
- Quality presets
- Custom quality (0-100)
- Image-only compression
- Text-only compression
- ES Modules support
- CLI support
- Library support

---

## Usage

### CLI

#### Basic :
```bash
pdf-compress <path>
```

#### Example :
```bash
pdf-compress ./document.pdf
```

#### Compress Multiple Files
```bash
pdf-compress ./file1.pdf ./file2.pdf ./file3.pdf
```

#### Compress Folder
```bash
pdf-compress ./pdf-folder
```

#### Custom Output Path
```bash
pdf-compress ./document.pdf -o ./output.pdf
```
### CLI Options :
- --q-<number> : Set custom quality (0-100)
- --q-low : Use low quality preset
- --q-medium : Use medium quality preset
- --q-high : Use high quality preset
- --no-image : Skip image compression (Best for text-heavy PDFs &
vector PDFs)
- --image-only : Compress only images (Best for: scanned PDFs &
image-heavy PDFs)

---

## Library Usage
Import :
```bash
import { compressPdf } from "pdf-compress";
```
Basic :
```bash
import { compressPdf } from "pdf-compress";

const result = await compressPdf(
  "./document.pdf"
);

console.log(result);
```

Custom Options :
```bash
import { compressPdf } from "pdf-compress";

const result = await compressPdf(
  "./document.pdf",
  "./output.pdf",
  {
    quality: 80
  }
);

console.log(result);
```

## Multiple File (Library) :
```bash
import { compressMultiple } from "pdf-compress";

const results = await compressMultiple([
  "./a.pdf",
  "./b.pdf"
]);

console.log(results);
```

---

### Compression Modes
#### High (default)
Preserves visual quality.

Good for:
- official documents
- ebooks
- reports

#### Medium
Balanced compression.

Good for:
- normal documents
- mixed content

#### Low
Aggressive compression.

Good for:
- large scanned PDFs
- archive files

---

## Result Object

Returned object after compression:

```js
{
  inputPath,
  outputPath,
  originalSize,
  compressedSize,
  saved,
  ratio
}
```

Example:

```js
{
  inputPath: "./file.pdf",
  outputPath: "./file-compressed.pdf",
  originalSize: 10485760,
  compressedSize: 5242880,
  saved: 5242880,
  ratio: "50.00"
}
```

### Field Description

| Field | Description |
|---|---|
| `inputPath` | Original PDF file path |
| `outputPath` | Compressed PDF output path |
| `originalSize` | Original file size in bytes |
| `compressedSize` | Compressed file size in bytes |
| `saved` | Total bytes saved after compression |
| `ratio` | Compression percentage |

---

## Compression Results

Compression results depend on:

- PDF structure
- Image count
- Embedded resources
- Original image quality
- Existing compression inside PDF

Typical compression range:

### Text-heavy PDF

Best for:

- ebooks
- reports
- documentation

Expected reduction:

```text
5% - 20%
```

---

### Mixed PDF

Best for:

- reports with images
- presentation exports
- educational documents

Expected reduction:

```text
20% - 60%
```

---

### Image-heavy PDF

Best for:

- scanned documents
- portfolios
- image-based reports

Expected reduction:

```text
40% - 90%
```

---

## Compression Strategy

### High (Default)

Focus:

- preserve visual quality
- optimize internal PDF objects
- keep image quality at maximum

Good for:

- official documents
- client files
- final delivery files

---

### Medium

Focus:

- balanced compression
- moderate image optimization
- reduce size more aggressively

Good for:

- general usage
- uploads
- sharing

---

### Low

Focus:

- aggressive compression
- image downscaling
- maximum file reduction

Good for:

- archives
- backups
- low-storage environments

---

## CLI Options

| Option | Description |
|---|---|
| `-o, --output <path>` | Set custom output path |
| `--q-low` | Low quality compression |
| `--q-medium` | Medium quality compression |
| `--q-high` | High quality compression (default) |
| `--q-<number>` | Custom quality (0-100) |
| `--no-image` | Compress text/object only |
| `--image-only` | Compress images only |

---

## Output File Naming

Default output file:

Input:

```text
document.pdf
```

Output:

```text
document-compressed.pdf
```

Input:

```text
report.pdf
```

Output:

```text
report-compressed.pdf
```

Custom output:

```bash
pdf-compress ./document.pdf -o ./custom-output.pdf
```

---

## Requirements

Minimum:

```text
Node.js >=18
```

Recommended:

```text
Node.js >=20
```

---

## Dependencies

Core dependencies:

- pdfjs-dist
- pdf-lib
- sharp
- commander

---

## Error Handling

Common errors:

### File not found

Example:

```text
ENOENT: no such file or directory
```

Fix:

Make sure file path is correct.

---

### Invalid PDF

Example:

```text
Invalid PDF structure
```

Fix:

Make sure input file is a valid PDF.

---

### Permission denied

Example:

```text
EACCES
```

Fix:

Make sure you have permission to read/write files.

---

## Best Practices

Use `--q-high` when:

- quality matters
- document is important
- official use

Use `--q-medium` when:

- file size matters
- general sharing
- uploading

Use `--q-low` when:

- maximum compression needed
- archive purpose
- storage optimization

Use `--no-image` when:

- PDF contains mostly text
- vector-based PDF

Use `--image-only` when:

- scanned PDFs
- image-heavy PDFs

---

## Performance Notes

Compression speed depends on:

- file size
- number of pages
- image count
- image resolution

Typical speed:

Small PDF:

```text
< 2 seconds
```

Medium PDF:

```text
2 - 10 seconds
```

Large PDF:

```text
10+ seconds
```

---

## Limitations

- Compression result varies depending on PDF structure
- Already compressed PDFs may not shrink much
- Some PDFs may preserve size if optimized already

---

## Roadmap

Planned improvements:

- Better embedded image replacement
- Duplicate image detection
- Metadata stripping
- Smarter compression profiling
- Better CLI reporting

---

## Contributing

Contributions are welcome.

Fork the repository, improve it, and submit a pull request.

---

## License
This project is licensed under the MIT License. 
It also incorporates third-party open-source software; 
see the [license](license) for a full list of dependencies.

---

## Author

Created by Muhamad Syamsudin (@udenbaguse)

GitHub:

https://github.com/udenbaguse

NPM:

https://www.npmjs.com/package/pdf-compress
