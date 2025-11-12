/**
 * ChromaWing Breeding Simulator - SVG Rendering Module
 * Handles SVG template loading and parrot visualization
 */

import { getSvgCache, setSvgCache, getNextGradientId } from './gameState.js';

/**
 * Load SVG template from file
 * @returns {Promise<string|null>} SVG template text or null on error
 */
export async function loadSVGTemplate() {
    const cached = getSvgCache();
    if (cached) return cached;

    try {
        const response = await fetch('Parrot-1-recolored.svg');
        const svgText = await response.text();
        setSvgCache(svgText);
        return svgText;
    } catch (error) {
        console.error('Failed to load SVG:', error);
        return null;
    }
}

/**
 * Generate colored SVG for a parrot based on its genes
 * @param {Parrot} parrot - Parrot instance to render
 * @returns {Promise<string>} Colored SVG markup
 */
export async function generateParrotSVG(parrot) {
    const template = await loadSVGTemplate();
    if (!template) return '<div>Error loading parrot</div>';

    let svg = template;

    // Fixed colors for non-genetic elements
    const GROUND_COLOR = '#8B7355';
    const SKY_COLOR = '#87CEEB';
    const EYE_BLACK = '#000000';
    const EYE_WHITE = '#FFFFFF';
    const CLAW_COLOR = '#4A4A4A';
    const FACE_COLOR = '#FFFFFF';
    const CONTOUR_COLOR = '#000000';
    const BEAK_COLOR = '#696969';

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
        const svgMatch = svg.match(/<svg[^>]*>/);
        if (svgMatch) {
            const openingSvgTag = svgMatch[0];
            svg = svg.replace(openingSvgTag, `${openingSvgTag}<defs>${gradientDefs}</defs>`);
        }
    }

    // Body part to feather group mapping
    const bodyPartMap = {
        'wings': ['wing-blue'],
        'special_wing': [],
        'body': ['body-yellow'],
        'head': ['accent-blue'],
        'tail': ['accent-green', 'accent-white'],
        'accents': ['accent-brown']
    };

    // Fixed color elements (non-genetic)
    const fixedColorElements = {
        // Branches (body-gold 1-11)
        'body-gold-1': GROUND_COLOR, 'body-gold-2': GROUND_COLOR, 'body-gold-3': GROUND_COLOR,
        'body-gold-4': GROUND_COLOR, 'body-gold-5': GROUND_COLOR, 'body-gold-6': GROUND_COLOR,
        'body-gold-7': GROUND_COLOR, 'body-gold-8': GROUND_COLOR, 'body-gold-9': GROUND_COLOR,
        'body-gold-10': GROUND_COLOR, 'body-gold-11': GROUND_COLOR,

        // Ground (covert-yellow 1-5)
        'covert-yellow-1': GROUND_COLOR, 'covert-yellow-2': GROUND_COLOR, 'covert-yellow-3': GROUND_COLOR,
        'covert-yellow-4': GROUND_COLOR, 'covert-yellow-5': GROUND_COLOR,

        // Sky (accent-white 1-2)
        'accent-white-1': SKY_COLOR,
        'accent-white-2': SKY_COLOR,

        // Eyes (non-genetic)
        'body-yellow-4': EYE_BLACK,
        'accent-white-4': EYE_WHITE,

        // Beak (detail-gray 1, 2, 3)
        'detail-gray-1': BEAK_COLOR,
        'detail-gray-2': BEAK_COLOR,
        'detail-gray-3': BEAK_COLOR,

        // Claws (other 2-4)
        'other-2': CLAW_COLOR,
        'other-3': CLAW_COLOR,
        'other-4': CLAW_COLOR,

        // Face marking (non-genetic white)
        'accent-white-3': FACE_COLOR
    };

    // Apply fixed colors first
    Object.keys(fixedColorElements).forEach(featherId => {
        const color = fixedColorElements[featherId];
        const regex = new RegExp(`id="${featherId}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${color}"`);
        });
    });

    // Apply special wing feathers (wing-blue-1 and wing-blue-4)
    const specialWingFillValue = specialWingColor.isGradient ? `url(#${gradientMap['special_wing']})` : specialWingColor.color;
    for (const featherId of ['wing-blue-1', 'wing-blue-4']) {
        const regex = new RegExp(`id="${featherId}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${specialWingFillValue}"`);
        });
    }

    // Apply tail tip color (other-1) - uses tail color
    const tailTipFillValue = tailColor.isGradient ? `url(#${gradientMap['tail']})` : tailColor.color;
    const tailTipRegex = new RegExp(`id="other-1"[^>]*fill="[^"]*"`, 'g');
    svg = svg.replace(tailTipRegex, match => {
        return match.replace(/fill="[^"]*"/, `fill="${tailTipFillValue}"`);
    });

    // Apply body part colors to feather groups
    const colorAssignments = {
        'wings': wingColor,
        'special_wing': specialWingColor,
        'body': bodyColor,
        'head': headColor,
        'tail': tailColor,
        'accents': accentColor
    };

    Object.keys(bodyPartMap).forEach(bodyPart => {
        const groups = bodyPartMap[bodyPart];
        const colorData = colorAssignments[bodyPart];
        const fillValue = colorData.isGradient ? `url(#${gradientMap[bodyPart]})` : colorData.color;

        groups.forEach(groupPrefix => {
            for (let i = 1; i <= 30; i++) {
                const featherId = `${groupPrefix}-${i}`;

                // Skip all fixed elements
                if (fixedColorElements[featherId]) continue;

                // Skip special wing feathers
                if (featherId === 'wing-blue-1' || featherId === 'wing-blue-4') continue;

                const regex = new RegExp(`id="${featherId}"[^>]*fill="[^"]*"`, 'g');
                svg = svg.replace(regex, match => {
                    return match.replace(/fill="[^"]*"/, `fill="${fillValue}"`);
                });
            }
        });
    });

    // Keep contours black (detail-black)
    for (let i = 1; i <= 30; i++) {
        const regex = new RegExp(`id="detail-black-${i}"[^>]*fill="[^"]*"`, 'g');
        svg = svg.replace(regex, match => {
            return match.replace(/fill="[^"]*"/, `fill="${CONTOUR_COLOR}"`);
        });
    }

    return svg;
}
