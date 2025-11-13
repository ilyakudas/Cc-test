/**
 * ChromaWing Breeding Simulator - UI Module
 * All UI rendering and display functions
 */

import * as GameState from './gameState.js';
import { generateParrotSVG } from './svg.js';
import { CONTEST_TIERS } from './constants.js';

/**
 * Rarity configuration for display
 */
const RARITY_CONFIG = {
    'common': { color: '#9e9e9e', label: 'Common' },
    'uncommon': { color: '#4caf50', label: 'Uncommon' },
    'rare': { color: '#2196f3', label: 'Rare' },
    'epic': { color: '#9c27b0', label: 'Epic' },
    'legendary': { color: '#ff9800', label: 'Legendary' }
};

/**
 * Switch between tabs (collection/store/contests)
 * @param {string} tab - Tab name
 * @param {Event} event - Click event
 * @param {Function} renderContestsFn - Function to render contests tab
 */
export function switchTab(tab, event, renderContestsFn) {
    GameState.setCurrentTab(tab);

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Hide all tabs
    document.getElementById('collectionTab').style.display = 'none';
    document.getElementById('storeTab').style.display = 'none';
    document.getElementById('breedingTab').style.display = 'none';
    document.getElementById('contestsTab').style.display = 'none';

    if (tab === 'collection') {
        document.getElementById('collectionTab').style.display = 'grid';
        document.getElementById('panelTitle').textContent = 'Your Parrots';
    } else if (tab === 'store') {
        document.getElementById('storeTab').style.display = 'grid';
        document.getElementById('panelTitle').textContent = 'Store - Buy Parrots';
    } else if (tab === 'breeding') {
        document.getElementById('breedingTab').style.display = 'block';
        document.getElementById('panelTitle').textContent = 'Breeding Laboratory';
        updateBreedingLab();
        return; // Don't call updateUI for breeding tab
    } else if (tab === 'contests') {
        document.getElementById('contestsTab').style.display = 'block';
        document.getElementById('panelTitle').textContent = 'Beauty Contests';
        if (renderContestsFn) {
            renderContestsFn();
        }
        return; // Don't call updateUI for contests tab
    }

    GameState.setSelectedParrotId(null);
    updateUI();
}

/**
 * Update entire UI (master update function)
 */
export async function updateUI() {
    updateStats();
    await renderParrotGrid();
    await renderBreedingSlots();
    await updatePreview();
}

/**
 * Update stats display (coins, parrot count, generation)
 */
export function updateStats() {
    document.getElementById('coinsDisplay').textContent = GameState.getCoins();
    document.getElementById('parrotCount').textContent = GameState.getParrots().length;
    document.getElementById('maxGen').textContent = GameState.getGeneration();
}

/**
 * Render parrot grid for collection and store tabs
 */
export async function renderParrotGrid() {
    const collectionGrid = document.getElementById('collectionTab');
    const storeGrid = document.getElementById('storeTab');

    collectionGrid.innerHTML = '';
    storeGrid.innerHTML = '';

    const parrots = GameState.getParrots();
    const storeParrots = GameState.getStoreParrots();

    for (const parrot of parrots) {
        const card = await createParrotCard(parrot, false);
        collectionGrid.appendChild(card);
    }

    for (const parrot of storeParrots) {
        const card = await createParrotCard(parrot, true);
        storeGrid.appendChild(card);
    }
}

/**
 * Create parrot card element
 * @param {Parrot} parrot - Parrot object
 * @param {boolean} isStore - Whether this is a store parrot
 * @returns {HTMLElement} Card element
 */
export async function createParrotCard(parrot, isStore) {
    const card = document.createElement('div');
    card.className = 'parrot-card';

    const selectedParrotId = GameState.getSelectedParrotId();
    if (selectedParrotId === parrot.id) {
        card.classList.add('selected');
    }

    const svg = await generateParrotSVG(parrot);
    const rarity = parrot.calculateRarity();
    const price = parrot.getValue();
    const breedingPair = GameState.getBreedingPair();

    // Check if parrot is in breeding slots
    let breedingIndicator = '';
    if (breedingPair.left === parrot.id) {
        breedingIndicator = '<div class="breeding-indicator breeding-left">L</div>';
    } else if (breedingPair.right === parrot.id) {
        breedingIndicator = '<div class="breeding-indicator breeding-right">R</div>';
    }

    // Check if parrot has been examined
    let examinedIndicator = '';
    if (!isStore && GameState.hasExaminedParrot(parrot.id)) {
        examinedIndicator = '<div class="examined-indicator" title="Lab Examined">🔬</div>';
    }

    // Check if parrot is locked
    let lockIndicator = '';
    if (!isStore && GameState.isParrotLocked(parrot.id)) {
        lockIndicator = '<div class="lock-indicator" title="Locked">🔒</div>';
    }

    const rarityInfo = RARITY_CONFIG[rarity];

    // Calculate beauty score for display
    const beauty = parrot.calculateBeauty();
    const beautyScore = beauty.score;

    // Beauty score color coding (cool to warm spectrum)
    let beautyColor = '#607d8b'; // Low: Blue-gray (cold)
    if (beautyScore >= 180) beautyColor = '#e91e63'; // Exceptional: Hot pink
    else if (beautyScore >= 130) beautyColor = '#ff5722'; // High: Deep orange
    else if (beautyScore >= 80) beautyColor = '#ffc107'; // Medium: Amber
    else if (beautyScore >= 40) beautyColor = '#00bcd4'; // Medium-low: Cyan

    // Trophy/contest indicators
    let trophyIndicator = '';
    if (!isStore) {
        const trophies = GameState.getParrotTrophies(parrot.id);
        if (trophies && trophies.length > 0) {
            const tierIcons = ['🎨', '🌈', '✨', '🎭', '👑'];

            trophyIndicator = '<div class="trophy-indicator">';
            trophies.forEach(trophy => {
                const tierIcon = tierIcons[trophy.tier] || '🏆';
                const suffix = trophy.placement === 1 ? 'st' : trophy.placement === 2 ? 'nd' : 'rd';
                trophyIndicator += `<span title="Tier ${trophy.tier + 1} - ${trophy.placement}${suffix}">${tierIcon}${trophy.badge}</span>`;
            });
            trophyIndicator += '</div>';
        }
    }

    card.innerHTML = `
        ${isStore ? `<div class="price">${price}💰</div>` : ''}
        ${breedingIndicator}
        ${examinedIndicator}
        ${lockIndicator}
        <div class="parrot-mini">${svg}</div>
        <div class="parrot-name">${parrot.name}</div>
        <div class="parrot-gen">Gen ${parrot.generation}</div>
        <div class="rarity-badge" style="background: ${rarityInfo.color};">${rarityInfo.label}</div>
        <div class="beauty-badge" style="background: ${beautyColor}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">Beauty: ${beautyScore}</div>
        ${parrot.hasAnyGradients() ? '<div class="gradient-indicator">✨ Gradient</div>' : ''}
        ${trophyIndicator}
    `;

    card.onclick = () => window.selectParrotHandler(parrot.id);

    return card;
}

/**
 * Render breeding slots (left and right parents)
 */
export async function renderBreedingSlots() {
    const leftSlotLarge = document.getElementById('breedSlotLeftLarge');
    const rightSlotLarge = document.getElementById('breedSlotRightLarge');
    const breedingPair = GameState.getBreedingPair();
    const parrots = GameState.getParrots();

    // Render left slot (large - breeding tab)
    if (leftSlotLarge) {
        if (breedingPair.left !== null) {
            const parrot = parrots.find(p => p.id === breedingPair.left);
            if (parrot) {
                const svg = await generateParrotSVG(parrot);
                leftSlotLarge.className = 'breeding-slot-large filled';
                leftSlotLarge.innerHTML = `
                    <div class="slot-label">Left Parent</div>
                    <div class="parrot-display-large">${svg}</div>
                    <div class="parrot-name-large">${parrot.name}</div>
                    <div class="parrot-info-large">Gen ${parrot.generation} • ${parrot.calculateRarity()}</div>
                `;
            }
        } else {
            leftSlotLarge.className = 'breeding-slot-large';
            leftSlotLarge.innerHTML = `
                <div class="slot-label">Left Parent</div>
                <div style="color: #ccc; font-size: 0.9em;">Select from Collection</div>
            `;
        }
    }

    // Render right slot (large - breeding tab)
    if (rightSlotLarge) {
        if (breedingPair.right !== null) {
            const parrot = parrots.find(p => p.id === breedingPair.right);
            if (parrot) {
                const svg = await generateParrotSVG(parrot);
                rightSlotLarge.className = 'breeding-slot-large filled';
                rightSlotLarge.innerHTML = `
                    <div class="slot-label">Right Parent</div>
                    <div class="parrot-display-large">${svg}</div>
                    <div class="parrot-name-large">${parrot.name}</div>
                    <div class="parrot-info-large">Gen ${parrot.generation} • ${parrot.calculateRarity()}</div>
                `;
            }
        } else {
            rightSlotLarge.className = 'breeding-slot-large';
            rightSlotLarge.innerHTML = `
                <div class="slot-label">Right Parent</div>
                <div style="color: #ccc; font-size: 0.9em;">Select from Collection</div>
            `;
        }
    }

    // Update heart button state
    updateHeartButton();
}

/**
 * Update breed button state
 */
export function updateBreedButton() {
    const btn = document.getElementById('breedButton');
    const btnLarge = document.getElementById('breedButtonLarge');
    const breedingPair = GameState.getBreedingPair();

    const bothSelected = breedingPair.left !== null && breedingPair.right !== null;

    if (btn) {
        btn.disabled = !bothSelected;
    }
    if (btnLarge) {
        btnLarge.disabled = !bothSelected;
    }
}

/**
 * Update heart button state (active when both parents selected)
 */
export function updateHeartButton() {
    const heartBtn = document.getElementById('heartButton');
    const breedingPair = GameState.getBreedingPair();

    if (heartBtn) {
        if (breedingPair.left !== null && breedingPair.right !== null) {
            heartBtn.classList.add('active');
        } else {
            heartBtn.classList.remove('active');
        }
    }
}

/**
 * Update the breeding lab tab content
 */
export async function updateBreedingLab() {
    await renderBreedingSlots();
    updateBreedButton();

    const breedingPair = GameState.getBreedingPair();
    const parrots = GameState.getParrots();

    // Show/hide compatibility and predictions sections
    if (breedingPair.left !== null && breedingPair.right !== null) {
        const leftParrot = parrots.find(p => p.id === breedingPair.left);
        const rightParrot = parrots.find(p => p.id === breedingPair.right);

        if (leftParrot && rightParrot) {
            renderCompatibility(leftParrot, rightParrot);
            renderPredictions(leftParrot, rightParrot);
        }
    } else {
        document.getElementById('compatibilitySection').style.display = 'none';
        document.getElementById('predictionsSection').style.display = 'none';
    }

    // Render recent offspring
    await renderRecentOffspring();
}

/**
 * Render recent offspring in the breeding lab
 */
async function renderRecentOffspring() {
    const grid = document.getElementById('recentOffspringGrid');
    const offspring = GameState.getRecentOffspring();

    console.log('Rendering recent offspring:', offspring.length);

    if (offspring.length === 0) {
        grid.innerHTML = '<div class="empty-state">Breed parrots to see your offspring here!</div>';
        return;
    }

    grid.innerHTML = '';

    // Add header with count
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = 'margin-bottom: 10px; font-weight: 600; color: #667eea;';
    headerDiv.textContent = `${offspring.length} chick${offspring.length !== 1 ? 's' : ''} waiting`;
    grid.appendChild(headerDiv);

    // Add button to move all to collection
    const actionBar = document.createElement('div');
    actionBar.style.cssText = 'margin-bottom: 15px; display: flex; gap: 10px; flex-wrap: wrap;';
    actionBar.innerHTML = `
        <button class="btn btn-breed" style="flex: 1; min-width: 140px; font-size: 0.9em;" onclick="window.moveOffspringToCollectionHandler()">
            📦 Move All (${offspring.length}) to Collection
        </button>
        <button class="btn btn-sell" style="flex: 1; min-width: 140px; font-size: 0.9em;" onclick="window.sellAllOffspringHandler()">
            💰 Sell All (${offspring.length})
        </button>
        <button class="btn btn-free" style="flex: 1; min-width: 140px; font-size: 0.9em;" onclick="window.dismissOffspringHandler()">
            ✖️ Dismiss All (${offspring.length})
        </button>
    `;
    grid.appendChild(actionBar);

    // Render offspring cards (selectable)
    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px;';

    for (const parrot of offspring) {
        const card = await createParrotCard(parrot, false);  // false = not store, show badges
        cardsContainer.appendChild(card);
    }

    grid.appendChild(cardsContainer);
}

/**
 * Render genetic compatibility information
 */
function renderCompatibility(leftParrot, rightParrot) {
    const section = document.getElementById('compatibilitySection');
    const info = document.getElementById('compatibilityInfo');

    section.style.display = 'block';

    // Calculate compatibility metrics
    const diversityScore = calculateGeneticDiversity(leftParrot, rightParrot);
    const generationDiff = Math.abs(leftParrot.generation - rightParrot.generation);

    info.innerHTML = `
        <div class="compatibility-stat">
            <span class="compatibility-label">🧬 Genetic Diversity</span>
            <span class="compatibility-value">${diversityScore}%</span>
        </div>
        <div class="compatibility-stat">
            <span class="compatibility-label">🔄 Generation Difference</span>
            <span class="compatibility-value">${generationDiff}</span>
        </div>
        <div class="compatibility-stat">
            <span class="compatibility-label">👶 Offspring Generation</span>
            <span class="compatibility-value">Gen ${Math.max(leftParrot.generation, rightParrot.generation) + 1}</span>
        </div>
    `;
}

/**
 * Calculate genetic diversity between two parrots
 */
function calculateGeneticDiversity(parrot1, parrot2) {
    let differences = 0;
    let total = 0;

    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
    const colors = ['red', 'green', 'blue'];

    bodyParts.forEach(part => {
        colors.forEach(color => {
            for (let i = 0; i < 4; i++) {
                if (parrot1.genes[part][color][i] !== parrot2.genes[part][color][i]) {
                    differences++;
                }
                total++;
            }
        });
        if (parrot1.genes[part].gradient !== parrot2.genes[part].gradient) {
            differences++;
        }
        total++;
    });

    return Math.round((differences / total) * 100);
}

/**
 * Render offspring predictions
 */
function renderPredictions(leftParrot, rightParrot) {
    const section = document.getElementById('predictionsSection');
    const info = document.getElementById('predictionsInfo');

    section.style.display = 'block';

    // Simple prediction calculations
    const avgBeauty = Math.round((leftParrot.calculateBeauty() + rightParrot.calculateBeauty()) / 2);
    const diversityScore = calculateGeneticDiversity(leftParrot, rightParrot);
    const mutationChance = GameState.getMutationsEnabled() ? 15 : 0;

    info.innerHTML = `
        <div class="predictions-grid">
            <div class="prediction-card">
                <div class="prediction-label">Expected Beauty</div>
                <div class="prediction-value">${avgBeauty}/100</div>
            </div>
            <div class="prediction-card">
                <div class="prediction-label">Diversity</div>
                <div class="prediction-value">${diversityScore > 50 ? 'High' : diversityScore > 25 ? 'Medium' : 'Low'}</div>
            </div>
            <div class="prediction-card">
                <div class="prediction-label">Mutation Chance</div>
                <div class="prediction-value">${mutationChance}%</div>
            </div>
        </div>
        <p style="margin-top: 15px; color: #666; font-size: 0.9em; text-align: center;">
            💡 Higher genetic diversity increases chances of unique offspring traits
        </p>
    `;
}

/**
 * Update preview panel with selected parrot details
 */
export async function updatePreview() {
    const previewDiv = document.getElementById('selectedPreview');
    const actionSection = document.getElementById('topActionSection');
    const selectedParrotId = GameState.getSelectedParrotId();
    const currentTab = GameState.getCurrentTab();

    if (selectedParrotId === null) {
        previewDiv.innerHTML = '<div class="empty-preview">Click a parrot to view details</div>';
        actionSection.style.display = 'none';
        return;
    }

    // Find the parrot
    const parrots = GameState.getParrots();
    const storeParrots = GameState.getStoreParrots();
    const recentOffspring = GameState.getRecentOffspring();

    let parrot = null;
    if (currentTab === 'collection') {
        parrot = parrots.find(p => p.id === selectedParrotId);
    } else if (currentTab === 'store') {
        parrot = storeParrots.find(p => p.id === selectedParrotId);
    } else if (currentTab === 'breeding') {
        // Check both collection and recent offspring for breeding tab
        parrot = parrots.find(p => p.id === selectedParrotId) || recentOffspring.find(p => p.id === selectedParrotId);
    }

    if (!parrot) return;

    const svg = await generateParrotSVG(parrot);
    const rarity = parrot.calculateRarity();
    const rarityInfo = RARITY_CONFIG[rarity];

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
    const coins = GameState.getCoins();

    if (currentTab === 'store') {
        const price = parrot.getValue();
        actionButtons.innerHTML = `
            <button class="btn btn-buy" onclick="window.buyParrotHandler(${parrot.id})" ${coins < price ? 'disabled' : ''}>
                💰 Buy for ${price} coins
            </button>
        `;
    } else {
        // Check if parrot is in recent offspring (not yet in collection)
        const isOffspring = recentOffspring.find(p => p.id === selectedParrotId);

        if (isOffspring) {
            // Limited actions for offspring (not yet in collection)
            actionButtons.innerHTML = `
                <button class="btn btn-lab" onclick="window.openLaboratoryHandler(${parrot.id})">
                    🔬 Examine in Laboratory
                </button>
                <button class="btn ${GameState.isParrotLocked(parrot.id) ? 'btn-free' : 'btn-lab'}" onclick="window.toggleLockParrotHandler(${parrot.id})">
                    ${GameState.isParrotLocked(parrot.id) ? '🔓 Unlock Parrot' : '🔒 Lock Parrot'}
                </button>
                <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
                    💡 Use "Move All to Collection" to enable breeding and contests
                </p>
            `;
        } else {
            // Full actions for collection parrots
            const sellValue = Math.floor(parrot.getValue() * 0.7);
            const breedingPair = GameState.getBreedingPair();
            const canBreed = breedingPair.left !== null && breedingPair.right !== null;

            actionButtons.innerHTML = `
                <button class="btn btn-breed-left" onclick="window.breedOnLeftHandler(${parrot.id})">
                    💕 Breed on Left
                </button>
                <button class="btn btn-breed ${canBreed ? 'active' : ''}"
                        onclick="window.switchTabHandler('breeding')"
                        ${!canBreed ? 'disabled' : ''}
                        title="${canBreed ? 'Go to Breeding Lab' : 'Select both parents first'}"
                        style="font-size: 1.6em; padding: 8px; min-width: auto; width: 50px;">
                    💕
                </button>
                <button class="btn btn-breed-right" onclick="window.breedOnRightHandler(${parrot.id})">
                    💕 Breed on Right
                </button>
                <button class="btn btn-lab" onclick="window.openLaboratoryHandler(${parrot.id})">
                    🔬 Examine in Laboratory
                </button>
                <button class="btn btn-contest" onclick="window.switchTabHandler('contests')">
                    🏆 Enter Beauty Contest
                </button>
                <button class="btn ${GameState.isParrotLocked(parrot.id) ? 'btn-free' : 'btn-lab'}" onclick="window.toggleLockParrotHandler(${parrot.id})">
                    ${GameState.isParrotLocked(parrot.id) ? '🔓 Unlock Parrot' : '🔒 Lock Parrot'}
                </button>
                <button class="btn btn-sell"
                        onmousedown="window.startSellHoldHandler(${parrot.id})"
                        onmouseup="window.cancelSellHoldHandler()"
                        onmouseleave="window.cancelSellHoldHandler()"
                        ontouchstart="window.startSellHoldHandler(${parrot.id})"
                        ontouchend="window.cancelSellHoldHandler()"
                        ontouchcancel="window.cancelSellHoldHandler()">
                    💰 Hold to Sell (${sellValue} coins)
                </button>
                <button class="btn btn-free" onclick="window.freeParrotHandler(${parrot.id})">
                    🕊️ Release to Wild
                </button>
            `;
        }
    }
}

/**
 * Update mutation display in stats bar
 */
export function updateMutationDisplay() {
    const statusEl = document.getElementById('mutationStatus');
    const iconEl = document.getElementById('mutationIcon');
    const mutationsEnabled = GameState.getMutationsEnabled();

    if (mutationsEnabled) {
        statusEl.textContent = 'ON';
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🧪';
    } else {
        statusEl.textContent = 'OFF';
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
    }
}
