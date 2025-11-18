/**
 * ChromaWing Breeding Simulator - Wild Mate UI Module
 * Rendering for wild mate system
 */

import * as GameState from '../core/gameState.js';
import { Parrot } from '../core/parrot.js';
import { generateParrotSVG } from '../lib/svg.js';
import { getGenePoolStats, calculateSearchCost } from '../actions/wildMate.js';
import {
    calculatePoolQuality,
    calculatePoolDiversity,
    calculateFrequency
} from '../lib/wildMate.js';

/**
 * Render the Wild Mate tab
 */
export async function renderWildMateTab() {
    const tab = document.getElementById('wildMateTab');
    if (!tab) return;

    const stats = getGenePoolStats();

    let html = `
        <div class="wild-mate-container">
            <!-- Gene Pool Dashboard -->
            <div class="gene-pool-dashboard">
                <h4>📊 Wild Gene Pool Status</h4>
                ${renderGenePoolDashboard(stats)}
            </div>

            <!-- Action Menu (populated when parrot is selected) -->
            <div id="wildMateActions" class="wild-mate-actions-top"></div>

            <!-- Parrot Grid (uses standard parrot cards) -->
            <div id="wildMateParrotGrid" class="parrot-grid"></div>
        </div>
    `;

    tab.innerHTML = html;

    // Render parrot grid using standard cards
    await renderWildMateParrotGrid();

    // Update action buttons for selected parrot
    updateWildMateActions();
}

/**
 * Render gene pool dashboard
 */
function renderGenePoolDashboard(stats) {
    if (!stats.exists) {
        return `
            <div class="pool-summary" style="color: #718096; font-style: italic;">
                No parrots released yet. Release parrots to build the gene pool and earn 🌿 credits!
            </div>
        `;
    }

    const qualityClass = stats.quality >= 0.7 ? 'excellent' : stats.quality >= 0.5 ? 'good' : 'poor';
    const diversityClass = stats.diversityPercent >= 60 ? 'high' : stats.diversityPercent >= 30 ? 'medium' : 'low';

    return `
        <div class="gene-pool-stats-compact">
            <div class="pool-summary">
                <strong>Pool:</strong> ${'⭐'.repeat(stats.qualityStars)} ${(stats.quality * 100).toFixed(0)}%
                <span class="stat-divider">•</span>
                <strong>Diversity:</strong> ${stats.diversityPercent}%
                <span class="stat-divider">•</span>
                <strong>Released:</strong> ${stats.releasesCount} parrots
                <span class="stat-divider">•</span>
                <strong>Credits:</strong> ${GameState.getConservationCredits()} 🌿
            </div>
        </div>
    `;
}

/**
 * Render parrot grid using standard parrot cards
 */
async function renderWildMateParrotGrid() {
    const grid = document.getElementById('wildMateParrotGrid');
    if (!grid) return;

    const parrots = GameState.getParrots();

    if (parrots.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No parrots in your collection</p></div>';
        return;
    }

    // Clear grid
    grid.innerHTML = '';

    // Import and use standard parrot card
    const { createParrotCard } = await import('./parrotCard.js');

    // Render each parrot using standard card
    for (const parrot of parrots) {
        const card = await createParrotCard(parrot, false);
        grid.appendChild(card);
    }
}

/**
 * Update action buttons for selected parrot
 */
export function updateWildMateActions() {
    const actionsDiv = document.getElementById('wildMateActions');
    if (!actionsDiv) return;

    const selectedParrotId = GameState.getSelectedParrotId();
    if (!selectedParrotId) {
        actionsDiv.innerHTML = '<p style="color: #666; text-align: center; padding: 12px;">Select a parrot to see available actions</p>';
        return;
    }

    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === selectedParrotId);
    if (!parrot) {
        actionsDiv.innerHTML = '';
        return;
    }

    const stats = getGenePoolStats();
    const isLocked = GameState.isParrotLocked(parrot.id);
    const hasFoundMate = parrot.hasFoundWildMate;
    const searchCost = calculateSearchCost(parrot);
    const credits = GameState.getConservationCredits();

    let html = `
        <div class="action-buttons-horizontal">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
    `;

    // Release button
    if (isLocked) {
        html += `
            <button class="btn" disabled title="Unlock parrot to release">
                🔒 Locked - Cannot Release
            </button>
        `;
    } else {
        html += `
            <button class="btn btn-free" onclick="releaseParrotHandler(${parrot.id})">
                🌿 Release to Wild
            </button>
        `;
    }

    // Find mate button
    if (hasFoundMate) {
        html += `
            <button class="btn" disabled title="This parrot has already found a wild mate">
                ✓ Wild Mate Already Found
            </button>
        `;
    } else if (!stats.exists) {
        html += `
            <button class="btn" disabled title="Release parrots first to build gene pool">
                🔍 Find Wild Mate (Pool Empty)
            </button>
        `;
    } else {
        const canAfford = credits >= searchCost;
        html += `
            <button class="btn btn-breed"
                    onclick="findWildMateHandler(${parrot.id})"
                    ${canAfford ? '' : 'disabled'}
                    title="${canAfford ? `Search for wild mate (${searchCost} 🌿)` : `Need ${searchCost} 🌿 credits`}">
                🔍 Find Wild Mate (${searchCost} 🌿)
            </button>
        `;
    }

    html += `
            </div>
        </div>
    `;

    actionsDiv.innerHTML = html;
}

/**
 * Show mate selection modal
 */
export async function showMateSelectionModal(searchingParrot, mates, searchCost) {
    const { createParrotCard } = await import('./parrotCard.js');

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'wildMateModal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content wild-mate-modal-content';

    modalContent.innerHTML = `
        <span class="modal-close" onclick="closeMateModalHandler()">&times;</span>
        <div class="mate-selection-container">
            <h2>🔍 Wild Mates Found!</h2>
            <p>Found ${mates.length} potential mates for <strong>${searchingParrot.name}</strong></p>
            <div class="mate-options-grid parrot-grid"></div>
            <div class="mate-modal-actions">
                <button class="btn btn-cancel" onclick="cancelMateSearchHandler(${searchCost})">
                    ✖ Cancel (Refund 50%)
                </button>
            </div>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Populate grid with standard parrot cards
    const grid = modalContent.querySelector('.mate-options-grid');
    for (let i = 0; i < mates.length; i++) {
        const mate = mates[i];
        const card = await createParrotCard(mate, false);

        // Replace the default click handler with mate selection
        card.onclick = null;

        // Add select button below the card
        const selectButton = document.createElement('button');
        selectButton.className = 'btn btn-primary';
        selectButton.style.width = '100%';
        selectButton.style.marginTop = '8px';
        selectButton.textContent = '✓ Select This Mate';
        selectButton.onclick = () => window.selectMateHandler(searchingParrot.id, i);

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'mate-card-wrapper';
        cardWrapper.appendChild(card);
        cardWrapper.appendChild(selectButton);

        grid.appendChild(cardWrapper);
    }

    // Store mates in window for access
    window.currentMateOptions = mates;
}

/**
 * Close mate selection modal
 */
export function closeMateSelectionModal() {
    const modal = document.getElementById('wildMateModal');
    if (modal) {
        modal.remove();
    }
    window.currentMateOptions = null;
}
