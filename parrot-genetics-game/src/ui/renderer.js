// ChromaWing - UI Renderer
// v3.0

import { state } from '../game/gameState.js';
import { generateParrotSVG } from '../rendering/svgRenderer.js';
import { getBeautyColor, RARITY_COLORS, RARITY_LABELS } from '../data/constants.js';

// Update all UI elements
export async function updateUI() {
    updateStats();
    await renderParrotGrid();
    updateBreedingPanel();
}

// Update stats bar
export function updateStats() {
    document.getElementById('coinsDisplay').textContent = state.coins;
    document.getElementById('parrotCount').textContent = state.parrots.length;
    document.getElementById('maxGen').textContent = state.generation;
}

// Render parrot grid
export async function renderParrotGrid() {
    const collectionTab = document.getElementById('collectionTab');
    const storeTab = document.getElementById('storeTab');

    // Render collection
    collectionTab.innerHTML = '';
    for (const parrot of state.parrots) {
        const card = await createParrotCard(parrot, false);
        collectionTab.appendChild(card);
    }

    // Render store
    storeTab.innerHTML = '';
    for (const parrot of state.storeParrots) {
        const card = await createParrotCard(parrot, true);
        storeTab.appendChild(card);
    }
}

// Create a parrot card
async function createParrotCard(parrot, isStore) {
    const card = document.createElement('div');
    card.className = 'parrot-card';

    if (state.selectedParrotId === parrot.id) {
        card.classList.add('selected');
    }

    // Generate SVG
    const svg = await generateParrotSVG(parrot);

    // Get stats
    const rarity = parrot.calculateRarity();
    const rarityInfo = {
        color: RARITY_COLORS[rarity],
        label: RARITY_LABELS[rarity]
    };
    const beauty = parrot.calculateBeauty();
    const beautyColor = getBeautyColor(beauty.score);
    const price = parrot.getValue();

    // Build card HTML
    card.innerHTML = `
        ${isStore ? `<div class="price">${price}💰</div>` : ''}
        <div class="parrot-mini">${svg}</div>
        <div class="parrot-name">${parrot.name}</div>
        <div class="parrot-gen">Gen ${parrot.generation}</div>
        <div class="rarity-badge" style="background: ${rarityInfo.color};">${rarityInfo.label}</div>
        <div class="beauty-badge" style="background: ${beautyColor}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">
            Beauty: ${Math.round(beauty.score)}
        </div>
        ${parrot.hasAnyGradients() ? '<div class="gradient-indicator">✨ Gradient</div>' : ''}
    `;

    // Add click handler
    card.onclick = () => {
        if (isStore) {
            buyParrot(parrot.id);
        } else {
            selectParrot(parrot.id);
        }
    };

    return card;
}

// Update breeding panel
function updateBreedingPanel() {
    const leftSlot = document.getElementById('breedSlotLeft');
    const rightSlot = document.getElementById('breedSlotRight');
    const breedButton = document.getElementById('breedButton');

    if (state.breedingPair.left) {
        const parrot = state.parrots.find(p => p.id === state.breedingPair.left);
        leftSlot.innerHTML = `<div class="slot-label">Left Parent</div><div>${parrot.name}</div>`;
    } else {
        leftSlot.innerHTML = `<div class="slot-label">Left Parent</div><div style="color: #ccc;">Empty</div>`;
    }

    if (state.breedingPair.right) {
        const parrot = state.parrots.find(p => p.id === state.breedingPair.right);
        rightSlot.innerHTML = `<div class="slot-label">Right Parent</div><div>${parrot.name}</div>`;
    } else {
        rightSlot.innerHTML = `<div class="slot-label">Right Parent</div><div style="color: #ccc;">Empty</div>`;
    }

    // Enable breed button if both slots filled
    breedButton.disabled = !(state.breedingPair.left && state.breedingPair.right);
}

// Select a parrot
function selectParrot(parrotId) {
    state.selectedParrotId = parrotId;

    // Add to breeding pair if not already in
    if (!state.breedingPair.left) {
        state.breedingPair.left = parrotId;
    } else if (!state.breedingPair.right && state.breedingPair.left !== parrotId) {
        state.breedingPair.right = parrotId;
    }

    updateUI();
}

// Buy parrot from store
function buyParrot(parrotId) {
    const parrot = state.storeParrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const price = parrot.getValue();

    if (state.coins < price) {
        alert('Not enough coins!');
        return;
    }

    state.coins -= price;
    state.parrots.push(parrot);
    state.storeParrots = state.storeParrots.filter(p => p.id !== parrotId);

    updateUI();
}

// Export for window
export { selectParrot, buyParrot };
