// ChromaWing Breeding Simulator - RGB Genetics v2.1
// Game State
let parrots = [];
let storeParrots = [];
let selectedParrotIds = [];
let currentTab = 'collection';
let coins = 500;
let parrotIdCounter = 0;
let generation = 1;
let svgCache = null;
let gradientIdCounter = 0;

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
        return Math.round((count / 4) * 255);
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

    getValue() {
        let score = 0;
        for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
            const part = this.genes[bodyPart];
            score += this.countDominant(part.red);
            score += this.countDominant(part.green);
            score += this.countDominant(part.blue);
            if (part.gradient) score += 10;
        }
        return 50 + Math.floor(score * 2) + (this.generation * 10);
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
    const EYE_COLOR = '#000000';
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

        // Eyes (non-genetic, fixed black)
        'body-yellow-4': EYE_COLOR,
        'accent-white-4': EYE_COLOR,

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
    // Create 2 predefined beautiful parrots + 1 random
    parrots = [
        // Predefined 1: Blue gradient wings, orange body
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
        }, 1),

        // Predefined 2: Rainbow gradient parrot
        new Parrot('Prism', {
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
        }, 1),

        // Random starter
        new Parrot(getRandomName(), {
            wings: randomBodyPartGenes(),
            special_wing: randomBodyPartGenes(),
            body: randomBodyPartGenes(),
            head: randomBodyPartGenes(),
            tail: randomBodyPartGenes(),
            accents: randomBodyPartGenes()
        }, 1)
    ];

    parrotIdCounter = parrots.length;

    await generateStore();
    await updateUI();
}

// Generate random parrots for store
async function generateStore() {
    storeParrots = [];

    // Add 2 elite parrots with gradients (500 coins each)
    for (let i = 0; i < 2; i++) {
        const genes = {
            wings: randomBodyPartGenes(),
            special_wing: randomBodyPartGenes(),
            body: randomBodyPartGenes(),
            head: randomBodyPartGenes(),
            tail: randomBodyPartGenes(),
            accents: randomBodyPartGenes()
        };

        // Force gradients on 2-3 body parts
        const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
        const numGradients = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numGradients; j++) {
            const part = bodyParts[Math.floor(Math.random() * bodyParts.length)];
            genes[part].gradient = true;
        }

        const parrot = new Parrot(getRandomName(), genes, 1);
        parrot.isElite = true;
        parrot.price = 500;
        storeParrots.push(parrot);
    }

    // Add 4 regular parrots
    for (let i = 0; i < 4; i++) {
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

    selectedParrotIds = [];
    updateUI();
}

// Update entire UI
async function updateUI() {
    updateStats();
    await renderParrotGrid();
    updatePreview();
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
    if (selectedParrotIds.includes(parrot.id)) {
        card.classList.add('selected');
    }

    const svg = await generateParrotSVG(parrot);
    const selectionNum = selectedParrotIds.indexOf(parrot.id) + 1;
    const price = parrot.isElite ? 500 : parrot.getValue();

    card.innerHTML = `
        ${selectionNum > 0 ? `<div class="selection-indicator">${selectionNum}</div>` : ''}
        ${parrot.isElite ? '<div class="elite-badge">⭐ ELITE</div>' : ''}
        ${isStore ? `<div class="price">${price}💰</div>` : ''}
        <div class="parrot-mini">${svg}</div>
        <div class="parrot-name">${parrot.name}</div>
        <div class="parrot-gen">Gen ${parrot.generation}</div>
        ${parrot.hasAnyGradients() ? '<div class="gradient-indicator">✨ Gradient</div>' : ''}
    `;

    card.onclick = () => selectParrot(parrot.id, isStore);

    return card;
}

// Select parrot
function selectParrot(parrotId, isStore) {
    if (isStore) {
        selectedParrotIds = [parrotId];
    } else {
        const index = selectedParrotIds.indexOf(parrotId);
        if (index >= 0) {
            selectedParrotIds.splice(index, 1);
        } else {
            if (selectedParrotIds.length < 2) {
                selectedParrotIds.push(parrotId);
            } else {
                selectedParrotIds = [parrotId];
            }
        }
    }

    updateUI();
}

// Update preview panel
async function updatePreview() {
    const previewDiv = document.getElementById('selectedPreview');
    const breedingSection = document.getElementById('breedingSection');
    const actionSection = document.getElementById('actionSection');

    if (selectedParrotIds.length === 0) {
        previewDiv.innerHTML = '<div class="empty-preview">Click a parrot to view details</div>';
        breedingSection.style.display = 'none';
        actionSection.style.display = 'none';
        return;
    }

    // Show breeding section if 2 parrots selected from collection
    if (currentTab === 'collection' && selectedParrotIds.length === 2) {
        breedingSection.style.display = 'block';
        actionSection.style.display = 'none';

        const parent1 = parrots.find(p => p.id === selectedParrotIds[0]);
        const parent2 = parrots.find(p => p.id === selectedParrotIds[1]);

        const svg1 = await generateParrotSVG(parent1);
        const svg2 = await generateParrotSVG(parent2);

        document.getElementById('breedingPreview').innerHTML = `
            <div class="breeding-parent">
                <div class="mini-svg">${svg1}</div>
                <div class="name">${parent1.name}</div>
            </div>
            <div class="breeding-icon">💕</div>
            <div class="breeding-parent">
                <div class="mini-svg">${svg2}</div>
                <div class="name">${parent2.name}</div>
            </div>
        `;

        previewDiv.innerHTML = '<div class="empty-preview">Ready to breed!</div>';
        return;
    }

    // Show single parrot preview
    const selectedId = selectedParrotIds[0];
    const parrot = currentTab === 'collection'
        ? parrots.find(p => p.id === selectedId)
        : storeParrots.find(p => p.id === selectedId);

    if (!parrot) return;

    const svg = await generateParrotSVG(parrot);

    previewDiv.innerHTML = `
        <div class="large-parrot-display">${svg}</div>
        <div style="text-align: center; margin-bottom: 10px;">
            <strong style="font-size: 1.3em;">${parrot.name}</strong><br>
            <span style="color: #666;">Generation ${parrot.generation}</span>
            ${parrot.hasAnyGradients() ? '<br><span style="color: #9c27b0; font-weight: bold;">✨ Has Gradients</span>' : ''}
        </div>
    `;

    // Show action buttons
    breedingSection.style.display = 'none';
    actionSection.style.display = 'block';

    const actionButtons = document.getElementById('actionButtons');

    if (currentTab === 'store') {
        const price = parrot.isElite ? 500 : parrot.getValue();
        actionButtons.innerHTML = `
            <button class="btn btn-buy" onclick="buyParrot(${parrot.id})" ${coins < price ? 'disabled' : ''}>
                💰 Buy for ${price} coins
            </button>
        `;
    } else {
        const sellValue = Math.floor(parrot.getValue() * 0.7);
        actionButtons.innerHTML = `
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

// Open Laboratory Modal
async function openLaboratory(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const modal = document.getElementById('laboratoryModal');
    const display = document.getElementById('laboratoryDisplay');

    const bodyPartNames = {
        'wings': '🪽 Wings',
        'special_wing': '✨ Special Wing (wing-blue-1, 4)',
        'body': '🦜 Body',
        'head': '👑 Head',
        'tail': '🎨 Tail',
        'accents': '💎 Accents'
    };

    let html = `<h3>🔬 Laboratory Analysis: ${parrot.name}</h3>`;
    html += `<p style="color: #666; margin-bottom: 20px;">Generation ${parrot.generation} • Total: 78 Genes (6 body parts × 13 genes each)</p>`;

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

    const price = parrot.isElite ? 500 : parrot.getValue();
    if (coins < price) {
        alert('Not enough coins!');
        return;
    }

    coins -= price;
    parrots.push(parrot);
    storeParrots = storeParrots.filter(p => p.id !== parrotId);

    // Generate new store parrot
    const isElite = parrot.isElite;
    const genes = {
        wings: randomBodyPartGenes(),
        special_wing: randomBodyPartGenes(),
        body: randomBodyPartGenes(),
        head: randomBodyPartGenes(),
        tail: randomBodyPartGenes(),
        accents: randomBodyPartGenes()
    };

    if (isElite) {
        const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
        const numGradients = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numGradients; j++) {
            const part = bodyParts[Math.floor(Math.random() * bodyParts.length)];
            genes[part].gradient = true;
        }
    }

    const newParrot = new Parrot(getRandomName(), genes, 1, parrotIdCounter++);
    if (isElite) {
        newParrot.isElite = true;
        newParrot.price = 500;
    }
    storeParrots.push(newParrot);

    selectedParrotIds = [];
    updateUI();

    alert(`${parrot.name} joined your collection!`);
}

// Sell parrot
function sellParrot(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    if (!confirm(`Sell ${parrot.name} for ${Math.floor(parrot.getValue() * 0.7)} coins?`)) return;

    coins += Math.floor(parrot.getValue() * 0.7);
    parrots = parrots.filter(p => p.id !== parrotId);
    selectedParrotIds = [];
    updateUI();
}

// Free parrot
function freeParrot(parrotId) {
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    if (!confirm(`Release ${parrot.name} to the wild? You won't get any coins.`)) return;

    parrots = parrots.filter(p => p.id !== parrotId);
    selectedParrotIds = [];
    updateUI();
}

// Breed parrots
async function breedParrots() {
    if (selectedParrotIds.length !== 2) return;

    const parent1 = parrots.find(p => p.id === selectedParrotIds[0]);
    const parent2 = parrots.find(p => p.id === selectedParrotIds[1]);

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

    selectedParrotIds = [];
    await updateUI();

    alert(`🎉 4 chicks hatched! ${offspring.map(o => o.name).join(', ')} joined your collection!`);
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

// Initialize on load
window.addEventListener('load', initGame);
