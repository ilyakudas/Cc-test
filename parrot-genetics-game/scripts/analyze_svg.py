#!/usr/bin/env python3
"""
SVG Color Analyzer
Analyzes an SVG file and counts unique fill colors and paths.
Useful for understanding the structure of complex SVG files before processing.
"""

import re
import sys
from collections import defaultdict

def analyze_svg(svg_file):
    """Analyze SVG file and return color statistics."""

    with open(svg_file, 'r') as f:
        svg_content = f.read()

    # Extract all paths with their fill colors
    paths = re.findall(r'<path fill="([^"]*)" d="([^"]*)"', svg_content)

    print(f"=== SVG Analysis: {svg_file} ===\n")
    print(f"Total paths found: {len(paths)}")

    # Count paths by color
    color_groups = defaultdict(list)
    for fill, d in paths:
        color_groups[fill].append(d)

    # Sort by count (descending)
    sorted_colors = sorted(color_groups.items(), key=lambda x: len(x[1]), reverse=True)

    print("\nColor Distribution:")
    print("-" * 50)
    for color, paths_list in sorted_colors:
        print(f"{color:20s}: {len(paths_list):3d} paths")

    return color_groups

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_svg.py <svg_file>")
        sys.exit(1)

    svg_file = sys.argv[1]
    analyze_svg(svg_file)
