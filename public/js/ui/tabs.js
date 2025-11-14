/**
 * ChromaWing Breeding Simulator - Tabs Module
 * Tab navigation and breeding lab functionality
 */

import * as GameState from '../core/gameState.js';
import { updateUI } from './core.js';
import { renderBreedingSlots, updateBreedButton } from './breedingSlots.js';
import { createParrotCard } from './parrotCard.js';
import { generateParrotSVG } from '../lib/svg.js';

/**
 * Switch between tabs (collection/store/breeding/contests)
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
    document.getElementById('galleryTab').style.display = 'none';
    document.getElementById('colorLabTab').style.display = 'none';

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
    } else if (tab === 'gallery') {
        document.getElementById('galleryTab').style.display = 'block';
        document.getElementById('panelTitle').textContent = 'Parrot Gallery';
        return; // Don't call updateUI for gallery tab (handled by Alpine.js)
    } else if (tab === 'colorlab') {
        document.getElementById('colorLabTab').style.display = 'block';
        document.getElementById('panelTitle').textContent = 'Color Lab - Gene Editor';
        return; // Don't call updateUI for color lab tab (handled by Alpine.js)
    }

    GameState.setSelectedParrotId(null);
    updateUI();
}

/**
 * Update the breeding lab tab content
 */
export async function updateBreedingLab() {
    await renderBreedingSlots();
    updateBreedButton();

    const breedingPair = GameState.getBreedingPair();
    const parrots = GameState.getParrots();

    // Show/hide compatibility section
    if (breedingPair.left !== null && breedingPair.right !== null) {
        const leftParrot = parrots.find(p => p.id === breedingPair.left);
        const rightParrot = parrots.find(p => p.id === breedingPair.right);

        if (leftParrot && rightParrot) {
            renderCompatibility(leftParrot, rightParrot);
            // Predictions are now handled by Alpine.js component
        }
    } else {
        document.getElementById('compatibilitySection').style.display = 'none';
        // Predictions visibility handled by Alpine.js x-show
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

