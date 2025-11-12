// ChromaWing Breeding Simulator - RGB Genetics v2.1
// Game State
let parrots = [];
let storeParrots = [];
let selectedParrotId = null;  // Single selected parrot for viewing
let breedingPair = { left: null, right: null };  // Breeding pair
let currentTab = 'collection';
let coins = 500;
let parrotIdCounter = 0;
let generation = 1;
let svgCache = null;
let gradientIdCounter = 0;
let examinedParrots = new Set();  // Track which parrots have been examined in laboratory

// Contest State
let contestProgress = {};  // Track which tiers each parrot has completed: {parrotId: {tierIndex: {placed, coins, badge}}}
let parrotTrophies = {};  // Track trophies per parrot: {parrotId: ['bronze', 'silver', 'gold']}

// Contest Tiers
const CONTEST_TIERS = [
    {
        name: '🎨 Beginner Beauty Show',
        description: 'A friendly local competition for budding beauties',
        entryCost: 50,
        minBeautyRange: [40, 60],
        rewards: { 1: {coins: 150, badge: '🥇'}, 2: {coins: 100, badge: '🥈'}, 3: {coins: 75, badge: '🥉'} },
        specialRules: null,
        unlocked: true
    },
    {
        name: '🌈 Rainbow Showcase',
        description: 'Celebrate diversity with colorful plumage',
        entryCost: 100,
        minBeautyRange: [70, 90],
        rewards: { 1: {coins: 300, badge: '🥇'}, 2: {coins: 200, badge: '🥈'}, 3: {coins: 150, badge: '🥉'} },
        specialRules: {
            type: 'minColors',
            description: 'Must have at least 3 different beautiful colors',
            validator: (parrot) => {
                const beauty = parrot.calculateBeauty();
                const solidParts = Object.keys(beauty.bodyPartColors).filter(bp => beauty.bodyPartColors[bp]?.type === 'solid');
                const colors = new Set(solidParts.map(bp => beauty.bodyPartColors[bp].color).filter(c => c !== 'mixed'));
                return colors.size >= 3;
            }
        },
        unlocked: false
    },
    {
        name: '✨ Gradient Masters',
        description: 'Where smooth transitions steal the show',
        entryCost: 200,
        minBeautyRange: [100, 130],
        rewards: { 1: {coins: 500, badge: '🥇'}, 2: {coins: 350, badge: '🥈'}, 3: {coins: 250, badge: '🥉'} },
        specialRules: {
            type: 'minGradients',
            description: 'Must have at least 2 beautiful gradients',
            validator: (parrot) => {
                return Object.values(parrot.genes).filter(part => part.gradient).length >= 2;
            }
        },
        unlocked: false
    },
    {
        name: '🎭 Contrast Championship',
        description: 'Bold opposites make stunning statements',
        entryCost: 300,
        minBeautyRange: [130, 160],
        rewards: { 1: {coins: 750, badge: '🥇'}, 2: {coins: 500, badge: '🥈'}, 3: {coins: 350, badge: '🥉'} },
        specialRules: {
            type: 'complementary',
            description: 'Must have at least one complementary color pair',
            validator: (parrot) => {
                const beauty = parrot.calculateBeauty();
                return beauty.traits.some(t => t.includes('Complementary') || t.includes('complementary'));
            }
        },
        unlocked: false
    },
    {
        name: '👑 Elite Grand Prix',
        description: 'The ultimate test of chromatic perfection',
        entryCost: 500,
        minBeautyRange: [180, 220],
        rewards: { 1: {coins: 1500, badge: '🥇'}, 2: {coins: 1000, badge: '🥈'}, 3: {coins: 750, badge: '🥉'} },
        specialRules: {
            type: 'all',
            description: 'Must have gradients AND complementary colors',
            validator: (parrot) => {
                const hasGradients = Object.values(parrot.genes).filter(part => part.gradient).length >= 2;
                const beauty = parrot.calculateBeauty();
                const hasComplementary = beauty.traits.some(t => t.includes('Complementary') || t.includes('complementary'));
                return hasGradients && hasComplementary;
            }
        },
        unlocked: false
    }
];

// Parrot name pool
const PARROT_NAMES = [
    'Aurora', 'Blaze', 'Crystal', 'Dazzle', 'Echo', 'Flame', 'Glimmer', 'Horizon',
    'Iris', 'Jewel', 'Kaleidoscope', 'Luna', 'Mystic', 'Nova', 'Opal', 'Phoenix',
    'Quest', 'Rainbow', 'Starlight', 'Twilight', 'Unity', 'Vortex', 'Whisper', 'Xenon',
    'Yonder', 'Zenith', 'Azure', 'Breeze', 'Cascade', 'Dawn', 'Ember', 'Frost',
    'Galaxy', 'Haven', 'Indigo', 'Jasper', 'Karma', 'Luxe', 'Midnight', 'Nebula',
    'Oracle', 'Prism', 'Quartz', 'Radiance', 'Solstice', 'Thunder', 'Umbra', 'Velvet',
    'Wonder', 'Xanthe', 'Yarrow', 'Zephyr'
];
let usedNames = new Set();

function getRandomName() {
    const availableNames = PARROT_NAMES.filter(name => !usedNames.has(name));
    if (availableNames.length === 0) {
        usedNames.clear();
        return PARROT_NAMES[Math.floor(Math.random() * PARROT_NAMES.length)];
    }
    const name = availableNames[Math.floor(Math.random() * availableNames.length)];
    usedNames.add(name);
    return name;
}

// Parrot Class with RGB Genetics v2.1
// 78 genes: 6 body parts × 13 genes each
class Parrot {
    constructor(name, genes, generation = 1, id = null) {
        this.id = id !== null ? id : parrotIdCounter++;
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
        const baseValue = 50 + Math.floor(score * 2) + (this.generation * 10);
        const rarity = this.calculateRarity();
        const rarityMultipliers = {
            'common': 1.0,
            'uncommon': 1.3,
            'rare': 1.6,
            'epic': 2.0,
            'legendary': 2.5
        };

        return Math.floor(baseValue * rarityMultipliers[rarity]);
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

// Create random genes for a body part
function randomBodyPartGenes() {
    return {
        red: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        green: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        blue: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        gradient: false
    };
}

function randomBoolean() {
    return Math.random() < 0.5;
}

// Load SVG template
async function loadSVGTemplate() {
    if (svgCache) return svgCache;

    try {
        const response = await fetch('Parrot-1-recolored.svg');
        const svgText = await response.text();
        svgCache = svgText;
        return svgText;
    } catch (error) {
        console.error('Failed to load SVG:', error);
        return null;
    }
}

// Generate colored SVG for parrot
async function generateParrotSVG(parrot) {
    const template = await loadSVGTemplate();
    if (!template) return '<div>Error loading parrot</div>';

    let svg = template;

    // Fixed colors for non-genetic elements
    const GROUND_COLOR = '#8B7355';
    const SKY_COLOR = '#87CEEB';
    const EYE_BLACK = '#000000';     // body-yellow-4 (black pupil)
    const EYE_WHITE = '#FFFFFF';     // accent-white-4 (white of eye)
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
            const id = `grad-${partName}-${gradientIdCounter++}`;
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
        'wings': ['wing-blue'],              // Most wing feathers
        'special_wing': [],                   // wing-blue-1 and wing-blue-4 (handled separately)
        'body': ['body-yellow'],              // Main body feathers
        'head': ['accent-blue'],              // Head/crest area
        'tail': ['accent-green', 'accent-white'],  // Tail feathers (excluding sky)
        'accents': ['accent-brown']           // Shoulders/back accents
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
        'body-yellow-4': EYE_BLACK,      // Black pupil
        'accent-white-4': EYE_WHITE,     // White of eye

        // Beak (detail-gray 1, 2, 3 - ALL beak parts, not genetic)
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

// Initialize game
async function initGame() {
    // Create 2 predefined beautiful parrots - 1 in collection, 1 in store
    parrots = [
        // Predefined 1: Blue gradient wings, orange body - In collection
        new Parrot('Twilight', {
            wings: {
                red: [false, false, true, true],
                green: [false, false, false, false],
                blue: [true, true, true, true],
                gradient: true
            },
            special_wing: {
                red: [true, true, true, true],
                green: [true, false, false, false],
                blue: [false, false, false, false],
                gradient: false
            },
            body: {
                red: [true, true, true, true],
                green: [true, true, false, false],
                blue: [false, false, false, false],
                gradient: false
            },
            head: {
                red: [true, true, true, false],
                green: [true, true, true, false],
                blue: [false, false, false, false],
                gradient: false
            },
            tail: {
                red: [false, false, true, true],
                green: [true, true, true, true],
                blue: [false, false, true, true],
                gradient: true
            },
            accents: {
                red: [true, false, true, false],
                green: [false, false, true, true],
                blue: [true, true, false, false],
                gradient: false
            }
        }, 1)
    ];

    parrotIdCounter = parrots.length;

    // Store the second predefined parrot to move to store
    const prismParrot = new Parrot('Prism', {
        wings: {
            red: [true, true, false, false],
            green: [false, false, true, true],
            blue: [true, true, true, true],
            gradient: true
        },
        special_wing: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [true, true, true, true],
            gradient: false
        },
        body: {
            red: [true, true, true, true],
            green: [true, true, true, false],
            blue: [false, false, false, false],
            gradient: false
        },
        head: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [true, true, true, true],
            gradient: false
        },
        tail: {
            red: [true, true, true, true],
            green: [true, true, false, false],
            blue: [false, false, true, true],
            gradient: true
        },
        accents: {
            red: [true, true, true, false],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: false
        }
    }, 1);

    parrotIdCounter++;

    await generateStore(prismParrot);
    await updateUI();
}

// Helper: Create parrot with specific gene purity
function createParrotWithPurity(targetPurity) {
    // targetPurity: 'high' = 80% pure genes, 'medium' = 50%, 'low' = 20%, 'random' = random
    const genes = {
        wings: null,
        special_wing: null,
        body: null,
        head: null,
        tail: null,
        accents: null
    };

    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    for (const part of bodyParts) {
        const partGenes = {
            red: [],
            green: [],
            blue: [],
            gradient: false
        };

        // Generate each color channel based on purity
        for (const color of ['red', 'green', 'blue']) {
            let alleles;
            if (targetPurity === 'high') {
                // 80% chance of pure (0000 or 1111)
                if (Math.random() < 0.8) {
                    const val = Math.random() < 0.5;
                    alleles = [val, val, val, val];
                } else {
                    // Nearly pure (0001 or 1110)
                    const base = Math.random() < 0.5;
                    alleles = [base, base, base, !base];
                }
            } else if (targetPurity === 'medium') {
                // 50% pure, 50% mixed
                if (Math.random() < 0.5) {
                    const val = Math.random() < 0.5;
                    alleles = [val, val, val, val];
                } else {
                    alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
                }
            } else if (targetPurity === 'low') {
                // Mostly mixed
                alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
            } else {
                // Random
                alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
            }
            partGenes[color] = alleles;
        }

        genes[part] = partGenes;
    }

    return genes;
}

// Generate random parrots for store
async function generateStore(prismParrot = null) {
    storeParrots = [];

    // Add Prism parrot if provided (legendary parrot with gradients)
    if (prismParrot) {
        storeParrots.push(prismParrot);
    }

    // TEST: Add max rarity parrot (all pure genes, all gradients)
    const maxRarityParrot = new Parrot('[TEST-MAX-RARITY]', {
        wings: {
            red: [true, true, true, true],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        special_wing: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [true, true, true, true],
            gradient: true
        },
        body: {
            red: [true, true, true, true],
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: true
        },
        head: {
            red: [true, true, true, true],
            green: [false, false, false, false],
            blue: [false, false, false, false],
            gradient: true
        },
        tail: {
            red: [false, false, false, false],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        accents: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: true
        }
    }, 1);
    storeParrots.push(maxRarityParrot);

    // TEST: Add max beauty parrot (complementary colors: red, cyan, yellow, blue, green, magenta)
    const maxBeautyParrot = new Parrot('[TEST-MAX-BEAUTY]', {
        wings: {
            red: [true, true, true, true],  // Red (255, 0, 0)
            green: [false, false, false, false],
            blue: [false, false, false, false],
            gradient: false
        },
        special_wing: {
            red: [false, false, false, false],  // Cyan (0, 255, 255)
            green: [true, true, true, true],
            blue: [true, true, true, true],
            gradient: false
        },
        body: {
            red: [true, true, true, true],  // Yellow (255, 255, 0)
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: false
        },
        head: {
            red: [false, false, false, false],  // Blue (0, 0, 255)
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: false
        },
        tail: {
            red: [false, false, false, false],  // Green (0, 255, 0)
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: false
        },
        accents: {
            red: [true, true, true, true],  // Magenta (255, 0, 255)
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: false
        }
    }, 1);
    storeParrots.push(maxBeautyParrot);

    // TEST: Add max gradient beauty parrot (6 beautiful gradients with complementary averages)
    const maxGradientParrot = new Parrot('[TEST-MAX-GRADIENT]', {
        wings: {
            // Red→Yellow: (255,0,0)→(255,255,0), avg (255,127.5,0) orange
            red: [true, true, true, true],
            green: [false, false, true, true],
            blue: [false, false, false, false],
            gradient: true
        },
        special_wing: {
            // Green→Cyan: (0,255,0)→(0,255,255), avg (0,255,127.5) cyan-green
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [false, false, true, true],
            gradient: true
        },
        body: {
            // Blue→Magenta: (0,0,255)→(255,0,255), avg (127.5,0,255) purple
            red: [false, false, true, true],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        head: {
            // Yellow→Green: (255,255,0)→(0,255,0), avg (127.5,255,0) lime
            red: [true, true, false, false],
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: true
        },
        tail: {
            // Cyan→Blue: (0,255,255)→(0,0,255), avg (0,127.5,255) sky
            red: [false, false, false, false],
            green: [true, true, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        accents: {
            // Magenta→Red: (255,0,255)→(255,0,0), avg (255,0,127.5) rose
            red: [true, true, true, true],
            green: [false, false, false, false],
            blue: [true, true, false, false],
            gradient: true
        }
    }, 1);
    storeParrots.push(maxGradientParrot);

    // Generate store parrots with diverse rarities
    // Target: 1-2 legendary, 1 epic, 1 rare, 1 uncommon, 1-2 common
    const targetRarities = ['legendary', 'legendary', 'epic', 'rare', 'uncommon', 'common'];

    for (const targetRarity of targetRarities) {
        let parrot = null;
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            attempts++;

            let genes;
            if (targetRarity === 'legendary') {
                // High purity + gradients
                genes = createParrotWithPurity('high');
                // Add gradients to 2-3 body parts
                const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
                const numGradients = 2 + Math.floor(Math.random() * 2);
                for (let j = 0; j < numGradients; j++) {
                    const part = bodyParts[Math.floor(Math.random() * bodyParts.length)];
                    genes[part].gradient = true;
                }
            } else if (targetRarity === 'epic') {
                genes = createParrotWithPurity('high');
            } else if (targetRarity === 'rare') {
                genes = createParrotWithPurity('medium');
            } else if (targetRarity === 'uncommon') {
                genes = createParrotWithPurity('low');
            } else {
                genes = createParrotWithPurity('random');
            }

            const testParrot = new Parrot(getRandomName(), genes, 1);
            const actualRarity = testParrot.calculateRarity();

            // Accept if rarity matches or we're on last attempt
            if (actualRarity === targetRarity || attempts >= maxAttempts) {
                parrot = testParrot;
                break;
            }
        }

        if (parrot) {
            storeParrots.push(parrot);
        }
    }

    // Fill remaining slots with random parrots if needed
    while (storeParrots.length < 7) {
        const parrot = new Parrot(getRandomName(), {
            wings: randomBodyPartGenes(),
            special_wing: randomBodyPartGenes(),
            body: randomBodyPartGenes(),
            head: randomBodyPartGenes(),
            tail: randomBodyPartGenes(),
            accents: randomBodyPartGenes()
        }, 1);
        storeParrots.push(parrot);
    }
}

// Switch tabs
function switchTab(tab) {
    currentTab = tab;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Hide all tabs
    document.getElementById('collectionTab').style.display = 'none';
    document.getElementById('storeTab').style.display = 'none';
    document.getElementById('contestsTab').style.display = 'none';

    if (tab === 'collection') {
        document.getElementById('collectionTab').style.display = 'grid';
        document.getElementById('panelTitle').textContent = 'Your Parrots';
    } else if (tab === 'store') {
        document.getElementById('storeTab').style.display = 'grid';
        document.getElementById('panelTitle').textContent = 'Store - Buy Parrots';
    } else if (tab === 'contests') {
        document.getElementById('contestsTab').style.display = 'block';
        document.getElementById('panelTitle').textContent = 'Beauty Contests';
        renderContestsTab();
        return; // Don't call updateUI for contests tab
    }

    selectedParrotId = null;
    updateUI();
}

// Update entire UI
async function updateUI() {
    updateStats();
    await renderParrotGrid();
    await renderBreedingSlots();
    await updatePreview();
}

// Update stats
function updateStats() {
    document.getElementById('coinsDisplay').textContent = coins;
    document.getElementById('parrotCount').textContent = parrots.length;
    document.getElementById('maxGen').textContent = generation;
}

// Render parrot grid
async function renderParrotGrid() {
    const collectionGrid = document.getElementById('collectionTab');
    const storeGrid = document.getElementById('storeTab');

    collectionGrid.innerHTML = '';
    storeGrid.innerHTML = '';

    for (const parrot of parrots) {
        const card = await createParrotCard(parrot, false);
        collectionGrid.appendChild(card);
    }

    for (const parrot of storeParrots) {
        const card = await createParrotCard(parrot, true);
        storeGrid.appendChild(card);
    }
}

// Create parrot card
async function createParrotCard(parrot, isStore) {
    const card = document.createElement('div');
    card.className = 'parrot-card';
    if (selectedParrotId === parrot.id) {
        card.classList.add('selected');
    }

    const svg = await generateParrotSVG(parrot);
    const rarity = parrot.calculateRarity();

    // Calculate price based on rarity multiplier
    const price = parrot.getValue();

    // Check if parrot is in breeding slots
    let breedingIndicator = '';
    if (breedingPair.left === parrot.id) {
        breedingIndicator = '<div class="breeding-indicator breeding-left">L</div>';
    } else if (breedingPair.right === parrot.id) {
        breedingIndicator = '<div class="breeding-indicator breeding-right">R</div>';
    }

    // Rarity colors and labels
    const rarityConfig = {
        'common': { color: '#9e9e9e', label: 'Common' },
        'uncommon': { color: '#4caf50', label: 'Uncommon' },
        'rare': { color: '#2196f3', label: 'Rare' },
        'epic': { color: '#9c27b0', label: 'Epic' },
        'legendary': { color: '#ff9800', label: 'Legendary' }
    };

    const rarityInfo = rarityConfig[rarity];

    // Calculate beauty score for display
    const beauty = parrot.calculateBeauty();
    const beautyScore = beauty.score;

    // Beauty score color coding (similar to rarity but for beauty)
    let beautyColor = '#9e9e9e'; // Default gray
    if (beautyScore >= 180) beautyColor = '#ff9800'; // Legendary gold
    else if (beautyScore >= 130) beautyColor = '#9c27b0'; // Epic purple
    else if (beautyScore >= 80) beautyColor = '#2196f3'; // Rare blue
    else if (beautyScore >= 40) beautyColor = '#4caf50'; // Uncommon green

    // Trophy/contest indicators
    let trophyIndicator = '';
    if (!isStore && parrotTrophies[parrot.id] && parrotTrophies[parrot.id].length > 0) {
        const trophies = parrotTrophies[parrot.id];
        const tierIcons = ['🎨', '🌈', '✨', '🎭', '👑'];

        trophyIndicator = '<div class="trophy-indicator">';
        trophies.forEach(trophy => {
            const tierIcon = tierIcons[trophy.tier] || '🏆';
            trophyIndicator += `<span title="Tier ${trophy.tier + 1} - ${trophy.placement}${trophy.placement === 1 ? 'st' : trophy.placement === 2 ? 'nd' : 'rd'}">${tierIcon}${trophy.badge}</span>`;
        });
        trophyIndicator += '</div>';
    }

    card.innerHTML = `
        ${isStore ? `<div class="price">${price}💰</div>` : ''}
        ${breedingIndicator}
        <div class="parrot-mini">${svg}</div>
        <div class="parrot-name">${parrot.name}</div>
        <div class="parrot-gen">Gen ${parrot.generation}</div>
        <div class="rarity-badge" style="background: ${rarityInfo.color};">${rarityInfo.label}</div>
        <div class="beauty-badge" style="background: ${beautyColor}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">Beauty: ${beautyScore}</div>
        ${parrot.hasAnyGradients() ? '<div class="gradient-indicator">✨ Gradient</div>' : ''}
        ${trophyIndicator}
    `;

    card.onclick = () => selectParrot(parrot.id);

    return card;
}

// Select parrot for viewing
function selectParrot(parrotId) {
    selectedParrotId = parrotId;
    updateUI();
}

// Add parrot to breeding slot
async function breedOnLeft(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    // Prevent selecting the same parrot in both slots
    if (breedingPair.right === parrotId) {
        return; // Silently prevent - UI already shows slots
    }

    breedingPair.left = parrotId;
    await renderBreedingSlots();
    updateBreedButton();
}

async function breedOnRight(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    // Prevent selecting the same parrot in both slots
    if (breedingPair.left === parrotId) {
        return; // Silently prevent - UI already shows slots
    }

    breedingPair.right = parrotId;
    await renderBreedingSlots();
    updateBreedButton();
}

// Remove from breeding slot
async function removeFromSlot(slot) {
    breedingPair[slot] = null;
    await renderBreedingSlots();
    updateBreedButton();
}

// Update breed button state
function updateBreedButton() {
    const btn = document.getElementById('breedButton');
    if (breedingPair.left !== null && breedingPair.right !== null) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// Render breeding slots
async function renderBreedingSlots() {
    const leftSlot = document.getElementById('breedSlotLeft');
    const rightSlot = document.getElementById('breedSlotRight');

    // Render left slot
    if (breedingPair.left !== null) {
        const parrot = parrots.find(p => p.id === breedingPair.left);
        if (parrot) {
            const svg = await generateParrotSVG(parrot);
            leftSlot.className = 'breeding-slot filled';
            leftSlot.innerHTML = `
                <div class="slot-label">Left Parent</div>
                <button class="remove-btn" onclick="removeFromSlot('left')">×</button>
                <div class="parrot-mini-breed">${svg}</div>
                <div class="parrot-name-small">${parrot.name}</div>
            `;
        }
    } else {
        leftSlot.className = 'breeding-slot';
        leftSlot.innerHTML = `
            <div class="slot-label">Left Parent</div>
            <div style="color: #ccc; font-size: 0.9em;">Empty</div>
        `;
    }

    // Render right slot
    if (breedingPair.right !== null) {
        const parrot = parrots.find(p => p.id === breedingPair.right);
        if (parrot) {
            const svg = await generateParrotSVG(parrot);
            rightSlot.className = 'breeding-slot filled';
            rightSlot.innerHTML = `
                <div class="slot-label">Right Parent</div>
                <button class="remove-btn" onclick="removeFromSlot('right')">×</button>
                <div class="parrot-mini-breed">${svg}</div>
                <div class="parrot-name-small">${parrot.name}</div>
            `;
        }
    } else {
        rightSlot.className = 'breeding-slot';
        rightSlot.innerHTML = `
            <div class="slot-label">Right Parent</div>
            <div style="color: #ccc; font-size: 0.9em;">Empty</div>
        `;
    }
}

// Update preview panel
async function updatePreview() {
    const previewDiv = document.getElementById('selectedPreview');
    const actionSection = document.getElementById('topActionSection');

    if (selectedParrotId === null) {
        previewDiv.innerHTML = '<div class="empty-preview">Click a parrot to view details</div>';
        actionSection.style.display = 'none';
        return;
    }

    // Find the parrot
    const parrot = currentTab === 'collection'
        ? parrots.find(p => p.id === selectedParrotId)
        : storeParrots.find(p => p.id === selectedParrotId);

    if (!parrot) return;

    const svg = await generateParrotSVG(parrot);
    const rarity = parrot.calculateRarity();

    // Rarity colors and labels
    const rarityConfig = {
        'common': { color: '#9e9e9e', label: 'Common' },
        'uncommon': { color: '#4caf50', label: 'Uncommon' },
        'rare': { color: '#2196f3', label: 'Rare' },
        'epic': { color: '#9c27b0', label: 'Epic' },
        'legendary': { color: '#ff9800', label: 'Legendary' }
    };

    const rarityInfo = rarityConfig[rarity];

    previewDiv.innerHTML = `
        <div class="large-parrot-display">${svg}</div>
        <div style="text-align: center; margin-bottom: 10px;">
            <strong style="font-size: 1.3em;">${parrot.name}</strong><br>
            <span style="color: #666;">Generation ${parrot.generation}</span><br>
            <span class="rarity-badge" style="background: ${rarityInfo.color}; display: inline-block; margin-top: 5px;">${rarityInfo.label}</span>
            ${parrot.hasAnyGradients() ? '<br><span style="color: #9c27b0; font-weight: bold;">✨ Has Gradients</span>' : ''}
        </div>
    `;

    // Show action buttons
    actionSection.style.display = 'block';
    const actionButtons = document.getElementById('actionButtons');

    if (currentTab === 'store') {
        const price = parrot.getValue();
        actionButtons.innerHTML = `
            <button class="btn btn-buy" onclick="buyParrot(${parrot.id})" ${coins < price ? 'disabled' : ''}>
                💰 Buy for ${price} coins
            </button>
        `;
    } else {
        const sellValue = Math.floor(parrot.getValue() * 0.7);
        actionButtons.innerHTML = `
            <button class="btn btn-breed-left" onclick="breedOnLeft(${parrot.id})">
                💕 Breed on Left
            </button>
            <button class="btn btn-breed-right" onclick="breedOnRight(${parrot.id})">
                💕 Breed on Right
            </button>
            <button class="btn btn-lab" onclick="openLaboratory(${parrot.id})">
                🔬 Examine in Laboratory
            </button>
            <button class="btn btn-contest" onclick="switchTab('contests')">
                🏆 Enter Beauty Contest
            </button>
            <button class="btn btn-sell"
                    onmousedown="startSellHold(${parrot.id})"
                    onmouseup="cancelSellHold()"
                    onmouseleave="cancelSellHold()"
                    ontouchstart="startSellHold(${parrot.id})"
                    ontouchend="cancelSellHold()"
                    ontouchcancel="cancelSellHold()">
                💰 Hold to Sell (${sellValue} coins)
            </button>
            <button class="btn btn-free" onclick="freeParrot(${parrot.id})">
                🕊️ Release to Wild
            </button>
        `;
    }
}

// Perform laboratory examination (after payment)
async function performExamination(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    coins -= 100;
    examinedParrots.add(parrotId);
    updateStats();
    saveGame();

    // Show info toast
    showToast(
        `Laboratory analysis complete`,
        `${parrot.name} examined • -100 coins`,
        'info'
    );

    // Re-render the laboratory with full analysis
    openLaboratory(parrotId);
}

// Open Laboratory Modal
async function openLaboratory(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const modal = document.getElementById('laboratoryModal');
    const display = document.getElementById('laboratoryDisplay');

    // Check if parrot has been examined before
    const hasBeenExamined = examinedParrots.has(parrotId);
    const examCost = 100;

    if (!hasBeenExamined) {
        // Show payment screen
        const svg = await generateParrotSVG(parrot);
        display.innerHTML = `
            <h3>🔬 Laboratory Analysis: ${parrot.name}</h3>
            <p style="color: #666; margin-bottom: 20px;">Generation ${parrot.generation}</p>

            <div style="text-align: center; margin: 30px 0;">
                <div style="width: 300px; height: 300px; margin: 0 auto; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    ${svg}
                </div>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0;">🔬 Detailed Genetic Analysis Available</h4>
                <p style="margin: 0;">Unlock comprehensive analysis including:</p>
                <ul style="margin: 10px 0;">
                    <li>78 Gene Breakdown (6 body parts × 13 genes)</li>
                    <li>Rarity Analysis with detailed scoring</li>
                    <li>Beauty Assessment with color harmony</li>
                    <li>RGB values for each body part</li>
                </ul>
                <p style="margin: 10px 0 0 0; font-weight: bold; color: #ff6b00;">Cost: ${examCost} coins (one-time fee per parrot)</p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-lab" onclick="performExamination(${parrotId})" ${coins < examCost ? 'disabled' : ''} style="font-size: 1.1em; padding: 15px 30px;">
                    ${coins < examCost ? '❌ Not Enough Coins' : `💰 Pay ${examCost} Coins & Examine`}
                </button>
                ${coins < examCost ? `<p style="color: #dc3545; margin-top: 10px;">You need ${examCost - coins} more coins</p>` : ''}
            </div>
        `;
        modal.classList.add('active');
        return;
    }

    // Show full analysis for examined parrot

    const bodyPartNames = {
        'wings': '🪽 Wings',
        'special_wing': '✨ Special Wing (wing-blue-1, 4)',
        'body': '🦜 Body',
        'head': '👑 Head',
        'tail': '🎨 Tail',
        'accents': '💎 Accents'
    };

    // Calculate rarity breakdown
    let totalRareTraits = 0;
    const maxTraits = 60; // Absolute maximum: 6 parts × (6 color points + 4 gradient points)
    let rarityBreakdown = [];

    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        const part = parrot.genes[bodyPart];
        const redCount = parrot.countDominant(part.red);
        const greenCount = parrot.countDominant(part.green);
        const blueCount = parrot.countDominant(part.blue);

        const redRarity = redCount === 0 || redCount === 4 ? 2 : (redCount === 1 || redCount === 3 ? 1 : 0);
        const greenRarity = greenCount === 0 || greenCount === 4 ? 2 : (greenCount === 1 || greenCount === 3 ? 1 : 0);
        const blueRarity = blueCount === 0 || blueCount === 4 ? 2 : (blueCount === 1 || blueCount === 3 ? 1 : 0);

        let partRarity = redRarity + greenRarity + blueRarity;
        const hasGradient = part.gradient;
        if (hasGradient) partRarity += 4;

        totalRareTraits += partRarity;

        rarityBreakdown.push({
            name: bodyPartNames[bodyPart],
            points: partRarity,
            maxPoints: hasGradient ? 10 : 6,
            hasGradient
        });
    }

    const rarityRatio = totalRareTraits / maxTraits;
    const rarity = parrot.calculateRarity();

    const rarityConfig = {
        'common': { color: '#9e9e9e', label: 'Common' },
        'uncommon': { color: '#4caf50', label: 'Uncommon' },
        'rare': { color: '#2196f3', label: 'Rare' },
        'epic': { color: '#9c27b0', label: 'Epic' },
        'legendary': { color: '#ff9800', label: 'Legendary' }
    };

    const rarityInfo = rarityConfig[rarity];

    let html = `<h3>🔬 Laboratory Analysis: ${parrot.name}</h3>`;
    html += `<p style="color: #666; margin-bottom: 20px;">Generation ${parrot.generation} • Total: 78 Genes (6 body parts × 13 genes each)</p>`;

    // Rarity Summary Section
    html += `<div class="body-part-genes" style="background: linear-gradient(135deg, ${rarityInfo.color}22, ${rarityInfo.color}11); border-color: ${rarityInfo.color};">`;
    html += `<h4>📊 Rarity Analysis <span class="rarity-badge" style="background: ${rarityInfo.color}; margin-left: 10px;">${rarityInfo.label}</span></h4>`;
    html += `<div class="gene-row">`;
    html += `<div class="gene-label">Rarity Score</div>`;
    html += `<div style="font-weight: bold; color: ${rarityInfo.color};">${totalRareTraits} / ${maxTraits} points (${(rarityRatio * 100).toFixed(1)}%)</div>`;
    html += `</div>`;

    // Breakdown by body part
    html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">Points by Body Part:</div>`;
    for (const part of rarityBreakdown) {
        const percentage = (part.points / part.maxPoints) * 100;
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">`;
        html += `<span>${part.name}</span>`;
        html += `<span style="color: ${rarityInfo.color};">${part.points}/${part.maxPoints} ${part.hasGradient ? '✨' : ''}</span>`;
        html += `</div>`;
    }
    html += `</div>`;

    html += `<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; font-size: 0.85em;">`;
    html += `<strong>Rarity Guide:</strong><br>`;
    html += `• Pure (0 or 4 dominant): 2 pts per color<br>`;
    html += `• Nearly Pure (1 or 3): 1 pt per color<br>`;
    html += `• Mixed (2 dominant): 0 pts<br>`;
    html += `• Gradient: +4 pts (very rare!)`;
    html += `</div>`;

    html += `</div>`;

    // Beauty Analysis Section
    const beautyData = parrot.calculateBeauty();
    const beautyPercent = (beautyData.score / beautyData.maxScore) * 100;
    let beautyColor = '#9e9e9e';
    let beautyLabel = 'Plain';
    if (beautyPercent >= 70) {
        beautyColor = '#ff69b4';
        beautyLabel = 'Stunning';
    } else if (beautyPercent >= 50) {
        beautyColor = '#ff1493';
        beautyLabel = 'Beautiful';
    } else if (beautyPercent >= 30) {
        beautyColor = '#dda0dd';
        beautyLabel = 'Pretty';
    } else if (beautyPercent >= 15) {
        beautyColor = '#d8bfd8';
        beautyLabel = 'Decent';
    }

    html += `<div class="body-part-genes" style="background: linear-gradient(135deg, ${beautyColor}22, ${beautyColor}11); border-color: ${beautyColor};">`;
    html += `<h4>🌸 Beauty Analysis <span class="rarity-badge" style="background: ${beautyColor}; margin-left: 10px;">${beautyLabel}</span></h4>`;
    html += `<div class="gene-row">`;
    html += `<div class="gene-label">Beauty Score</div>`;
    html += `<div style="font-weight: bold; color: ${beautyColor};">${beautyData.score} / ${beautyData.maxScore} points (${beautyPercent.toFixed(1)}%)</div>`;
    html += `</div>`;

    // Color classifications
    html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">Body Part Colors:</div>`;
    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        if (beautyData.bodyPartColors[bodyPart]) {
            const partColor = beautyData.bodyPartColors[bodyPart];
            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">`;
            html += `<span>${bodyPartNames[bodyPart]}</span>`;
            html += `<span style="color: ${beautyColor}; font-weight: 600;">${partColor.displayColor}</span>`;
            html += `</div>`;
        }
    }
    html += `</div>`;

    // Per-part contributions
    html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">Beauty Contribution by Part:</div>`;
    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        const contribution = beautyData.partContributions[bodyPart];
        const displayValue = contribution >= 0 ? `+${contribution.toFixed(1)}` : contribution.toFixed(1);
        const color = contribution > 0 ? beautyColor : (contribution < 0 ? '#dc3545' : '#999');
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">`;
        html += `<span>${bodyPartNames[bodyPart]}</span>`;
        html += `<span style="color: ${color}; font-weight: 600;">${displayValue} pts</span>`;
        html += `</div>`;
    }
    html += `</div>`;

    // Beauty traits
    if (beautyData.traits.length > 0) {
        html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
        html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">Beauty Traits:</div>`;
        for (const trait of beautyData.traits) {
            const isPositive = trait.includes('+');
            const isNegative = trait.includes('-');
            const icon = isPositive ? '✨' : (isNegative ? '❌' : '⚪');
            html += `<div style="margin-bottom: 3px;">${icon} ${trait}</div>`;
        }
        html += `</div>`;
    }

    html += `<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; font-size: 0.85em;">`;
    html += `<strong>Beauty Guide:</strong><br>`;
    html += `• Beautiful colors: red, green, blue, yellow, cyan, magenta, orange, and variations<br>`;
    html += `• Also beautiful: half-intensity (dark-red, dark-green, dark-blue) and mixed (lime, amber, sky, teal, purple, rose, light variants)<br>`;
    html += `• Different color gradients: +10 pts<br>`;
    html += `• Each beautiful solid color: +3 pts<br>`;
    html += `• Color diversity (3+ colors): +15 pts<br>`;
    html += `• Complementary colors (opposite, dot < -0.7): +18 pts<br>`;
    html += `• Contrasting colors (orthogonal, |dot| < 0.3): +12 pts<br>`;
    html += `• Different colors (varied, 0.3 < |dot| < 0.7): +5 pts<br>`;
    html += `• Similar colors (dot > 0.9): -3 pts penalty`;
    html += `</div>`;

    html += `</div>`;

    // Body part genes sections
    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        const part = parrot.genes[bodyPart];
        const colorData = parrot.calculateBodyPartColor(bodyPart);

        html += `<div class="body-part-genes">`;
        html += `<h4>${bodyPartNames[bodyPart]}`;
        if (part.gradient) {
            html += ` <span class="gradient-badge">GRADIENT</span>`;
        }
        html += `</h4>`;

        // Red genes
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">Red (4)</div>`;
        html += `<div class="gene-alleles">`;
        part.red.forEach((allele, i) => {
            html += `<span class="allele ${allele ? 'dominant' : 'recessive'}">${allele ? 'R' : 'r'}${i+1}</span>`;
        });
        const redValue = parrot.calculateRGBValue(part.red);
        html += ` = ${redValue}/255`;
        html += `</div>`;
        html += `</div>`;

        // Green genes
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">Green (4)</div>`;
        html += `<div class="gene-alleles">`;
        part.green.forEach((allele, i) => {
            html += `<span class="allele ${allele ? 'dominant' : 'recessive'}">${allele ? 'G' : 'g'}${i+1}</span>`;
        });
        const greenValue = parrot.calculateRGBValue(part.green);
        html += ` = ${greenValue}/255`;
        html += `</div>`;
        html += `</div>`;

        // Blue genes
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">Blue (4)</div>`;
        html += `<div class="gene-alleles">`;
        part.blue.forEach((allele, i) => {
            html += `<span class="allele ${allele ? 'dominant' : 'recessive'}">${allele ? 'B' : 'b'}${i+1}</span>`;
        });
        const blueValue = parrot.calculateRGBValue(part.blue);
        html += ` = ${blueValue}/255`;
        html += `</div>`;
        html += `</div>`;

        // Gradient gene
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">Gradient (1)</div>`;
        html += `<div class="gene-alleles">`;
        html += `<span class="allele ${part.gradient ? 'dominant' : 'recessive'}">${part.gradient ? 'GRAD' : 'grad'}</span>`;
        html += `</div>`;
        html += `</div>`;

        // Color preview
        html += `<div class="gene-row" style="margin-top: 10px;">`;
        html += `<div class="gene-label">Result</div>`;
        html += `<div>`;
        if (colorData.isGradient) {
            html += `<span class="color-preview" style="background: linear-gradient(90deg, ${colorData.startColor}, ${colorData.endColor});"></span>`;
            html += ` Gradient: ${colorData.startColor} → ${colorData.endColor}`;
        } else {
            html += `<span class="color-preview" style="background: ${colorData.color};"></span>`;
            html += ` Solid: ${colorData.color}`;
        }
        html += `</div>`;
        html += `</div>`;

        html += `</div>`;
    }

    display.innerHTML = html;
    modal.classList.add('active');
}

// Buy parrot from store
function buyParrot(parrotId) {
    const parrot = storeParrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const price = parrot.getValue();
    if (coins < price) {
        return; // Button should be disabled, but just in case
    }

    coins -= price;
    parrots.push(parrot);
    storeParrots = storeParrots.filter(p => p.id !== parrotId);

    // Generate new store parrot (replace with similar rarity)
    const oldRarity = parrot.calculateRarity();
    let newParrot = null;
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts && !newParrot) {
        attempts++;

        let genes;
        if (oldRarity === 'legendary') {
            genes = createParrotWithPurity('high');
            // Add gradients to 2-3 body parts
            const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
            const numGradients = 2 + Math.floor(Math.random() * 2);
            for (let j = 0; j < numGradients; j++) {
                const part = bodyParts[Math.floor(Math.random() * bodyParts.length)];
                genes[part].gradient = true;
            }
        } else if (oldRarity === 'epic') {
            genes = createParrotWithPurity('high');
        } else if (oldRarity === 'rare') {
            genes = createParrotWithPurity('medium');
        } else if (oldRarity === 'uncommon') {
            genes = createParrotWithPurity('low');
        } else {
            genes = createParrotWithPurity('random');
        }

        const testParrot = new Parrot(getRandomName(), genes, 1, parrotIdCounter++);
        const actualRarity = testParrot.calculateRarity();

        // Accept if rarity matches or we're on last attempt
        if (actualRarity === oldRarity || attempts >= maxAttempts) {
            newParrot = testParrot;
        }
    }

    if (newParrot) {
        storeParrots.push(newParrot);
    }

    selectedParrotId = null;
    updateUI();
    saveGame();

    // Show success toast
    const rarity = parrot.calculateRarity();
    showToast(
        `${parrot.name} joined your collection!`,
        `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} • Gen ${parrot.generation} • -${price} coins`,
        'success'
    );
}

// Sell parrot
let sellHoldTimer = null;
let sellHoldProgress = null;

function startSellHold(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const button = event.target;
    const sellValue = Math.floor(parrot.getValue() * 0.7);
    const holdDuration = 2000; // 2 seconds
    const startTime = Date.now();

    // Create progress overlay
    const progressBar = document.createElement('div');
    progressBar.className = 'hold-progress';
    progressBar.style.cssText = 'position: absolute; bottom: 0; left: 0; height: 4px; background: #28a745; width: 0%; transition: width 0.05s linear;';
    button.style.position = 'relative';
    button.appendChild(progressBar);

    button.classList.add('holding');

    sellHoldTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / holdDuration) * 100, 100);
        progressBar.style.width = `${progress}%`;

        if (elapsed >= holdDuration) {
            clearInterval(sellHoldTimer);
            sellHoldTimer = null;

            // Execute sell
            coins += sellValue;
            parrots = parrots.filter(p => p.id !== parrotId);

            // Clear from breeding pair if present
            if (breedingPair.left === parrotId) breedingPair.left = null;
            if (breedingPair.right === parrotId) breedingPair.right = null;
            selectedParrotId = null;

            updateUI();
            saveGame();

            // Show info toast
            showToast(
                `${parrot.name} sold`,
                `+${sellValue} coins`,
                'success'
            );
        }
    }, 50);
}

function cancelSellHold() {
    if (sellHoldTimer) {
        clearInterval(sellHoldTimer);
        sellHoldTimer = null;
    }

    // Remove progress bar and holding class from all sell buttons
    document.querySelectorAll('.btn-sell').forEach(btn => {
        btn.classList.remove('holding');
        const progressBar = btn.querySelector('.hold-progress');
        if (progressBar) {
            progressBar.remove();
        }
    });
}

// Free parrot
function freeParrot(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    if (!confirm(`Release ${parrot.name} to the wild? You won't get any coins.`)) return;

    parrots = parrots.filter(p => p.id !== parrotId);

    // Clear from breeding pair if present
    if (breedingPair.left === parrotId) breedingPair.left = null;
    if (breedingPair.right === parrotId) breedingPair.right = null;
    selectedParrotId = null;

    updateUI();
    saveGame();

    // Show info toast
    showToast(
        `${parrot.name} released`,
        `Set free to the wild`,
        'info'
    );
}

// Breed parrots
async function breedParrots() {
    if (breedingPair.left === null || breedingPair.right === null) return;

    const parent1 = parrots.find(p => p.id === breedingPair.left);
    const parent2 = parrots.find(p => p.id === breedingPair.right);

    if (!parent1 || !parent2) return;

    // Generate 4 offspring
    const offspring = [];
    for (let i = 0; i < 4; i++) {
        const childGenes = {
            wings: breedBodyPart(parent1.genes.wings, parent2.genes.wings),
            special_wing: breedBodyPart(parent1.genes.special_wing, parent2.genes.special_wing),
            body: breedBodyPart(parent1.genes.body, parent2.genes.body),
            head: breedBodyPart(parent1.genes.head, parent2.genes.head),
            tail: breedBodyPart(parent1.genes.tail, parent2.genes.tail),
            accents: breedBodyPart(parent1.genes.accents, parent2.genes.accents)
        };

        const childGen = Math.max(parent1.generation, parent2.generation) + 1;
        if (childGen > generation) generation = childGen;

        const child = new Parrot(getRandomName(), childGenes, childGen, parrotIdCounter++);
        offspring.push(child);
    }

    // Auto-adopt all offspring
    offspring.forEach(chick => {
        parrots.push(chick);
    });

    // Clear breeding pair
    breedingPair.left = null;
    breedingPair.right = null;

    await updateUI();
    saveGame();

    // Show success toast
    const offspringNames = offspring.map(p => p.name).join(', ');
    showToast(
        `Breeding successful!`,
        `4 new parrots: ${offspringNames}`,
        'success',
        5000
    );
}

// Breed a single body part
function breedBodyPart(part1, part2) {
    const childPart = {
        red: [],
        green: [],
        blue: [],
        gradient: Math.random() < 0.5 ? part1.gradient : part2.gradient
    };

    for (let i = 0; i < 4; i++) {
        childPart.red.push(Math.random() < 0.5 ? part1.red[i] : part2.red[i]);
        childPart.green.push(Math.random() < 0.5 ? part1.green[i] : part2.green[i]);
        childPart.blue.push(Math.random() < 0.5 ? part1.blue[i] : part2.blue[i]);
    }

    return childPart;
}

// Close modal
function closeModal() {
    document.getElementById('laboratoryModal').classList.remove('active');
}

// Save game to cookies
function saveGame() {
    const gameState = {
        parrots: parrots.map(p => ({
            id: p.id,
            name: p.name,
            genes: p.genes,
            generation: p.generation
        })),
        coins,
        parrotIdCounter,
        generation,
        usedNames: Array.from(usedNames),
        examinedParrots: Array.from(examinedParrots),
        contestProgress,
        parrotTrophies
    };

    // Store in cookie (max 4KB, so we compress by storing only essential data)
    try {
        const gameData = JSON.stringify(gameState);
        document.cookie = `chromawing_save=${encodeURIComponent(gameData)};max-age=31536000;path=/`;
        console.log('Game saved successfully');
    } catch (e) {
        console.error('Failed to save game:', e);
    }
}

// Load game from cookies
function loadGame() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'chromawing_save') {
            try {
                const gameState = JSON.parse(decodeURIComponent(value));

                // Restore game state
                parrots = gameState.parrots.map(p => new Parrot(p.name, p.genes, p.generation, p.id));
                coins = gameState.coins;
                parrotIdCounter = gameState.parrotIdCounter;
                generation = gameState.generation;
                usedNames = new Set(gameState.usedNames || []);
                examinedParrots = new Set(gameState.examinedParrots || []);
                contestProgress = gameState.contestProgress || {};
                parrotTrophies = gameState.parrotTrophies || {};

                // Restore contest tier unlock status
                if (gameState.contestProgress) {
                    CONTEST_TIERS.forEach((tier, index) => {
                        if (index === 0) {
                            tier.unlocked = true;
                        } else {
                            // Check if any parrot has completed the previous tier
                            const anyCompleted = Object.values(gameState.contestProgress).some(
                                progress => progress[index - 1]
                            );
                            if (anyCompleted) {
                                tier.unlocked = true;
                            }
                        }
                    });
                }

                console.log('Game loaded successfully');
                return true;
            } catch (e) {
                console.error('Failed to load game:', e);
                return false;
            }
        }
    }
    return false;
}

// New game - reset everything
function newGame() {
    if (!confirm('Start a new game? This will erase your current progress!')) {
        return;
    }

    // Clear cookie
    document.cookie = 'chromawing_save=;max-age=0;path=/';

    // Reset state
    parrots = [];
    storeParrots = [];
    selectedParrotId = null;
    breedingPair = { left: null, right: null };
    currentTab = 'collection';
    coins = 500;
    parrotIdCounter = 0;
    generation = 1;
    usedNames = new Set();
    examinedParrots = new Set();
    contestProgress = {};
    parrotTrophies = {};

    // Reset contest tiers to locked except first
    CONTEST_TIERS.forEach((tier, index) => {
        tier.unlocked = (index === 0);
    });

    // Reinitialize
    initGame();
}

// Initialize on load
window.addEventListener('load', async () => {
    // Try to load saved game
    const loaded = loadGame();

    if (loaded) {
        // Game loaded from save
        await generateStore();
        await updateUI();
    } else {
        // New game
        await initGame();
    }
});

// Toast Notification System
let notificationHistory = [];
let toastIdCounter = 0;

const TOAST_ICONS = {
    'success': '✅',
    'info': 'ℹ️',
    'warning': '⚠️',
    'error': '❌'
};

function showToast(message, details = '', type = 'info', duration = 4000) {
    const toastId = toastIdCounter++;
    const container = document.getElementById('toastContainer');
    const icon = TOAST_ICONS[type] || 'ℹ️';

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${toastId}`;

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
            ${details ? `<div class="toast-details">${details}</div>` : ''}
        </div>
        <button class="toast-close" onclick="dismissToast('toast-${toastId}')">&times;</button>
    `;

    container.appendChild(toast);

    // Add to history
    addToHistory(message, details, type);

    // Auto-dismiss after duration
    if (duration > 0) {
        setTimeout(() => {
            dismissToast(`toast-${toastId}`);
        }, duration);
    }

    return toastId;
}

function dismissToast(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;

    toast.classList.add('toast-exit');

    setTimeout(() => {
        toast.remove();
    }, 300); // Match animation duration
}

function addToHistory(message, details, type) {
    const timestamp = new Date();
    notificationHistory.unshift({
        message,
        details,
        type,
        timestamp
    });

    // Limit history to 50 items
    if (notificationHistory.length > 50) {
        notificationHistory.pop();
    }

    updateNotificationCount();
    updateNotificationHistoryDisplay();
}

function updateNotificationCount() {
    const countElement = document.getElementById('notificationCount');
    countElement.textContent = notificationHistory.length;
}

function toggleNotificationHistory() {
    const panel = document.getElementById('notificationHistoryPanel');
    panel.classList.toggle('active');
}

function clearNotificationHistory() {
    if (!confirm('Clear all notifications?')) return;

    notificationHistory = [];
    updateNotificationCount();
    updateNotificationHistoryDisplay();
}

function updateNotificationHistoryDisplay() {
    const listElement = document.getElementById('notificationHistoryList');

    if (notificationHistory.length === 0) {
        listElement.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">No notifications yet</div>';
        return;
    }

    listElement.innerHTML = notificationHistory.map(notif => {
        const icon = TOAST_ICONS[notif.type] || 'ℹ️';
        const timeStr = formatTimeAgo(notif.timestamp);

        return `
            <div class="notification-history-item ${notif.type}">
                <div class="notification-history-item-header">
                    <span class="notification-history-item-icon">${icon}</span>
                    <span class="notification-history-item-message">${notif.message}</span>
                    <span class="notification-history-item-time">${timeStr}</span>
                </div>
                ${notif.details ? `<div class="notification-history-item-details">${notif.details}</div>` : ''}
            </div>
        `;
    }).join('');
}

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((new Date() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Contest System Functions

function renderContestsTab() {
    const contestsTab = document.getElementById('contestsTab');
    const parrot = selectedParrotId !== null ? parrots.find(p => p.id === selectedParrotId) : null;

    let html = '<div style="padding: 20px;">';

    if (!parrot) {
        html += '<div style="text-align: center; padding: 40px; color: #999;">';
        html += '<h3>Select a parrot from your collection to enter contests!</h3>';
        html += '<button class="btn" onclick="switchTab(\'collection\')">Go to Collection</button>';
        html += '</div>';
        contestsTab.innerHTML = html;
        return;
    }

    html += `<h3>🏆 Beauty Contests for ${parrot.name}</h3>`;
    html += '<p style="color: #666; margin-bottom: 20px;">Compete to win coins and badges. Beat each tier to unlock the next!</p>';

    CONTEST_TIERS.forEach((tier, index) => {
        const prevCompleted = index === 0 || (contestProgress[selectedParrotId] && contestProgress[selectedParrotId][index - 1]);
        const isUnlocked = tier.unlocked && prevCompleted;
        const hasCompleted = contestProgress[selectedParrotId] && contestProgress[selectedParrotId][index];

        const bgColor = hasCompleted ? '#d4edda' : (isUnlocked ? '#f8f9fa' : '#f0f0f0');
        const borderColor = hasCompleted ? '#28a745' : (isUnlocked ? '#667eea' : '#ccc');

        html += `<div style="margin-bottom: 20px; padding: 20px; background: ${bgColor}; border-radius: 12px; border: 2px solid ${borderColor}; opacity: ${isUnlocked || hasCompleted ? 1 : 0.6};">`;
        html += '<div style="display: flex; justify-content: space-between; align-items: start;">';
        html += '<div style="flex: 1;">';
        html += `<h4 style="margin: 0 0 10px 0;">${tier.name} ${!isUnlocked && !hasCompleted ? '🔒' : ''} ${hasCompleted ? '✅' : ''}</h4>`;
        html += `<p style="color: #666; margin: 0 0 10px 0;">${tier.description}</p>`;

        if (tier.specialRules) {
            html += '<div style="background: #fff3cd; padding: 10px; border-radius: 6px; margin-bottom: 10px;">';
            html += `<strong>Rule:</strong> ${tier.specialRules.description}`;
            html += '</div>';
        }

        html += '<div style="display: flex; gap: 20px; font-size: 0.9em; color: #666; flex-wrap: wrap;">';
        html += `<span>💰 Entry: ${tier.entryCost}</span>`;
        html += `<span>🥇 ${tier.rewards[1].coins} | 🥈 ${tier.rewards[2].coins} | 🥉 ${tier.rewards[3].coins}</span>`;
        html += '</div>';

        if (hasCompleted) {
            const result = contestProgress[selectedParrotId][index];
            html += '<div style="margin-top: 10px; padding: 10px; background: white; border-radius: 6px;">';
            html += `<strong>Completed:</strong> ${result.badge} ${result.placed}${result.placed === 1 ? 'st' : result.placed === 2 ? 'nd' : result.placed === 3 ? 'rd' : 'th'} place • ${result.coins} coins`;
            html += '</div>';
        }

        html += '</div>';

        html += '<div style="min-width: 150px; text-align: right;">';
        if (!isUnlocked && !hasCompleted) {
            html += '<button class="btn" disabled style="opacity: 0.5;">🔒 Locked</button>';
        } else if (hasCompleted) {
            html += '<button class="btn" disabled style="opacity: 0.5; background: #28a745; color: white;">✅ Complete</button>';
        } else {
            html += `<button class="btn btn-contest" onclick="enterContest(${index})" style="background: #667eea; color: white;" ${coins < tier.entryCost ? 'disabled' : ''}>`;
            html += `${coins < tier.entryCost ? '❌ Need ' + tier.entryCost : '🎯 Enter (' + tier.entryCost + '💰)'}`;
            html += '</button>';
        }
        html += '</div>';

        html += '</div>';
        html += '</div>';
    });

    html += '</div>';
    contestsTab.innerHTML = html;
}

async function enterContest(tierIndex) {
    const tier = CONTEST_TIERS[tierIndex];
    const parrot = parrots.find(p => p.id === selectedParrotId);

    if (!parrot) {
        showToast('No parrot selected', 'Go to collection first', 'warning');
        return;
    }

    if (tier.specialRules && !tier.specialRules.validator(parrot)) {
        showToast('Does not meet requirements', tier.specialRules.description, 'error');
        return;
    }

    if (coins < tier.entryCost) {
        showToast('Not enough coins', `Need ${tier.entryCost} coins`, 'error');
        return;
    }

    coins -= tier.entryCost;
    updateStats();

    const parrotBeauty = parrot.calculateBeauty();
    const opponents = generateAIOpponents(tier, 5);

    const competitors = [
        { parrot, beauty: parrotBeauty, isPlayer: true },
        ...opponents
    ];

    competitors.sort((a, b) => b.beauty.score - a.beauty.score);

    const playerIndex = competitors.findIndex(c => c.isPlayer);
    const placement = playerIndex + 1;

    let coinsWon = 0;
    let badge = null;
    if (placement <= 3) {
        const reward = tier.rewards[placement];
        coinsWon = reward.coins;
        badge = reward.badge;
        // DON'T auto-add coins - player will choose coins OR parrot
    }

    if (!contestProgress[selectedParrotId]) {
        contestProgress[selectedParrotId] = {};
    }
    contestProgress[selectedParrotId][tierIndex] = { placed: placement, coins: coinsWon, badge };

    if (placement <= 3 && tierIndex < CONTEST_TIERS.length - 1) {
        CONTEST_TIERS[tierIndex + 1].unlocked = true;
    }

    if (!parrotTrophies[selectedParrotId]) {
        parrotTrophies[selectedParrotId] = [];
    }
    if (badge) {
        parrotTrophies[selectedParrotId].push({ tier: tierIndex, badge, placement });
    }

    updateStats();
    saveGame();

    showContestResults(tier, tierIndex, competitors, placement, coinsWon, badge, parrot);
}

function generateAIOpponents(tier, count) {
    const opponents = [];
    const [minBeauty, maxBeauty] = tier.minBeautyRange;
    const aiNames = ['Luna Eclipse', 'Prismatic Wing', 'Sunset Dancer', 'Ocean Breeze', 'Forest Gem', 'Twilight Star'];

    for (let i = 0; i < count; i++) {
        const targetBeauty = minBeauty + Math.random() * (maxBeauty - minBeauty);
        const mockBeauty = {
            score: Math.round(targetBeauty + (Math.random() - 0.5) * 15),
            maxScore: 200,
            traits: [],
            bodyPartColors: {},
            partContributions: {}
        };

        opponents.push({
            parrot: { name: aiNames[i] || `Competitor ${i + 1}`, id: `ai_${i}` },
            beauty: mockBeauty,
            isPlayer: false
        });
    }

    return opponents;
}

function showContestResults(tier, tierIndex, competitors, placement, coinsWon, badge, playerParrot) {
    const modal = document.getElementById('contestModal');
    const display = document.getElementById('contestDisplay');

    const won = placement <= 3;
    const bgColor = won ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa';
    const textColor = won ? 'white' : '#333';

    let html = `<h2 style="text-align: center; margin-bottom: 20px;">${tier.name}</h2>`;

    html += `<div style="text-align: center; padding: 30px; background: ${bgColor}; border-radius: 12px; margin-bottom: 20px; color: ${textColor};">`;
    html += `<h1 style="margin: 0 0 10px 0; font-size: 3em;">${won ? badge : '😔'}</h1>`;
    html += `<h3 style="margin: 0 0 5px 0;">${playerParrot.name} placed ${placement}${placement === 1 ? 'st' : placement === 2 ? 'nd' : placement === 3 ? 'rd' : 'th'}!</h3>`;
    html += '</div>';

    // Show reward choice for top 3
    if (won) {
        const rareTemplate = RARE_CONTEST_PARROTS[tierIndex]?.[placement];
        if (rareTemplate) {
            // Create temporary rare parrot to calculate its sell value
            const tempRareParrot = createRareParrot(tierIndex, placement);
            const parrotSellValue = tempRareParrot ? calculateParrotSellValue(tempRareParrot) : 0;

            html += '<h3 style="text-align: center; margin: 20px 0;">Choose Your Reward</h3>';
            html += '<div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px;">';

            // Coins option
            html += '<div style="flex: 1; max-width: 300px; border: 2px solid #4caf50; border-radius: 12px; padding: 20px; background: white; text-align: center;">';
            html += '<h4 style="margin: 0 0 10px 0; color: #4caf50;">💰 Take Coins</h4>';
            html += `<p style="font-size: 2em; margin: 10px 0; font-weight: bold;">${coinsWon} coins</p>`;
            html += '<p style="color: #666; font-size: 0.9em;">Safe choice - immediate value</p>';
            html += `<button class="btn" style="background: #4caf50; color: white; width: 100%;" onclick="takeCoinsReward(${tierIndex}, ${placement}, ${coinsWon})">Take Coins</button>`;
            html += '</div>';

            // Parrot option
            html += '<div style="flex: 1; max-width: 300px; border: 2px solid #9c27b0; border-radius: 12px; padding: 20px; background: white; text-align: center;">';
            html += `<h4 style="margin: 0 0 10px 0; color: #9c27b0;">🦜 Take ${rareTemplate.name}</h4>`;
            html += `<p style="font-size: 1.2em; margin: 10px 0; font-weight: bold; color: #9c27b0;">${rareTemplate.description}</p>`;
            if (tempRareParrot) {
                const beauty = tempRareParrot.calculateBeauty();
                html += `<p style="margin: 5px 0;"><strong>Beauty:</strong> ${beauty.score} pts</p>`;
            }
            html += `<p style="color: #666; font-size: 0.9em;">Sell value: ~${parrotSellValue} coins</p>`;
            html += `<p style="color: #e91e63; font-size: 0.85em; font-weight: 600;">Unique parrot with special genes!</p>`;
            html += `<button class="btn" style="background: #9c27b0; color: white; width: 100%;" onclick="takeParrotReward(${tierIndex}, ${placement})">Take Parrot</button>`;
            html += '</div>';

            html += '</div>';
        } else {
            // Fallback if no rare parrot defined
            html += `<p style="text-align: center; font-size: 1.5em; margin: 10px 0;">Won ${coinsWon} coins!</p>`;
        }
    } else {
        html += '<p style="text-align: center; margin: 10px 0;">Better luck next time!</p>';
    }

    html += '<h4 style="margin: 20px 0 10px 0;">Final Rankings</h4>';
    html += '<div style="background: #f8f9fa; border-radius: 12px; padding: 15px;">';

    competitors.forEach((comp, index) => {
        const isPlayer = comp.isPlayer;
        const placeNum = index + 1;
        const placeBadge = placeNum === 1 ? '🥇' : placeNum === 2 ? '🥈' : placeNum === 3 ? '🥉' : `${placeNum}.`;

        html += `<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: ${isPlayer ? '#e3f2fd' : 'white'}; border-radius: 8px; border: ${isPlayer ? '2px solid #2196f3' : '1px solid #ddd'};">`;
        html += '<div style="display: flex; align-items: center; gap: 10px;">';
        html += `<span style="font-size: 1.2em; min-width: 40px;">${placeBadge}</span>`;
        html += `<strong style="color: ${isPlayer ? '#2196f3' : '#333'};">${comp.parrot.name}${isPlayer ? ' (You)' : ''}</strong>`;
        html += '</div>';
        html += '<div style="text-align: right;">';
        html += `<span style="font-weight: 600; color: #667eea;">${comp.beauty.score} pts</span>`;
        html += '</div>';
        html += '</div>';
    });

    html += '</div>';

    if (!won) {
        html += '<div style="text-align: center; margin-top: 20px;">';
        html += '<button class="btn" onclick="closeContestModal()">Close</button>';
        html += '</div>';
    }

    display.innerHTML = html;
    modal.classList.add('active');
}

function closeContestModal() {
    document.getElementById('contestModal').classList.remove('active');
    renderContestsTab();
}

/*
 * RARE CONTEST PARROT REWARD SYSTEM
 * ==================================
 *
 * Players choose between COINS or a RARE PARROT when placing top 3 in contests.
 * Each tier/placement has a predefined rare parrot with special genes.
 *
 * PROGRESSION DESIGN:
 * - Tier 0 (Beginner): Rewards have SOLID COLORS → helps Tier 1's "3+ colors" requirement
 * - Tier 1 (Rainbow): Rewards have GRADIENTS → helps Tier 2's "2+ gradients" requirement
 * - Tier 2 (Gradient Masters): Rewards have COMPLEMENTARY COLORS → helps Tier 3's requirement
 * - Tier 3 (Contrast): Rewards have GRADIENTS + COMPLEMENTARY → helps Tier 4's requirement
 * - Tier 4 (Elite): ULTIMATE PARROTS with perfect genes (required for endgame)
 */
const RARE_CONTEST_PARROTS = {
    // Tier 0: Beginner Beauty Show
    0: {
        1: {
            name: 'Golden Dawn',
            description: 'Warm golden tones perfect for rainbow showcases',
            genes: {
                wings: { red: [true, true, true, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false }, // Orange
                special_wing: { red: [true, true, true, true], green: [true, true, true, false], blue: [false, false, false, false], gradient: false }, // Yellow
                body: { red: [true, true, true, true], green: [true, false, false, false], blue: [false, false, false, false], gradient: false }, // Red
                head: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, false, false], gradient: false }, // Orange-red
                tail: { red: [true, true, true, false], green: [true, true, true, false], blue: [false, false, false, false], gradient: false }, // Yellow-orange
                accents: { red: [true, true, true, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false } // Orange-red
            }
        },
        2: {
            name: 'Silver Mist',
            description: 'Cool silvery blues perfect for rainbow showcases',
            genes: {
                wings: { red: [false, false, false, false], green: [true, true, true, false], blue: [true, true, true, true], gradient: false }, // Cyan
                special_wing: { red: [true, true, true, false], green: [true, true, true, true], blue: [true, true, true, true], gradient: false }, // White-ish
                body: { red: [false, false, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false }, // Blue
                head: { red: [true, true, true, false], green: [true, true, true, false], blue: [true, true, true, false], gradient: false }, // Light gray
                tail: { red: [false, false, false, false], green: [true, true, true, false], blue: [true, true, true, false], gradient: false }, // Teal
                accents: { red: [true, true, false, false], green: [true, true, false, false], blue: [true, true, false, false], gradient: false } // Gray
            }
        },
        3: {
            name: 'Bronze Gleam',
            description: 'Earthy bronze tones with a metallic sheen',
            genes: {
                wings: { red: [true, true, false, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                special_wing: { red: [true, true, true, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false },
                body: { red: [true, true, false, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                head: { red: [true, true, true, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                tail: { red: [true, true, false, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                accents: { red: [true, false, false, false], green: [false, false, false, false], blue: [false, false, false, false], gradient: false }
            }
        }
    },

    // Tier 1: Rainbow Showcase (needs 3+ colors)
    1: {
        1: {
            name: 'Prismatic Pride',
            description: 'A dazzling display of the full color spectrum',
            genes: {
                wings: { red: [true, true, false, false], green: [true, true, true, true], blue: [true, true, true, false], gradient: true }, // Red→Yellow gradient
                special_wing: { red: [false, false, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Blue→Purple gradient
                body: { red: [false, false, false, false], green: [true, true, true, true], blue: [false, false, false, false], gradient: false }, // Pure green
                head: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false }, // Pure red
                tail: { red: [false, false, false, false], green: [true, true, false, false], blue: [true, true, true, true], gradient: false }, // Cyan
                accents: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: false } // Yellow
            }
        },
        2: {
            name: 'Chromatic Dream',
            description: 'A harmonious blend of vivid hues',
            genes: {
                wings: { red: [false, false, false, false], green: [true, true, true, true], blue: [false, false, true, true], gradient: true }, // Green→Cyan gradient
                special_wing: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false }, // Red
                body: { red: [false, false, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false }, // Blue
                head: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: false }, // Yellow
                tail: { red: [true, true, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: false }, // Purple
                accents: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, false, false], gradient: false } // Teal
            }
        },
        3: {
            name: 'Spectrum Wing',
            description: 'Every color of the rainbow in perfect harmony',
            genes: {
                wings: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false }, // Red
                special_wing: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, false, false], gradient: false }, // Orange
                body: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: false }, // Yellow
                head: { red: [false, false, false, false], green: [true, true, true, true], blue: [false, false, false, false], gradient: false }, // Green
                tail: { red: [false, false, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false }, // Blue
                accents: { red: [true, true, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false } // Purple
            }
        }
    },

    // Tier 2: Gradient Masters (needs 2+ gradients)
    2: {
        1: {
            name: 'Aurora Cascade',
            description: 'Flowing colors like the northern lights',
            genes: {
                wings: { red: [false, false, true, true], green: [true, true, true, true], blue: [true, true, false, false], gradient: true }, // Cyan→Green
                special_wing: { red: [true, true, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Pink→Purple
                body: { red: [false, false, true, true], green: [true, true, false, false], blue: [true, true, true, true], gradient: true }, // Blue→Purple
                head: { red: [true, true, false, false], green: [true, true, true, true], blue: [false, false, true, true], gradient: true }, // Yellow→Green
                tail: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true }, // Orange→Purple
                accents: { red: [false, false, true, true], green: [true, true, true, true], blue: [true, true, true, true], gradient: true } // Cyan→White
            }
        },
        2: {
            name: 'Twilight Flow',
            description: 'Sunset colors in graceful transitions',
            genes: {
                wings: { red: [true, true, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Pink→Purple
                special_wing: { red: [true, true, false, false], green: [false, false, true, true], blue: [true, true, false, false], gradient: true }, // Orange→Blue
                body: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true }, // Orange→Purple
                head: { red: [true, true, true, true], green: [false, false, false, false], blue: [true, true, false, false], gradient: false }, // Pink
                tail: { red: [true, true, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false }, // Purple
                accents: { red: [true, true, true, true], green: [true, true, true, true], blue: [true, true, false, false], gradient: false } // Light yellow
            }
        },
        3: {
            name: 'Ocean Drift',
            description: 'Sea blues meet warm sunset hints',
            genes: {
                wings: { red: [false, false, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Blue→Cyan
                special_wing: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, false, false], gradient: true }, // Cyan→Teal
                body: { red: [false, false, false, false], green: [true, true, false, false], blue: [true, true, true, true], gradient: false }, // Ocean blue
                head: { red: [true, true, true, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false }, // Orange (complementary to blue!)
                tail: { red: [true, true, false, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false }, // Orange-red (complementary!)
                accents: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, true, false], gradient: false } // Light cyan
            }
        }
    },

    // Tier 3: Contrast Championship (needs complementary colors)
    3: {
        1: {
            name: 'Ember & Ice',
            description: 'Fire and frost in perfect opposition',
            genes: {
                wings: { red: [true, true, false, false], green: [false, false, false, false], blue: [false, false, true, true], gradient: true }, // Red→Blue (complementary)
                special_wing: { red: [true, true, true, true], green: [false, false, true, true], blue: [false, false, true, true], gradient: true }, // Red→Cyan
                body: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, false, false], gradient: true }, // Orange→Red
                head: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, true, true], gradient: false }, // Cyan
                tail: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false }, // Red
                accents: { red: [false, false, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: false } // Blue
            }
        },
        2: {
            name: 'Sunset Contrast',
            description: 'Bold orange skies meet deep ocean blues',
            genes: {
                wings: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true }, // Orange→Blue (complementary)
                special_wing: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: true }, // Yellow→Orange
                body: { red: [false, false, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false }, // Blue
                head: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, false, false], gradient: false }, // Orange
                tail: { red: [false, false, false, false], green: [true, true, false, false], blue: [true, true, true, true], gradient: false }, // Deep blue
                accents: { red: [true, true, true, true], green: [true, true, true, false], blue: [false, false, false, false], gradient: false } // Bright orange
            }
        },
        3: {
            name: 'Forest Fire',
            description: 'Vibrant greens clash with burning reds',
            genes: {
                wings: { red: [true, true, true, true], green: [false, false, true, true], blue: [false, false, false, false], gradient: true }, // Red→Green (complementary)
                special_wing: { red: [false, false, false, false], green: [true, true, true, true], blue: [false, false, false, false], gradient: false }, // Green
                body: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false }, // Red
                head: { red: [true, true, false, false], green: [true, true, true, true], blue: [false, false, false, false], gradient: false }, // Yellow-green
                tail: { red: [true, true, true, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false }, // Orange-red
                accents: { red: [false, false, false, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false } // Dark green
            }
        }
    },

    // Tier 4: Elite Grand Prix (needs gradients AND complementary)
    4: {
        1: {
            name: 'Celestial Perfection',
            description: 'The pinnacle of chromatic beauty - required for endgame',
            genes: {
                wings: { red: [true, true, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Purple→Cyan (complementary)
                special_wing: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true }, // Orange→Blue (complementary)
                body: { red: [true, true, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Pink→Cyan
                head: { red: [false, false, true, true], green: [true, true, true, true], blue: [false, false, true, true], gradient: true }, // Green→Yellow
                tail: { red: [true, true, false, false], green: [true, true, true, true], blue: [false, false, true, true], gradient: true }, // Yellow→Cyan
                accents: { red: [true, true, true, true], green: [false, false, false, false], blue: [true, true, true, true], gradient: true } // Red→Purple
            }
        },
        2: {
            name: 'Royal Spectrum',
            description: 'Majestic beauty fit for royalty',
            genes: {
                wings: { red: [true, true, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Pink→Purple (rich)
                special_wing: { red: [true, true, false, false], green: [true, true, true, true], blue: [false, false, true, true], gradient: true }, // Yellow→Green
                body: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true }, // Orange→Purple (complementary)
                head: { red: [false, false, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Blue→Purple
                tail: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: true }, // Yellow→Orange
                accents: { red: [true, true, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false } // Purple
            }
        },
        3: {
            name: 'Noble Radiance',
            description: 'Dignified elegance with stunning color play',
            genes: {
                wings: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true }, // Orange→Blue (complementary)
                special_wing: { red: [false, false, true, true], green: [true, true, true, true], blue: [true, true, false, false], gradient: true }, // Green→Cyan
                body: { red: [true, true, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: true }, // Purple→Cyan
                head: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, true, true], gradient: true }, // Yellow→Green
                tail: { red: [true, true, true, true], green: [false, false, false, false], blue: [true, true, false, false], gradient: false }, // Pink
                accents: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, true, true], gradient: false } // Cyan
            }
        }
    }
};

// Create a rare parrot from the predefined templates
function createRareParrot(tierIndex, placement) {
    const rareTemplate = RARE_CONTEST_PARROTS[tierIndex]?.[placement];
    if (!rareTemplate) {
        console.error(`No rare parrot defined for tier ${tierIndex}, placement ${placement}`);
        return null;
    }

    // Create a new parrot with the predefined genes
    const parrot = new Parrot(rareTemplate.name, rareTemplate.genes, 1);
    parrot.isRare = true;
    parrot.rareSource = { tier: tierIndex, placement };
    parrot.description = rareTemplate.description;

    return parrot;
}

// Calculate sell value for a parrot (approximately 50-60% of its beauty score as coins)
function calculateParrotSellValue(parrot) {
    const beauty = parrot.calculateBeauty();
    // Base value on beauty score, with some variance
    const baseValue = Math.round(beauty.score * 0.55);
    // Rare parrots sell for slightly less to encourage keeping them
    if (parrot.isRare) {
        return Math.round(baseValue * 0.9);
    }
    return baseValue;
}

// Handle player choosing coins as reward
function takeCoinsReward(tierIndex, placement, coinsAmount) {
    coins += coinsAmount;
    updateStats();
    saveGame();

    showToast('Coins received!', `+${coinsAmount} coins`, 'success');
    closeContestModal();
    renderContestsTab();
}

// Handle player choosing rare parrot as reward
function takeParrotReward(tierIndex, placement) {
    const rareParrot = createRareParrot(tierIndex, placement);

    if (!rareParrot) {
        showToast('Error', 'Failed to create rare parrot', 'error');
        return;
    }

    parrots.push(rareParrot);
    updateStats();
    saveGame();

    showToast('Rare parrot received!', `${rareParrot.name} added to your collection`, 'success');
    closeContestModal();
    renderContestsTab();
}
