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
                    // Store average RGB for gradient
                    bodyPartRGB[bodyPart] = [
                        (+startMatch[1] + +endMatch[1]) / 2,
                        (+startMatch[2] + +endMatch[2]) / 2,
                        (+startMatch[3] + +endMatch[3]) / 2
                    ];
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

        // Check for same-color penalty using dot product
        const rgbParts = bodyParts.filter(bp => bodyPartRGB[bp]);
        for (let i = 0; i < rgbParts.length; i++) {
            for (let j = i + 1; j < rgbParts.length; j++) {
                const rgb1 = bodyPartRGB[rgbParts[i]];
                const rgb2 = bodyPartRGB[rgbParts[j]];
                const dotProduct = this.colorDotProduct(rgb1, rgb2);

                // Very similar colors (dot product > 0.9): penalty
                if (dotProduct > 0.9) {
                    beautyScore -= 3;
                    // Split penalty between both parts
                    partContributions[rgbParts[i]] -= 1.5;
                    partContributions[rgbParts[j]] -= 1.5;
                    beautyTraits.push(`Similar: ${rgbParts[i]} & ${rgbParts[j]} (-1.5 each)`);
                }
                // Orthogonal colors (dot product near 0): bonus
                else if (Math.abs(dotProduct) < 0.3) {
                    beautyScore += 12;
                    // Split bonus between both parts
                    partContributions[rgbParts[i]] += 6;
                    partContributions[rgbParts[j]] += 6;
                    beautyTraits.push(`Contrasting: ${rgbParts[i]} & ${rgbParts[j]} (+6 each)`);
                }
                // Opposite colors (dot product < -0.7): big bonus
                else if (dotProduct < -0.7) {
                    beautyScore += 18;
                    // Split bonus between both parts
                    partContributions[rgbParts[i]] += 9;
                    partContributions[rgbParts[j]] += 9;
                    beautyTraits.push(`Complementary: ${rgbParts[i]} & ${rgbParts[j]} (+9 each)`);
                }
                // Somewhat different (0.3 < |dot| < 0.7): small bonus
                else if (Math.abs(dotProduct) > 0.3 && Math.abs(dotProduct) < 0.7) {
                    beautyScore += 5;
                    // Split bonus between both parts
                    partContributions[rgbParts[i]] += 2.5;
                    partContributions[rgbParts[j]] += 2.5;
                    beautyTraits.push(`Varied: ${rgbParts[i]} & ${rgbParts[j]} (+2.5 each)`);
                }
            }
        }

        return {
            score: Math.max(0, beautyScore),
            maxScore: 100,
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

    if (tab === 'collection') {
        document.getElementById('collectionTab').style.display = 'grid';
        document.getElementById('storeTab').style.display = 'none';
        document.getElementById('panelTitle').textContent = 'Your Parrots';
    } else {
        document.getElementById('collectionTab').style.display = 'none';
        document.getElementById('storeTab').style.display = 'grid';
        document.getElementById('panelTitle').textContent = 'Store - Buy Parrots';
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

    card.innerHTML = `
        ${isStore ? `<div class="price">${price}💰</div>` : ''}
        ${breedingIndicator}
        <div class="parrot-mini">${svg}</div>
        <div class="parrot-name">${parrot.name}</div>
        <div class="parrot-gen">Gen ${parrot.generation}</div>
        <div class="rarity-badge" style="background: ${rarityInfo.color};">${rarityInfo.label}</div>
        ${parrot.hasAnyGradients() ? '<div class="gradient-indicator">✨ Gradient</div>' : ''}
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
            <button class="btn btn-sell" onclick="sellParrot(${parrot.id})">
                💰 Sell for ${sellValue} coins
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
    let maxTraits = 0;
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
        maxTraits += hasGradient ? 10 : 6; // 6 for colors + 4 for gradient if present

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
}

// Sell parrot
function sellParrot(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    if (!confirm(`Sell ${parrot.name} for ${Math.floor(parrot.getValue() * 0.7)} coins?`)) return;

    coins += Math.floor(parrot.getValue() * 0.7);
    parrots = parrots.filter(p => p.id !== parrotId);

    // Clear from breeding pair if present
    if (breedingPair.left === parrotId) breedingPair.left = null;
    if (breedingPair.right === parrotId) breedingPair.right = null;
    selectedParrotId = null;

    updateUI();
    saveGame();
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
        examinedParrots: Array.from(examinedParrots)
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
