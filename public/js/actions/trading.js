/**
 * ChromaWing Breeding Simulator - Trading Actions
 * Handles buying and selling parrots
 */

import * as GameState from '../core/gameState.js';
import { Parrot } from '../core/parrot.js';
import { showToast } from '../lib/notifications.js';
import { getRandomName, createParrotWithPurity } from '../lib/utils.js';
import * as UI from '../ui.js';
import { t } from '../lib/i18n.js';

// Sell hold timer tracking
let sellHoldTimer = null;

/**
 * Buy parrot from store
 * @param {number} parrotId - Parrot ID
 * @param {Function} saveGameFn - Save game function
 * @param {Function} checkAchievementsFn - Check achievements function
 */
export function buyParrot(parrotId, saveGameFn, checkAchievementsFn) {
    const storeParrots = GameState.getStoreParrots();
    const parrot = storeParrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const price = parrot.getValue();
    const coins = GameState.getCoins();
    if (coins < price) {
        return;
    }

    GameState.addCoins(-price);
    GameState.addParrot(parrot);
    GameState.removeStoreParrot(parrotId);

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

        const testParrot = new Parrot(
            getRandomName(),
            genes,
            1,
            GameState.getAndIncrementParrotIdCounter()
        );
        const actualRarity = testParrot.calculateRarity();

        // Accept if rarity matches or we're on last attempt
        if (actualRarity === oldRarity || attempts >= maxAttempts) {
            newParrot = testParrot;
        }
    }

    if (newParrot) {
        GameState.addStoreParrot(newParrot);
    }

    GameState.setSelectedParrotId(null);
    UI.updateUI();
    if (saveGameFn) saveGameFn();
    if (checkAchievementsFn) checkAchievementsFn(saveGameFn);

    // Show success toast
    const rarity = parrot.calculateRarity();
    showToast(
        t('toasts.parrotJoined.title', { name: parrot.name }),
        t('toasts.parrotJoined.message', { rarity: t(`rarity.${rarity}`), generation: parrot.generation, price }),
        'success'
    );
}

/**
 * Start hold-to-sell process
 * @param {number} parrotId - Parrot ID
 * @param {Event} event - Mouse/touch event
 * @param {Function} saveGameFn - Save game function
 */
export function startSellHold(parrotId, event, saveGameFn) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    // Check if parrot is locked
    if (GameState.isParrotLocked(parrotId)) {
        showToast(
            t('toasts.parrotLocked.title', { name: parrot.name }),
            t('toasts.parrotLocked.message'),
            'error',
            3000
        );
        return;
    }

    const button = event.target;
    const sellValue = Math.floor(parrot.getValue() * 0.7);
    const holdDuration = 1000; // 1 second
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
            GameState.addCoins(sellValue);
            GameState.removeParrot(parrotId);

            // Clear from breeding pair if present
            const breedingPair = GameState.getBreedingPair();
            if (breedingPair.left === parrotId) {
                GameState.setBreedingPair({ ...breedingPair, left: null });
            }
            if (breedingPair.right === parrotId) {
                GameState.setBreedingPair({ ...breedingPair, right: null });
            }
            GameState.setSelectedParrotId(null);

            UI.updateUI();
            if (saveGameFn) saveGameFn();

            // Show info toast
            showToast(
                t('toasts.parrotSold.title', { name: parrot.name }),
                t('toasts.parrotSold.message', { value: sellValue }),
                'success'
            );
        }
    }, 50);
}

/**
 * Cancel hold-to-sell process
 */
export function cancelSellHold() {
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
