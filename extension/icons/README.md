# Extension Icons

Add the following PNG icons to this directory:

- `icon16.png` - 16x16 pixels
- `icon32.png` - 32x32 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Design Guidelines

The icon should:
- Be simple and recognizable at small sizes
- Use the Text Transform brand colors (blue #3b82f6, purple #8b5cf6)
- Have a transparent background
- Represent text transformation (e.g., "Tt" letters, transformation arrows)

## Temporary Icons

For development, you can create simple colored squares:

```bash
# Using ImageMagick (if installed)
convert -size 16x16 xc:#3b82f6 icon16.png
convert -size 32x32 xc:#3b82f6 icon32.png
convert -size 48x48 xc:#3b82f6 icon48.png
convert -size 128x128 xc:#3b82f6 icon128.png
```

Or use any image editor to create placeholder icons.
