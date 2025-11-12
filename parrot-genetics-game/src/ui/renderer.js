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
    updateActionButtons();
}

// Update stats bar
export function updateStats() {
    document.getElementById('coinsDisplay').textContent = state.coins;
    document.getElementById('parrotCount').textContent = state.parrots.length;
    document.getElementById('maxGen').textContent = state.generation;
}

// Render parrot grid
export async function renderParrotGrid() {
    console.log('[Render] Rendering parrot grid...');
    console.log('[Render] Collection parrots:', state.parrots.length);
    console.log('[Render] Store parrots:', state.storeParrots.length);

    const collectionTab = document.getElementById('collectionTab');
    const storeTab = document.getElementById('storeTab');

    if (!collectionTab || !storeTab) {
        console.error('[Render] ERROR: Could not find tab elements!');
        return;
    }

    // Render collection
    collectionTab.innerHTML = '';
    for (const parrot of state.parrots) {
        console.log('[Render] Creating card for collection parrot:', parrot.name);
        const card = await createParrotCard(parrot, false);
        collectionTab.appendChild(card);
    }

    // Render store
    storeTab.innerHTML = '';
    for (const parrot of state.storeParrots) {
        console.log('[Render] Creating card for store parrot:', parrot.name);
        const card = await createParrotCard(parrot, true);
        storeTab.appendChild(card);
    }

    console.log('[Render] Grid rendering complete!');
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
        ${isStore ? `<button class="btn-buy" onclick="event.stopPropagation(); buyParrot(${parrot.id});" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 8px; width: 100%; font-weight: 600;">💰 Buy (${price} coins)</button>` : ''}
    `;

    // Add click handler for collection cards (select) and store cards (preview)
    if (!isStore) {
        card.onclick = () => {
            selectParrot(parrot.id);
        };
    } else {
        // Store cards can be clicked to preview, but buy button is separate
        card.onclick = () => {
            state.selectedParrotId = parrot.id;
            updateUI();
        };
    }

    return card;
}

// Update breeding panel
function updateBreedingPanel() {
    const leftSlot = document.getElementById('breedSlotLeft');
    const rightSlot = document.getElementById('breedSlotRight');
    const breedButton = document.getElementById('breedButton');

    if (state.breedingPair.left !== null) {
        const parrot = state.parrots.find(p => p.id === state.breedingPair.left);
        leftSlot.innerHTML = `<div class="slot-label">Left Parent</div><div>${parrot.name}</div>`;
    } else {
        leftSlot.innerHTML = `<div class="slot-label">Left Parent</div><div style="color: #ccc;">Empty</div>`;
    }

    if (state.breedingPair.right !== null) {
        const parrot = state.parrots.find(p => p.id === state.breedingPair.right);
        rightSlot.innerHTML = `<div class="slot-label">Right Parent</div><div>${parrot.name}</div>`;
    } else {
        rightSlot.innerHTML = `<div class="slot-label">Right Parent</div><div style="color: #ccc;">Empty</div>`;
    }

    // Enable breed button if both slots filled
    breedButton.disabled = !(state.breedingPair.left !== null && state.breedingPair.right !== null);
}

// Update action buttons for selected parrot
function updateActionButtons() {
    const actionSection = document.getElementById('topActionSection');
    const actionButtons = document.getElementById('actionButtons');

    if (!actionSection || !actionButtons) {
        console.warn('[Render] Action buttons container not found');
        return;
    }

    // Only show actions when viewing collection tab and a parrot is selected
    if (state.currentTab !== 'collection' || state.selectedParrotId === null || state.selectedParrotId === undefined) {
        actionSection.style.display = 'none';
        return;
    }

    const selectedParrot = state.parrots.find(p => p.id === state.selectedParrotId);
    if (!selectedParrot) {
        actionSection.style.display = 'none';
        return;
    }

    actionSection.style.display = 'block';

    // Build action buttons
    actionButtons.innerHTML = `
        <button class="btn" onclick="addToBreedingSlot('left', ${selectedParrot.id})" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 8px;">
            ⬅️ Breed Left
        </button>
        <button class="btn" onclick="addToBreedingSlot('right', ${selectedParrot.id})" style="background: #764ba2; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 8px;">
            ➡️ Breed Right
        </button>
        <button class="btn" onclick="sellParrot(${selectedParrot.id})" style="background: #ffc107; color: #333; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-right: 8px;">
            💵 Sell (${Math.floor(selectedParrot.getValue() * 0.6)} coins)
        </button>
        <button class="btn" onclick="openLaboratory(${selectedParrot.id})" style="background: #17a2b8; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔬 Laboratory
        </button>
    `;
}

// Select a parrot
function selectParrot(parrotId) {
    state.selectedParrotId = parrotId;

    // Add to breeding pair if not already in
    if (state.breedingPair.left === null) {
        state.breedingPair.left = parrotId;
    } else if (state.breedingPair.right === null && state.breedingPair.left !== parrotId) {
        state.breedingPair.right = parrotId;
    }

    updateUI();
}

// Add parrot to specific breeding slot
function addToBreedingSlot(slot, parrotId) {
    if (slot === 'left') {
        state.breedingPair.left = parrotId;
    } else if (slot === 'right') {
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
export { selectParrot, buyParrot, addToBreedingSlot };
