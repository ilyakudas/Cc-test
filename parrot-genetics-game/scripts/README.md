# SVG Processing Scripts

Python utilities for analyzing and processing SVG files for the ChromaWing genetics game.

## Scripts

### analyze_svg.py

Analyzes an SVG file to understand its structure before processing.

**Usage:**
```bash
python3 analyze_svg.py input.svg
```

**Output:**
- Total number of paths
- Color distribution (number of paths per color)
- Helps identify which colors represent which body parts

**Example:**
```bash
python3 analyze_svg.py ../Parrot-1.svg
```

### recolor_svg.py

Recolors an SVG parrot by giving each feather a unique ID and applying color gradients based on genetic roles.

**Usage:**
```bash
python3 recolor_svg.py input.svg output.svg
```

**What it does:**
- Assigns unique IDs to each feather (e.g., `wing-blue-1`, `body-yellow-5`)
- Groups feathers by genetic role (wing, body, accents)
- Applies color gradients within each group
- Prepares SVG for programmatic genetics-based coloring

**Example:**
```bash
python3 recolor_svg.py ../Parrot-1.svg ../Parrot-1-recolored.svg
```

## Color Mapping

The script uses predefined color mappings for different genetic roles:

- **Blue Wing Feathers (#4897AC)**: BB genes - Primary wing feathers
- **Yellow Body Feathers (#F9D34D)**: YY genes - Main body coloration
- **Yellow Wing Coverts (#D8D081)**: YY genes - Secondary wing features
- **Gold/Brown Body (#A7863C)**: Yy genes - Mixed yellow expression
- **Green Accents (#5BA955)**: YY + BB genes - Color mixing

## Requirements

- Python 3.6 or higher
- No external dependencies (uses only standard library)

## Tips

1. **Before recoloring**: Run `analyze_svg.py` to understand the color distribution
2. **Customize colors**: Edit the `COLOR_MAPPING` dictionary in `recolor_svg.py` to change gradient colors
3. **Add new groups**: Add entries to `COLOR_MAPPING` to handle new color groups
4. **Preserve originals**: Always work with copies of original SVG files

## Future Improvements

- Add command-line arguments for custom color mappings
- Support for pattern overlays (speckled, striped genotypes)
- Batch processing of multiple SVG files
- SVG optimization to reduce file size
