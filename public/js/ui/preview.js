/**
 * ChromaWing Breeding Simulator - Preview Module
 * Preview panel with selected parrot details and action buttons
 */

import * as GameState from '../core/gameState.js';
import { generateParrotSVG } from '../lib/svg.js';
import { t } from '../lib/i18n.js';

/**
 * Rarity configuration for display
 */
const RARITY_CONFIG = {
    'common': { color: '#9e9e9e', labelKey: 'rarity.common' },
    'uncommon': { color: '#4caf50', labelKey: 'rarity.uncommon' },
    'rare': { color: '#2196f3', labelKey: 'rarity.rare' },
    'epic': { color: '#9c27b0', labelKey: 'rarity.epic' },
    'legendary': { color: '#ff9800', labelKey: 'rarity.legendary' }
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
        previewDiv.innerHTML = `<div class="empty-preview">${t('panel.clickToView')}</div>`;
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
            <span style="color: #666;">${t('common.generation')} ${parrot.generation}</span><br>
            <span class="rarity-badge" style="background: ${rarityInfo.color}; display: inline-block; margin-top: 5px;">${t(rarityInfo.labelKey)}</span>
            ${parrot.hasAnyGradients() ? `<br><span style="color: #9c27b0; font-weight: bold;">✨ ${t('beauty.traits')}</span>` : ''}
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
                💰 ${t('common.buy')} (${price} ${t('common.coins').toLowerCase()})
            </button>
        `;
    } else {
        // Check if parrot is in recent offspring (not yet in collection)
        const isOffspring = recentOffspring.find(p => p.id === selectedParrotId);

        if (isOffspring) {
            // Limited actions for offspring (not yet in collection)
            const isLocked = GameState.isParrotLocked(parrot.id);
            actionButtons.innerHTML = `
                <button class="btn btn-lab" onclick="window.openLaboratoryHandler(${parrot.id})">
                    <span class="btn-icon">🔬</span>
                    <span class="btn-text">${t('actions.examine')}</span>
                </button>
                <button class="btn ${isLocked ? 'btn-free' : 'btn-lab'}" onclick="window.toggleLockParrotHandler(${parrot.id})">
                    <span class="btn-icon">${isLocked ? '🔓' : '🔒'}</span>
                    <span class="btn-text">${isLocked ? t('common.locked') : t('actions.lock')}</span>
                </button>
                <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
                    💡 ${t('actions.moveToCollection')}
                </p>
            `;
        } else {
            // Full actions for collection parrots
            const sellValue = Math.floor(parrot.getValue() * 0.7);
            const breedingPair = GameState.getBreedingPair();
            const canBreed = breedingPair.left !== null && breedingPair.right !== null;
            const isLocked = GameState.isParrotLocked(parrot.id);

            actionButtons.innerHTML = `
                <button class="btn btn-breed-left" onclick="window.breedOnLeftHandler(${parrot.id})">
                    <span class="btn-icon">💕👈</span>
                    <span class="btn-text">${t('actions.breedLeft')}</span>
                </button>
                <button class="btn btn-breed ${canBreed ? 'active' : ''}"
                        onclick="window.switchTabHandler('breeding')"
                        ${!canBreed ? 'disabled' : ''}
                        title="${canBreed ? t('tabs.breeding') : t('panel.selectTwoToBreed')}"
                        style="font-size: 1.6em; padding: 8px; min-width: auto; width: 50px;">
                    💕
                </button>
                <button class="btn btn-breed-right" onclick="window.breedOnRightHandler(${parrot.id})">
                    <span class="btn-text">${t('actions.breedRight')}</span>
                    <span class="btn-icon">👉💕</span>
                </button>
                <button class="btn btn-lab" onclick="window.openLaboratoryHandler(${parrot.id})">
                    <span class="btn-icon">🔬</span>
                    <span class="btn-text">${t('actions.examine')}</span>
                </button>
                <button class="btn btn-contest" onclick="window.switchTabHandler('contests')">
                    <span class="btn-icon">🏆</span>
                    <span class="btn-text">${t('tabs.contests')}</span>
                </button>
                <button class="btn ${isLocked ? 'btn-free' : 'btn-lab'}" onclick="window.toggleLockParrotHandler(${parrot.id})">
                    <span class="btn-icon">${isLocked ? '🔓' : '🔒'}</span>
                    <span class="btn-text">${isLocked ? t('common.locked') : t('actions.lock')}</span>
                </button>
                <button class="btn btn-sell"
                        onmousedown="window.startSellHoldHandler(${parrot.id})"
                        onmouseup="window.cancelSellHoldHandler()"
                        onmouseleave="window.cancelSellHoldHandler()"
                        ontouchstart="window.startSellHoldHandler(${parrot.id})"
                        ontouchend="window.cancelSellHoldHandler()"
                        ontouchcancel="window.cancelSellHoldHandler()">
                    <span class="btn-icon">💰</span>
                    <span class="btn-text">${t('common.sell')} (${sellValue} ${t('common.coins').toLowerCase()})</span>
                </button>
                <button class="btn btn-free" onclick="window.freeParrotHandler(${parrot.id})">
                    <span class="btn-icon">🕊️</span>
                    <span class="btn-text">${t('actions.free')}</span>
                </button>
            `;
        }
    }
}
