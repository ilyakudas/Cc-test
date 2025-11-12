// ChromaWing - SVG Renderer
// v3.0

import { getNextGradientId } from '../game/gameState.js';
import { FIXED_COLORS } from './colors.js';

let svgCache = null;

// Load SVG template
export async function loadSVGTemplate() {
    if (svgCache) return svgCache;

    try {
        const response = await fetch('/Parrot-1-recolored.svg');
        const svgText = await response.text();
        svgCache = svgText;
        return svgText;
    } catch (error) {
        console.error('Failed to load SVG:', error);
        return null;
    }
}

// Generate colored SVG for parrot
export async function generateParrotSVG(parrot) {
    const template = await loadSVGTemplate();
    if (!template) return '<div>Error loading parrot</div>';

    let svg = template;

    // Calculate colors for each body part
    const wingColor = parrot.calculateBodyPartColor('wings');
    const specialWingColor = parrot.calculateBodyPartColor('special_wing');
    const bodyColor = parrot.calculateBodyPartColor('body');
    const headColor = parrot.calculateBodyPartColor('head');
    const tailColor = parrot.calculateBodyPartColor('tail');
    const accentColor = parrot.calculateBodyPartColor('accents');

    // Create gradient definitions if needed
    let gradientDefs = '';
    const gradientMap = {};

    const gradientParts = {
        'wings': wingColor,
        'special_wing': specialWingColor,
        'body': bodyColor,
        'head': headColor,
        'tail': tailColor,
        'accents': accentColor
    };

    Object.keys(gradientParts).forEach(partName => {
        const colorData = gradientParts[partName];
        if (colorData.isGradient) {
            const id = `grad-${partName}-${getNextGradientId()}`;
            gradientMap[partName] = id;
            gradientDefs += `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:${colorData.startColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${colorData.endColor};stop-opacity:1" />
            </linearGradient>`;
        }
    });

    // Insert gradients into SVG
    if (gradientDefs) {
        svg = svg.replace('<defs>', `<defs>${gradientDefs}`);
    }

    // Replace colors for each body part
    // Wings (blue feathers)
    const wingFill = wingColor.isGradient ? `url(#${gradientMap['wings']})` : wingColor.color;
    for (let i = 1; i <= 18; i++) {
        const regex = new RegExp(`id="wing-blue-${i}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${wingFill}"`);
        });
    }

    // Special wing (yellow coverts)
    const specialWingFill = specialWingColor.isGradient ? `url(#${gradientMap['special_wing']})` : specialWingColor.color;
    for (let i = 1; i <= 5; i++) {
        const regex = new RegExp(`id="wing-yellow-${i}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${specialWingFill}"`);
        });
    }

    // Tail feathers
    const tailFill = tailColor.isGradient ? `url(#${gradientMap['tail']})` : tailColor.color;
    const tailTipRegex = /id="tail-tip"[^>]*fill="[^"]*"/g;
    svg = svg.replace(tailTipRegex, match => {
        return match.replace(/fill="[^"]*"/, `fill="${tailFill}"`);
    });

    // Body (yellow)
    const bodyFill = bodyColor.isGradient ? `url(#${gradientMap['body']})` : bodyColor.color;
    for (let i = 1; i <= 10; i++) {
        const regex = new RegExp(`id="body-yellow-${i}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${bodyFill}"`);
        });
    }

    // Body gold/brown
    for (let i = 1; i <= 11; i++) {
        const regex = new RegExp(`id="body-gold-${i}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${bodyFill}"`);
        });
    }

    // Head
    const headFill = headColor.isGradient ? `url(#${gradientMap['head']})` : headColor.color;
    for (let i = 1; i <= 20; i++) {
        const regex = new RegExp(`id="head-${i}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${headFill}"`);
        });
    }

    // Accents (green)
    const accentFill = accentColor.isGradient ? `url(#${gradientMap['accents']})` : accentColor.color;
    for (let i = 1; i <= 7; i++) {
        const regex = new RegExp(`id="accent-green-${i}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${accentFill}"`);
        });
    }

    // Fixed colors
    svg = svg.replace(/id="body-yellow-4"[^>]*fill="[^"]*"/g, match => {
        return match.replace(/fill="[^"]*"/, `fill="${FIXED_COLORS.EYE_BLACK}"`);
    });

    svg = svg.replace(/id="accent-white-4"[^>]*fill="[^"]*"/g, match => {
        return match.replace(/fill="[^"]*"/, `fill="${FIXED_COLORS.EYE_WHITE}"`);
    });

    return svg;
}
