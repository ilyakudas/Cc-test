/**
 * ChromaWing Breeding Simulator - Parrot Class Module
 * Contains the Parrot class with all genetics and beauty calculation logic
 */

import { incrementParrotIdCounter } from './gameState.js';
import {
    PARROT_BASE_VALUE,
    PARROT_BEAUTY_MULTIPLIER,
    PARROT_GENERATION_VALUE,
    RARITY_VALUE_MULTIPLIERS
} from '../lib/economy.js';

/**
 * Parrot class with RGB Genetics v2.1
 * 78 genes: 6 body parts × 13 genes each
 */
export class Parrot {
    constructor(name, genes, generation = 1, id = null) {
        this.id = id !== null ? id : incrementParrotIdCounter();
        this.name = name;
        // Gene structure: wings, special_wing, body, head, tail, accents
        // Each has: 4 red, 4 green, 4 blue, 1 gradient = 13 genes per part
        this.genes = genes;
        this.generation = generation;
    }

    countDominant(alleles) {
        return alleles.filter(a => a === true).length;
    }

    calculateRGBValue(alleles) {
        const count = this.countDominant(alleles);
        return Math.round((count / alleles.length) * 255);
    }

    calculateBodyPartColor(bodyPart) {
        const part = this.genes[bodyPart];
        const gradient = part.gradient;

        if (!gradient) {
            const r = this.calculateRGBValue(part.red);
            const g = this.calculateRGBValue(part.green);
            const b = this.calculateRGBValue(part.blue);
            return {
                color: `rgb(${r}, ${g}, ${b})`,
                isGradient: false
            };
        } else {
            const startR = this.calculateRGBValue([part.red[0], part.red[1]]);
            const startG = this.calculateRGBValue([part.green[0], part.green[1]]);
            const startB = this.calculateRGBValue([part.blue[0], part.blue[1]]);

            const endR = this.calculateRGBValue([part.red[2], part.red[3]]);
            const endG = this.calculateRGBValue([part.green[2], part.green[3]]);
            const endB = this.calculateRGBValue([part.blue[2], part.blue[3]]);

            return {
                startColor: `rgb(${startR}, ${startG}, ${startB})`,
                endColor: `rgb(${endR}, ${endG}, ${endB})`,
                isGradient: true
            };
        }
    }

    hasAnyGradients() {
        return Object.values(this.genes).some(part => part.gradient === true);
    }

    // Calculate rarity score based on genetic patterns
    // Distance from 2 (center) determines rarity: 0 or 4 = most rare, 1 or 3 = somewhat rare, 2 = common
    calculateRarity() {
        let rareTraits = 0;
        const maxTraits = 60; // Absolute maximum: 6 parts × (6 color points + 4 gradient points)

        for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
            const part = this.genes[bodyPart];

            // Check each color channel for pure patterns
            const redCount = this.countDominant(part.red);
            const greenCount = this.countDominant(part.green);
            const blueCount = this.countDominant(part.blue);

            // Distance from 2 (most common due to breeding)
            // 0 or 4 = 2 points (pure, most rare)
            // 1 or 3 = 1 point (nearly pure, somewhat rare)
            // 2 = 0 points (mixed, common)
            const redRarity = redCount === 0 || redCount === 4 ? 2 : (redCount === 1 || redCount === 3 ? 1 : 0);
            const greenRarity = greenCount === 0 || greenCount === 4 ? 2 : (greenCount === 1 || greenCount === 3 ? 1 : 0);
            const blueRarity = blueCount === 0 || blueCount === 4 ? 2 : (blueCount === 1 || blueCount === 3 ? 1 : 0);

            rareTraits += redRarity + greenRarity + blueRarity;

            // Gradient is very rare (worth 4 points)
            if (part.gradient) {
                rareTraits += 4;
            }
        }

        // Return rarity level: common, uncommon, rare, epic, legendary
        const rarityRatio = rareTraits / maxTraits;
        if (rarityRatio >= 0.9) return 'legendary';  // 54+ out of 60 points
        if (rarityRatio >= 0.7) return 'epic';       // 42+ out of 60 points
        if (rarityRatio >= 0.5) return 'rare';       // 30+ out of 60 points
        if (rarityRatio >= 0.3) return 'uncommon';   // 18+ out of 60 points
        return 'common';
    }

    getValue() {
        let score = 0;
        for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
            const part = this.genes[bodyPart];
            score += this.countDominant(part.red);
            score += this.countDominant(part.green);
            score += this.countDominant(part.blue);
            if (part.gradient) score += 10;
        }

        // Factor in rarity for pricing
        const baseValue = PARROT_BASE_VALUE + Math.floor(score * PARROT_BEAUTY_MULTIPLIER) + (this.generation * PARROT_GENERATION_VALUE);
        const rarity = this.calculateRarity();

        return Math.floor(baseValue * RARITY_VALUE_MULTIPLIERS[rarity]);
    }

    // Classify color based on RGB values
    classifyColor(r, g, b) {
        // Normalize to 0-1 range
        const rn = r / 255;
        const gn = g / 255;
        const bn = b / 255;

        // Define thresholds for full, half, and low intensity
        const full = 0.85;  // 255 or close
        const high = 0.6;   // 150+
        const half = 0.4;   // ~128
        const low = 0.2;    // 50 or less

        // Pure full colors
        if (rn > full && gn < low && bn < low) return 'red';
        if (rn < low && gn > full && bn < low) return 'green';
        if (rn < low && gn < low && bn > full) return 'blue';
        if (rn > full && gn > full && bn < low) return 'yellow';
        if (rn < low && gn > full && bn > full) return 'cyan';
        if (rn > full && gn < low && bn > full) return 'magenta';

        // Half-intensity pure colors (128, 0, 0) etc
        if (rn > half && rn < high && gn < low && bn < low) return 'dark-red';
        if (rn < low && gn > half && gn < high && bn < low) return 'dark-green';
        if (rn < low && gn < low && bn > half && bn < high) return 'dark-blue';

        // Orange variations
        if (rn > full && gn > half && gn < high && bn < low) return 'orange';
        if (rn > high && gn > half && gn < high && bn < low) return 'orange';

        // Two-component half colors (128, 255, 0) etc
        if (rn > half && rn < high && gn > full && bn < low) return 'lime';
        if (rn > full && gn > half && gn < high && bn < low) return 'amber';
        if (rn < low && gn > half && gn < high && bn > full) return 'sky';
        if (rn < low && gn > full && bn > half && bn < high) return 'teal';
        if (rn > half && rn < high && gn < low && bn > full) return 'purple';
        if (rn > full && gn < low && bn > half && bn < high) return 'rose';

        // Light colors (255, 255, 128) etc
        if (rn > full && gn > full && bn > half && bn < high) return 'light-yellow';
        if (rn > full && bn > full && gn > half && gn < high) return 'light-magenta';
        if (gn > full && bn > full && rn > half && rn < high) return 'light-cyan';

        // Not a beautiful pure color
        return 'mixed';
    }

    // Calculate dot product between two color vectors
    colorDotProduct(rgb1, rgb2) {
        // Normalize vectors
        const len1 = Math.sqrt(rgb1[0]*rgb1[0] + rgb1[1]*rgb1[1] + rgb1[2]*rgb1[2]);
        const len2 = Math.sqrt(rgb2[0]*rgb2[0] + rgb2[1]*rgb2[1] + rgb2[2]*rgb2[2]);
        if (len1 === 0 || len2 === 0) return 0;

        const dot = rgb1[0]*rgb2[0] + rgb1[1]*rgb2[1] + rgb1[2]*rgb2[2];
        return dot / (len1 * len2);
    }

    // Calculate beauty breakdown
    calculateBeauty() {
        const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
        const bodyPartColors = {};
        const bodyPartRGB = {};
        const bodyPartGradientRGB = {}; // Store start and end separately for gradients
        const beautyTraits = [];
        let beautyScore = 0;

        // Track per-part contributions
        const partContributions = {};
        for (const bp of bodyParts) {
            partContributions[bp] = 0;
        }

        // Get colors for each body part
        for (const bodyPart of bodyParts) {
            const colorData = this.calculateBodyPartColor(bodyPart);
            if (colorData.isGradient) {
                // Extract RGB from gradient colors
                const startMatch = colorData.startColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                const endMatch = colorData.endColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (startMatch && endMatch) {
                    const startColor = this.classifyColor(+startMatch[1], +startMatch[2], +startMatch[3]);
                    const endColor = this.classifyColor(+endMatch[1], +endMatch[2], +endMatch[3]);
                    bodyPartColors[bodyPart] = {
                        type: 'gradient',
                        startColor,
                        endColor,
                        displayColor: `${startColor}→${endColor}`
                    };
                    // Store average RGB for backward compatibility
                    bodyPartRGB[bodyPart] = [
                        (+startMatch[1] + +endMatch[1]) / 2,
                        (+startMatch[2] + +endMatch[2]) / 2,
                        (+startMatch[3] + +endMatch[3]) / 2
                    ];
                    // Store start and end separately
                    bodyPartGradientRGB[bodyPart] = {
                        start: [+startMatch[1], +startMatch[2], +startMatch[3]],
                        end: [+endMatch[1], +endMatch[2], +endMatch[3]]
                    };
                }
            } else {
                // Extract RGB from solid color
                const match = colorData.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (match) {
                    const color = this.classifyColor(+match[1], +match[2], +match[3]);
                    bodyPartColors[bodyPart] = {
                        type: 'solid',
                        color,
                        displayColor: color
                    };
                    bodyPartRGB[bodyPart] = [+match[1], +match[2], +match[3]];
                }
            }
        }

        // Check for beautiful gradients (different colors)
        for (const bodyPart of bodyParts) {
            const partColor = bodyPartColors[bodyPart];
            if (partColor && partColor.type === 'gradient') {
                if (partColor.startColor !== 'mixed' && partColor.endColor !== 'mixed') {
                    if (partColor.startColor !== partColor.endColor) {
                        beautyScore += 10;
                        partContributions[bodyPart] += 10;
                        beautyTraits.push(`Beautiful gradient: ${bodyPart} (+10)`);
                    } else {
                        beautyTraits.push(`Same-color gradient: ${bodyPart} (0)`);
                    }
                } else {
                    beautyTraits.push(`Mixed gradient: ${bodyPart} (0)`);
                }
            }
        }

        // Check for beautiful solid colors
        const solidParts = bodyParts.filter(bp => bodyPartColors[bp]?.type === 'solid');
        const beautifulSolidColors = solidParts.filter(bp => bodyPartColors[bp].color !== 'mixed');

        for (const part of beautifulSolidColors) {
            beautyScore += 3;
            partContributions[part] += 3;
            beautyTraits.push(`Beautiful color: ${part} (+3)`);
        }

        // Check for diversity (different beautiful colors)
        const uniqueBeautifulColors = new Set();
        for (const part of beautifulSolidColors) {
            uniqueBeautifulColors.add(bodyPartColors[part].color);
        }

        if (uniqueBeautifulColors.size >= 3) {
            beautyScore += 15;
            // Split diversity bonus among all beautiful solid colors
            const perPartBonus = 15 / beautifulSolidColors.length;
            for (const part of beautifulSolidColors) {
                partContributions[part] += perPartBonus;
            }
            beautyTraits.push(`Color diversity: ${uniqueBeautifulColors.size} different colors (+${15})`);
        } else if (uniqueBeautifulColors.size === 2) {
            beautyScore += 8;
            // Split diversity bonus among all beautiful solid colors
            const perPartBonus = 8 / beautifulSolidColors.length;
            for (const part of beautifulSolidColors) {
                partContributions[part] += perPartBonus;
            }
            beautyTraits.push(`Some diversity: ${uniqueBeautifulColors.size} colors (+${8})`);
        }

        // Pairwise color comparisons with gradient support
        for (let i = 0; i < bodyParts.length; i++) {
            for (let j = i + 1; j < bodyParts.length; j++) {
                const part1 = bodyParts[i];
                const part2 = bodyParts[j];
                const color1 = bodyPartColors[part1];
                const color2 = bodyPartColors[part2];

                if (!color1 || !color2) continue;

                const isGradient1 = color1.type === 'gradient';
                const isGradient2 = color2.type === 'gradient';

                if (isGradient1 && isGradient2) {
                    // Both gradients: compare all 4 colors (2 start, 2 end)
                    const grad1 = bodyPartGradientRGB[part1];
                    const grad2 = bodyPartGradientRGB[part2];

                    const comparisons = [
                        { rgb1: grad1.start, rgb2: grad2.start, label: 'start-start' },
                        { rgb1: grad1.start, rgb2: grad2.end, label: 'start-end' },
                        { rgb1: grad1.end, rgb2: grad2.start, label: 'end-start' },
                        { rgb1: grad1.end, rgb2: grad2.end, label: 'end-end' }
                    ];

                    let totalBonus = 0;
                    let comparisonDetails = [];

                    for (const comp of comparisons) {
                        const dotProduct = this.colorDotProduct(comp.rgb1, comp.rgb2);
                        let bonus = 0;
                        let label = '';

                        if (dotProduct < -0.7) {
                            bonus = 18;
                            label = 'complementary';
                        } else if (Math.abs(dotProduct) < 0.3) {
                            bonus = 12;
                            label = 'contrasting';
                        } else if (Math.abs(dotProduct) > 0.3 && Math.abs(dotProduct) < 0.7) {
                            bonus = 5;
                            label = 'varied';
                        } else if (dotProduct > 0.9) {
                            bonus = -3;
                            label = 'similar';
                        }

                        totalBonus += bonus;
                        if (bonus !== 0) {
                            comparisonDetails.push(`${comp.label}:${label}(${bonus >= 0 ? '+' : ''}${bonus})`);
                        }
                    }

                    // Weight gradient-gradient comparisons at 0.5x
                    const weightedBonus = totalBonus * 0.5;
                    beautyScore += weightedBonus;

                    // Split between both parts
                    const perPart = weightedBonus / 2;
                    partContributions[part1] += perPart;
                    partContributions[part2] += perPart;

                    if (comparisonDetails.length > 0) {
                        beautyTraits.push(`Gradient pair: ${part1} ⟷ ${part2} (${comparisonDetails.join(', ')}) = ${perPart >= 0 ? '+' : ''}${perPart.toFixed(1)} each`);
                    }

                } else if (isGradient1 || isGradient2) {
                    // One gradient, one solid: compare solid with both gradient colors
                    const gradPart = isGradient1 ? part1 : part2;
                    const solidPart = isGradient1 ? part2 : part1;
                    const grad = bodyPartGradientRGB[gradPart];
                    const solid = bodyPartRGB[solidPart];

                    const comparisons = [
                        { rgb1: solid, rgb2: grad.start, label: 'vs-start' },
                        { rgb1: solid, rgb2: grad.end, label: 'vs-end' }
                    ];

                    let totalBonus = 0;
                    let comparisonDetails = [];

                    for (const comp of comparisons) {
                        const dotProduct = this.colorDotProduct(comp.rgb1, comp.rgb2);
                        let bonus = 0;
                        let label = '';

                        if (dotProduct < -0.7) {
                            bonus = 18;
                            label = 'complementary';
                        } else if (Math.abs(dotProduct) < 0.3) {
                            bonus = 12;
                            label = 'contrasting';
                        } else if (Math.abs(dotProduct) > 0.3 && Math.abs(dotProduct) < 0.7) {
                            bonus = 5;
                            label = 'varied';
                        } else if (dotProduct > 0.9) {
                            bonus = -3;
                            label = 'similar';
                        }

                        totalBonus += bonus;
                        if (bonus !== 0) {
                            comparisonDetails.push(`${comp.label}:${label}(${bonus >= 0 ? '+' : ''}${bonus})`);
                        }
                    }

                    // Weight gradient-solid comparisons at 0.75x
                    const weightedBonus = totalBonus * 0.75;
                    beautyScore += weightedBonus;

                    // Split between both parts
                    const perPart = weightedBonus / 2;
                    partContributions[part1] += perPart;
                    partContributions[part2] += perPart;

                    if (comparisonDetails.length > 0) {
                        beautyTraits.push(`Mixed pair: ${part1} ⟷ ${part2} (${comparisonDetails.join(', ')}) = ${perPart >= 0 ? '+' : ''}${perPart.toFixed(1)} each`);
                    }

                } else {
                    // Both solid colors: standard comparison
                    const rgb1 = bodyPartRGB[part1];
                    const rgb2 = bodyPartRGB[part2];
                    const dotProduct = this.colorDotProduct(rgb1, rgb2);

                    let bonus = 0;
                    let label = '';

                    if (dotProduct > 0.9) {
                        bonus = -3;
                        label = 'Similar';
                        beautyScore += bonus;
                        partContributions[part1] -= 1.5;
                        partContributions[part2] -= 1.5;
                        beautyTraits.push(`${label}: ${part1} & ${part2} (-1.5 each)`);
                    } else if (Math.abs(dotProduct) < 0.3) {
                        bonus = 12;
                        label = 'Contrasting';
                        beautyScore += bonus;
                        partContributions[part1] += 6;
                        partContributions[part2] += 6;
                        beautyTraits.push(`${label}: ${part1} & ${part2} (+6 each)`);
                    } else if (dotProduct < -0.7) {
                        bonus = 18;
                        label = 'Complementary';
                        beautyScore += bonus;
                        partContributions[part1] += 9;
                        partContributions[part2] += 9;
                        beautyTraits.push(`${label}: ${part1} & ${part2} (+9 each)`);
                    } else if (Math.abs(dotProduct) > 0.3 && Math.abs(dotProduct) < 0.7) {
                        bonus = 5;
                        label = 'Varied';
                        beautyScore += bonus;
                        partContributions[part1] += 2.5;
                        partContributions[part2] += 2.5;
                        beautyTraits.push(`${label}: ${part1} & ${part2} (+2.5 each)`);
                    }
                }
            }
        }

        return {
            score: Math.max(0, beautyScore),
            maxScore: 200, // Increased to reflect gradient potential
            traits: beautyTraits,
            bodyPartColors,
            partContributions
        };
    }
}
