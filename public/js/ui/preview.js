/**
 * ChromaWing Breeding Simulator - Preview Module
 * Preview panel with selected parrot details and action buttons
 */

import * as GameState from '../core/gameState.js';
import { generateParrotSVG } from '../lib/svg.js';

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
                    <span class="btn-icon">👈</span>
                    <span class="btn-text">Breed on Left</span>
                </button>
                <button class="btn btn-breed ${canBreed ? 'active' : ''}"
                        onclick="window.switchTabHandler('breeding')"
                        ${!canBreed ? 'disabled' : ''}
                        title="${canBreed ? 'Go to Breeding Lab' : 'Select both parents first'}"
                        style="font-size: 1.6em; padding: 8px; min-width: auto; width: 50px;">
                    💕
                </button>
                <button class="btn btn-breed-right" onclick="window.breedOnRightHandler(${parrot.id})">
                    <span class="btn-text">Breed on Right</span>
                    <span class="btn-icon">👉</span>
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
