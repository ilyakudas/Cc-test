#!/usr/bin/env python3
"""
SVG Feather Recoloring Script
Takes an SVG parrot and recolors individual feathers with unique IDs
for genetics-based color control.
"""

import re
import sys

# Color mapping for genetics
COLOR_MAPPING = {
    '#4897AC': {  # Blue wing feathers
        'name': 'wing-blue',
        'genetic_role': 'BB genes - Blue primary wing feathers',
        'variations': ['#003F7F', '#004B8D', '#00589B', '#0066AA', '#0073B8', '#0080C6', '#1E90FF', '#4169E1']
    },
    '#F9D34D': {  # Yellow/gold body feathers
        'name': 'body-yellow',
        'genetic_role': 'YY genes - Yellow/gold body feathers',
        'variations': ['#FFD700', '#FFC700', '#FFB700', '#FFA500', '#FF9500', '#FFDF00', '#F4A261']
    },
    '#D8D081': {  # Pale yellow feathers
        'name': 'covert-yellow',
        'genetic_role': 'YY genes - Yellow wing coverts',
        'variations': ['#FFEBCD', '#FFE4B5', '#FFD700', '#F0E68C']
    },
    '#A7863C': {  # Brownish-gold feathers
        'name': 'body-gold',
        'genetic_role': 'Yy genes - Gold/brown body feathers',
        'variations': ['#DAA520', '#B8860B', '#CD853F', '#D2691E']
    },
    '#5BA955': {  # Green feathers
        'name': 'accent-green',
        'genetic_role': 'YY + BB mix - Green accent feathers',
        'variations': ['#228B22', '#32CD32', '#7FFF00', '#ADFF2F', '#50C878']
    }
}

def recolor_svg(input_file, output_file):
    """Recolor SVG feathers with unique IDs and gradient colors."""

    # Read the original SVG
    with open(input_file, 'r') as f:
        svg_content = f.read()

    # Extract viewBox and dimensions
    viewbox_match = re.search(r'viewBox="([^"]*)"', svg_content)
    width_match = re.search(r'width="([^"]*)"', svg_content)
    height_match = re.search(r'height="([^"]*)"', svg_content)

    viewbox = viewbox_match.group(1) if viewbox_match else "0 0 1024 1024"
    width = width_match.group(1) if width_match else "1024"
    height = height_match.group(1) if height_match else "1024"

    # Extract all paths
    paths = re.findall(r'<path fill="([^"]*)" d="([^"]*)"/?>', svg_content)

    print(f"Processing {input_file}...")
    print(f"Found {len(paths)} paths")

    # Start building the new SVG
    output_lines = []
    output_lines.append('<?xml version="1.0" encoding="UTF-8"?>')
    output_lines.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="{viewbox}">')
    output_lines.append('  <!-- ChromaWing Parrot - Individual Feather Control -->')
    output_lines.append('  <!-- Each feather can be recolored based on genetic makeup -->')
    output_lines.append('')

    # Add gradient definitions
    output_lines.append('  <defs>')
    output_lines.append('    <linearGradient id="gradient_0">')
    output_lines.append('      <stop offset="0%" stop-color="#FF6B6B"/>')
    output_lines.append('      <stop offset="100%" stop-color="#4ECDC4"/>')
    output_lines.append('    </linearGradient>')
    output_lines.append('  </defs>')
    output_lines.append('')

    # Group paths by color
    color_counters = {}
    for i, (fill, d) in enumerate(paths):
        # Clean color name for ID
        color_clean = fill.replace('#', '').replace('(', '').replace(')', '').replace('url', '').replace('gradient_0', 'gradient')

        if color_clean not in color_counters:
            color_counters[color_clean] = 0
        color_counters[color_clean] += 1

        # Determine group name and apply variations
        if fill in COLOR_MAPPING:
            group_name = COLOR_MAPPING[fill]['name']
            variations = COLOR_MAPPING[fill]['variations']
            if len(variations) > 0:
                new_color = variations[color_counters[color_clean] % len(variations)]
            else:
                new_color = fill
        elif fill in ['#000100', '#111008', '#332910']:
            group_name = 'detail-black'
            new_color = fill
        elif fill in ['white']:
            group_name = 'accent-white'
            new_color = fill
        elif fill in ['#6C6458', '#484844', '#908768']:
            group_name = 'detail-gray'
            new_color = fill
        elif fill in ['#5C4E1D', '#7E712C']:
            group_name = 'accent-brown'
            new_color = fill
        elif fill in ['#2D4B55', '#487C93']:
            group_name = 'accent-blue'
            new_color = fill
        elif fill in ['#318340', '#244F22', '#509E85']:
            group_name = 'accent-green'
            new_color = fill
        else:
            group_name = 'other'
            new_color = fill

        feather_id = f"{group_name}-{color_counters[color_clean]}"

        # Add comment for first feather in group
        if color_counters[color_clean] == 1:
            output_lines.append(f'  <!-- {group_name.upper().replace("-", " ")} FEATHERS -->')

        # Add the path with ID and new color
        output_lines.append(f'  <path id="{feather_id}" fill="{new_color}" d="{d}"/>')

    output_lines.append('</svg>')

    # Write to new file
    with open(output_file, 'w') as f:
        f.write('\n'.join(output_lines))

    print(f"Created {output_file} with {len(paths)} individually identified feathers")
    print("\nFeather groups:")
    for group, count in sorted(set((name.split('-')[0] + '-' + name.split('-')[1] if len(name.split('-')) > 1 else name, 1) for name in [f"{k.replace('#', '')}" for k in color_counters.keys()])):
        print(f"  - {group}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python recolor_svg.py <input.svg> <output.svg>")
        print("Example: python recolor_svg.py Parrot-1.svg Parrot-1-recolored.svg")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    recolor_svg(input_file, output_file)
