
---

# `CHANGELOG.md`

```md
# Changelog

All notable changes to this project will be documented here.

---
## [1.0.1]
### Fixed
- Fixed commander not found on error message

## [1.0.0] - Initial Release 26-04-2026

### Added

- Initial PDF compression support
- CLI support
- ES Modules support
- Single PDF compression
- Multiple PDF compression
- Folder PDF compression
- Automatic output file naming
- Custom output path support
- Quality presets:
  - low
  - medium
  - high
- Custom quality support (0-100)
- Image-only compression mode
- Text-only compression mode
- PDF object stream optimization
- Embedded image detection via pdfjs-dist
- Image optimization via sharp
- PDF rebuilding via pdf-lib

### Performance

- Reduced PDF object overhead
- Improved output file size
- Better image optimization pipeline

### Notes

Default compression mode preserves visual quality while optimizing file size aggressively.