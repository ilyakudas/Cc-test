/**
 * Color Wheel Beauty System - RYB Model
 *
 * Implements traditional artist's color wheel for ChromaWing beauty scoring.
 * Uses Red-Yellow-Blue (RYB) color model instead of RGB for more intuitive
 * color harmony detection.
 *
 * @module colorWheel
 * @version 1.0.0
 */

// ============================================================================
// RGB to RYB Hue Mapping Table
// ============================================================================

/**
 * Anchor points for RGB to RYB hue conversion.
 * Based on traditional artist's color wheel mapping.
 *
 * Format: [rgbHue, rybHue]
 */
const RGB_TO_RYB_MAP = [
    [0, 0],       // Red → Red
    [15, 8],      // Red-Orange
    [30, 17],     // Orange-Red
    [45, 45],     // Orange → Orange
    [60, 120],    // Yellow (RGB) → Yellow (RYB) - BIG SHIFT
    [75, 135],    // Yellow-Green
    [90, 150],    // Green-Yellow
    [105, 165],   // Green-Yellow
    [120, 180],   // Green (RGB) → Green (RYB)
    [135, 195],   // Green-Cyan
    [150, 210],   // Cyan-Green
    [165, 225],   // Cyan
    [180, 240],   // Cyan (RGB) → Blue (RYB) - BIG SHIFT
    [195, 255],   // Cyan-Blue
    [210, 270],   // Blue-Cyan
    [225, 285],   // Blue
    [240, 240],   // Blue (RGB) → Blue (RYB) - SAME
    [255, 285],   // Blue-Magenta
    [270, 300],   // Purple-Blue
    [285, 315],   // Purple
    [300, 330],   // Magenta (RGB) → Red-Purple (RYB)
    [315, 345],   // Magenta-Red
    [330, 352],   // Red-Magenta
    [345, 356],   // Red-Magenta
    [360, 360]    // Red → Red (wrap)
];

// ============================================================================
// Core Color Conversion Functions
// ============================================================================

/**
 * Convert RGB hue (0-360) to RYB hue (0-360) using piecewise linear interpolation.
 *
 * @param {number} rgbHue - RGB hue angle in degrees (0-360)
 * @returns {number} RYB hue angle in degrees (0-360)
 */
function rgbHueToRYBHue(rgbHue) {
    // Normalize to 0-360
    rgbHue = ((rgbHue % 360) + 360) % 360;

    // Find the two anchor points to interpolate between
    for (let i = 0; i < RGB_TO_RYB_MAP.length - 1; i++) {
        const [rgb1, ryb1] = RGB_TO_RYB_MAP[i];
        const [rgb2, ryb2] = RGB_TO_RYB_MAP[i + 1];

        if (rgbHue >= rgb1 && rgbHue <= rgb2) {
            // Linear interpolation between the two points
            const t = (rgbHue - rgb1) / (rgb2 - rgb1);
            const rybHue = ryb1 + t * (ryb2 - ryb1);
            return rybHue % 360;
        }
    }

    // Fallback (shouldn't happen)
    return rgbHue;
}

/**
 * Convert RGB color to RYB color wheel coordinates (HSV).
 *
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {{hue: number, saturation: number, value: number}}
 *          RYB hue (0-360), saturation (0-1), value (0-1)
 */
export function rgbToRYBWheel(r, g, b) {
    // Step 1: Normalize RGB to 0-1
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    // Step 2: Calculate standard RGB HSV
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    // Calculate RGB hue
    let rgbHue = 0;
    if (delta !== 0) {
        if (max === rn) {
            rgbHue = 60 * (((gn - bn) / delta) % 6);
        } else if (max === gn) {
            rgbHue = 60 * (((bn - rn) / delta) + 2);
        } else {
            rgbHue = 60 * (((rn - gn) / delta) + 4);
        }
    }
    if (rgbHue < 0) rgbHue += 360;

    // Step 3: Map RGB hue to RYB hue
    const rybHue = rgbHueToRYBHue(rgbHue);

    // Step 4: Calculate saturation and value (same as HSV)
    const saturation = max === 0 ? 0 : delta / max;
    const value = max;

    return {
        hue: rybHue,
        saturation,
        value
    };
}

// ============================================================================
// Color Classification Functions
// ============================================================================

/**
 * Get color name from RYB hue angle.
 *
 * @param {number} hue - RYB hue in degrees (0-360)
 * @returns {string} Color name (e.g., 'red', 'orange', 'yellow-green')
 */
export function getColorName(hue) {
    // Normalize hue
    hue = ((hue % 360) + 360) % 360;

    // 12-step color wheel (30° each)
    const colorNames = [
        { min: 0, max: 15, name: 'red' },
        { min: 15, max: 45, name: 'red-orange' },
        { min: 45, max: 75, name: 'orange' },
        { min: 75, max: 105, name: 'yellow-orange' },
        { min: 105, max: 135, name: 'yellow' },
        { min: 135, max: 165, name: 'yellow-green' },
        { min: 165, max: 195, name: 'green' },
        { min: 195, max: 225, name: 'blue-green' },
        { min: 225, max: 255, name: 'blue' },
        { min: 255, max: 285, name: 'blue-purple' },
        { min: 285, max: 315, name: 'purple' },
        { min: 315, max: 345, name: 'red-purple' },
        { min: 345, max: 360, name: 'red' }
    ];

    for (const color of colorNames) {
        if (hue >= color.min && hue < color.max) {
            return color.name;
        }
    }

    return 'red'; // Fallback
}

/**
 * Classify a color based on HSV values and assign beauty value.
 *
 * @param {number} hue - RYB hue (0-360)
 * @param {number} saturation - Saturation (0-1)
 * @param {number} value - Value/brightness (0-1)
 * @returns {{category: string, name: string, beautyValue: number}}
 */
export function classifyColor(hue, saturation, value) {
    // Black/White/Gray (achromatic)
    if (saturation < 0.15) {
        if (value < 0.2) {
            return { category: 'black', name: 'black', beautyValue: 2 };
        }
        if (value > 0.8) {
            return { category: 'white', name: 'white', beautyValue: 2 };
        }
        return { category: 'gray', name: 'gray', beautyValue: 0 };
    }

    // Muddy/Muted (low saturation, medium value)
    if (saturation < 0.4 && value < 0.6) {
        return { category: 'muddy', name: 'muddy', beautyValue: 0 };
    }

    const colorName = getColorName(hue);

    // Pastel (low saturation, high value)
    if (saturation < 0.5 && value > 0.7) {
        return {
            category: 'pastel',
            name: `pastel-${colorName}`,
            beautyValue: 5
        };
    }

    // Dark (high saturation, low value)
    if (saturation > 0.5 && value < 0.4) {
        return {
            category: 'dark',
            name: `dark-${colorName}`,
            beautyValue: 6
        };
    }

    // Pure/Vivid (high saturation, high value)
    if (saturation > 0.6 && value > 0.6) {
        return {
            category: 'vivid',
            name: colorName,
            beautyValue: 10
        };
    }

    // Medium (everything else)
    return {
        category: 'medium',
        name: colorName,
        beautyValue: 4
    };
}

// ============================================================================
// Angle Utilities
// ============================================================================

/**
 * Calculate the shortest angular difference between two hues on the color wheel.
 *
 * @param {number} hue1 - First hue (0-360)
 * @param {number} hue2 - Second hue (0-360)
 * @returns {number} Shortest angular distance (0-180)
 */
function angleDifference(hue1, hue2) {
    let diff = Math.abs(hue1 - hue2);
    if (diff > 180) {
        diff = 360 - diff;
    }
    return diff;
}

/**
 * Check if a hue is within a certain range of a target hue.
 *
 * @param {number} hue - Hue to check
 * @param {number} target - Target hue
 * @param {number} tolerance - Tolerance in degrees
 * @returns {boolean}
 */
function isHueInRange(hue, target, tolerance = 15) {
    return angleDifference(hue, target) <= tolerance;
}

/**
 * Get the complementary hue (opposite on color wheel).
 *
 * @param {number} hue - Input hue (0-360)
 * @returns {number} Complementary hue (0-360)
 */
export function getComplementaryHue(hue) {
    return (hue + 180) % 360;
}

// ============================================================================
// Harmony Detection Functions
// ============================================================================

/**
 * Detect monochromatic harmony (same hue, varied saturation/value).
 *
 * @param {Array} colors - Array of color objects with {hue, saturation, value}
 * @returns {{detected: boolean, score: number, traits: Array<string>}}
 */
function detectMonochromatic(colors) {
    if (colors.length < 2) {
        return { detected: false, score: 0, traits: [] };
    }

    const hues = colors.map(c => c.hue);
    const saturations = colors.map(c => c.saturation);
    const values = colors.map(c => c.value);

    const hueRange = Math.max(...hues) - Math.min(...hues);
    const saturationRange = Math.max(...saturations) - Math.min(...saturations);
    const valueRange = Math.max(...values) - Math.min(...values);

    // Check if all hues are within 15° of each other
    if (hueRange < 15 && saturationRange > 0.3) {
        let score = 20;
        const traits = ['Monochromatic harmony (+20)'];

        // Bonus for excellent tonal variety
        if (saturationRange > 0.5 || valueRange > 0.5) {
            score += 15;
            traits.push('Excellent tonal variety (+15)');
        }

        return { detected: true, score, traits };
    }

    return { detected: false, score: 0, traits: [] };
}

/**
 * Detect analogous harmony (adjacent colors, 30-90° range).
 *
 * @param {Array} colors - Array of color objects
 * @returns {{detected: boolean, score: number, traits: Array<string>}}
 */
function detectAnalogous(colors) {
    if (colors.length < 2) {
        return { detected: false, score: 0, traits: [] };
    }

    const hues = colors.map(c => c.hue);
    const minHue = Math.min(...hues);
    const maxHue = Math.max(...hues);
    const hueRange = maxHue - minHue;

    // Analogous: 30-90° range
    if (hueRange >= 30 && hueRange <= 90) {
        let score = 35;
        const traits = ['Analogous harmony (+35)'];

        // Check for smooth progression (sequential hues)
        const sortedHues = [...hues].sort((a, b) => a - b);
        let isSequential = true;
        for (let i = 1; i < sortedHues.length; i++) {
            if (sortedHues[i] - sortedHues[i - 1] > 40) {
                isSequential = false;
                break;
            }
        }

        if (isSequential) {
            score += 10;
            traits.push('Smooth color flow (+10)');
        }

        return { detected: true, score, traits };
    }

    return { detected: false, score: 0, traits: [] };
}

/**
 * Detect complementary harmony (opposite colors, 180° apart).
 *
 * @param {Array} colors - Array of color objects
 * @returns {{detected: boolean, score: number, traits: Array<string>}}
 */
function detectComplementary(colors) {
    if (colors.length < 2) {
        return { detected: false, score: 0, traits: [] };
    }

    const hues = colors.map(c => c.hue);

    // Check for complementary pairs
    for (let i = 0; i < hues.length; i++) {
        const hue1 = hues[i];
        const complement = getComplementaryHue(hue1);

        for (let j = i + 1; j < hues.length; j++) {
            const hue2 = hues[j];

            if (isHueInRange(hue2, complement, 15)) {
                let score = 50;
                const color1Name = getColorName(hue1);
                const color2Name = getColorName(hue2);
                const traits = [`Complementary harmony: ${color1Name} & ${color2Name} (+50)`];

                // Count how many of each
                const count1 = hues.filter(h => isHueInRange(h, hue1, 15)).length;
                const count2 = hues.filter(h => isHueInRange(h, complement, 15)).length;

                // Bonus for balanced distribution
                if (count1 === count2) {
                    score += 20;
                    traits.push('Perfect complementary balance (+20)');
                }

                return { detected: true, score, traits };
            }
        }
    }

    return { detected: false, score: 0, traits: [] };
}

/**
 * Detect split-complementary harmony (base + two adjacent to complement).
 *
 * @param {Array} colors - Array of color objects
 * @returns {{detected: boolean, score: number, traits: Array<string>}}
 */
function detectSplitComplementary(colors) {
    if (colors.length < 3) {
        return { detected: false, score: 0, traits: [] };
    }

    const hues = colors.map(c => c.hue);

    for (const baseHue of hues) {
        const complement = getComplementaryHue(baseHue);
        const splitA = (complement - 30 + 360) % 360;
        const splitB = (complement + 30) % 360;

        const hasBase = hues.some(h => isHueInRange(h, baseHue, 15));
        const hasSplitA = hues.some(h => isHueInRange(h, splitA, 15));
        const hasSplitB = hues.some(h => isHueInRange(h, splitB, 15));

        if (hasBase && hasSplitA && hasSplitB) {
            const baseName = getColorName(baseHue);
            return {
                detected: true,
                score: 55,
                traits: [`Split-complementary harmony: ${baseName} base (+55)`]
            };
        }
    }

    return { detected: false, score: 0, traits: [] };
}

/**
 * Detect triadic harmony (three colors 120° apart).
 *
 * @param {Array} colors - Array of color objects
 * @returns {{detected: boolean, score: number, traits: Array<string>}}
 */
function detectTriadic(colors) {
    if (colors.length < 3) {
        return { detected: false, score: 0, traits: [] };
    }

    const hues = colors.map(c => c.hue);

    // Check all possible triads
    for (const hue1 of hues) {
        const hue2 = (hue1 + 120) % 360;
        const hue3 = (hue1 + 240) % 360;

        const has1 = hues.some(h => isHueInRange(h, hue1, 15));
        const has2 = hues.some(h => isHueInRange(h, hue2, 15));
        const has3 = hues.some(h => isHueInRange(h, hue3, 15));

        if (has1 && has2 && has3) {
            let score = 60;
            const traits = ['Triadic harmony (+60)'];

            // Check for primary triad (Red-Yellow-Blue: 0°, 120°, 240°)
            const isPrimary = [0, 120, 240].every(primaryHue =>
                hues.some(h => isHueInRange(h, primaryHue, 20))
            );

            // Check for secondary triad (Orange-Green-Purple: 60°, 180°, 300°)
            const isSecondary = [60, 180, 300].every(secondaryHue =>
                hues.some(h => isHueInRange(h, secondaryHue, 20))
            );

            if (isPrimary) {
                score += 20;
                traits.push('Primary triad: Red-Yellow-Blue (+20)');
            } else if (isSecondary) {
                score += 20;
                traits.push('Secondary triad: Orange-Green-Purple (+20)');
            }

            return { detected: true, score, traits };
        }
    }

    return { detected: false, score: 0, traits: [] };
}

/**
 * Detect tetradic/square harmony (four colors 90° apart).
 *
 * @param {Array} colors - Array of color objects
 * @returns {{detected: boolean, score: number, traits: Array<string>}}
 */
function detectTetradic(colors) {
    if (colors.length < 4) {
        return { detected: false, score: 0, traits: [] };
    }

    const hues = colors.map(c => c.hue);

    for (const hue1 of hues) {
        const hue2 = (hue1 + 90) % 360;
        const hue3 = (hue1 + 180) % 360;
        const hue4 = (hue1 + 270) % 360;

        const has1 = hues.some(h => isHueInRange(h, hue1, 15));
        const has2 = hues.some(h => isHueInRange(h, hue2, 15));
        const has3 = hues.some(h => isHueInRange(h, hue3, 15));
        const has4 = hues.some(h => isHueInRange(h, hue4, 15));

        if (has1 && has2 && has3 && has4) {
            return {
                detected: true,
                score: 70,
                traits: ['Square/Tetradic harmony (+70)']
            };
        }
    }

    return { detected: false, score: 0, traits: [] };
}

/**
 * Detect double-complementary harmony (two complementary pairs).
 *
 * @param {Array} colors - Array of color objects
 * @returns {{detected: boolean, score: number, traits: Array<string>}}
 */
function detectDoubleComplementary(colors) {
    if (colors.length < 4) {
        return { detected: false, score: 0, traits: [] };
    }

    const hues = colors.map(c => c.hue);

    // Find all complementary pairs
    const pairs = [];
    for (let i = 0; i < hues.length; i++) {
        const complement = getComplementaryHue(hues[i]);
        for (let j = i + 1; j < hues.length; j++) {
            if (isHueInRange(hues[j], complement, 15)) {
                pairs.push([hues[i], hues[j]]);
            }
        }
    }

    // Check if we have two distinct complementary pairs
    if (pairs.length >= 2) {
        // Make sure they're distinct (not the same pair)
        for (let i = 0; i < pairs.length; i++) {
            for (let j = i + 1; j < pairs.length; j++) {
                const [a1, a2] = pairs[i];
                const [b1, b2] = pairs[j];

                // Check if pairs are different
                if (!isHueInRange(a1, b1, 15) && !isHueInRange(a1, b2, 15)) {
                    return {
                        detected: true,
                        score: 65,
                        traits: ['Double-complementary harmony (+65)']
                    };
                }
            }
        }
    }

    return { detected: false, score: 0, traits: [] };
}

/**
 * Detect the best color harmony in the given color set.
 * Returns the highest-scoring harmony found.
 *
 * @param {Array} colors - Array of color objects with {hue, saturation, value}
 * @returns {{type: string, score: number, traits: Array<string>}}
 */
export function detectHarmony(colors) {
    // Filter out achromatic colors (gray, black, white) from harmony detection
    const chromaticColors = colors.filter(c => c.category !== 'gray' && c.category !== 'black' && c.category !== 'white');

    if (chromaticColors.length < 2) {
        return { type: 'none', score: 0, traits: [] };
    }

    // Try all harmony types (highest priority first)
    const harmonies = [
        { name: 'tetradic', detector: detectTetradic },
        { name: 'double-complementary', detector: detectDoubleComplementary },
        { name: 'triadic', detector: detectTriadic },
        { name: 'split-complementary', detector: detectSplitComplementary },
        { name: 'complementary', detector: detectComplementary },
        { name: 'analogous', detector: detectAnalogous },
        { name: 'monochromatic', detector: detectMonochromatic }
    ];

    for (const harmony of harmonies) {
        const result = harmony.detector(chromaticColors);
        if (result.detected) {
            return {
                type: harmony.name,
                score: result.score,
                traits: result.traits
            };
        }
    }

    return { type: 'none', score: 0, traits: [] };
}

// ============================================================================
// Additional Scoring Functions
// ============================================================================

/**
 * Score saturation coherence (consistency in saturation levels).
 *
 * @param {Array<number>} saturations - Array of saturation values (0-1)
 * @returns {{score: number, traits: Array<string>}}
 */
export function scoreSaturationCoherence(saturations) {
    if (saturations.length < 2) {
        return { score: 0, traits: [] };
    }

    const avg = saturations.reduce((sum, s) => sum + s, 0) / saturations.length;
    const variance = saturations.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / saturations.length;

    if (variance < 0.05) {
        return {
            score: 15,
            traits: ['Consistent saturation (+15)']
        };
    } else if (variance < 0.1) {
        return {
            score: 8,
            traits: ['Fairly consistent saturation (+8)']
        };
    }

    return { score: 0, traits: [] };
}

/**
 * Score value contrast (light/dark variation).
 *
 * @param {Array<number>} values - Array of value/brightness (0-1)
 * @returns {{score: number, traits: Array<string>}}
 */
export function scoreValueContrast(values) {
    if (values.length < 2) {
        return { score: 0, traits: [] };
    }

    const valueRange = Math.max(...values) - Math.min(...values);

    if (valueRange > 0.6) {
        return {
            score: 20,
            traits: ['Excellent light/dark contrast (+20)']
        };
    } else if (valueRange > 0.4) {
        return {
            score: 10,
            traits: ['Good value contrast (+10)']
        };
    }

    return { score: 0, traits: [] };
}

/**
 * Score a gradient based on hue transition.
 *
 * @param {{hue: number, saturation: number, value: number}} startColor
 * @param {{hue: number, saturation: number, value: number}} endColor
 * @param {string} partName - Name of body part for trait message
 * @returns {{score: number, traits: Array<string>}}
 */
export function scoreGradient(startColor, endColor, partName) {
    const hueDiff = angleDifference(startColor.hue, endColor.hue);

    // Analogous gradient (30-90°)
    if (hueDiff >= 30 && hueDiff <= 90) {
        return {
            score: 15,
            traits: [`Harmonious gradient: ${partName} (+15)`]
        };
    }

    // Complementary gradient (150-210°)
    if (hueDiff >= 150 && hueDiff <= 210) {
        return {
            score: 12,
            traits: [`Complementary gradient: ${partName} (+12)`]
        };
    }

    // Subtle gradient (<15°)
    if (hueDiff < 15) {
        return {
            score: 5,
            traits: [`Subtle gradient: ${partName} (+5)`]
        };
    }

    // Chaotic gradient (other)
    return { score: 0, traits: [] };
}

// ============================================================================
// Exports
// ============================================================================

export default {
    rgbToRYBWheel,
    getColorName,
    classifyColor,
    getComplementaryHue,
    detectHarmony,
    scoreSaturationCoherence,
    scoreValueContrast,
    scoreGradient
};
