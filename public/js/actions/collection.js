/**
 * ChromaWing Breeding Simulator - Collection Actions
 * Handles parrot collection management (freeing and locking)
 */

import * as GameState from '../core/gameState.js';
import { showToast } from '../lib/notifications.js';
import * as UI from '../ui.js';

/**
 * Free parrot (release to wild, no coins)
 * @param {number} parrotId - Parrot ID
 * @param {Function} saveGameFn - Save game function
 */
export function freeParrot(parrotId, saveGameFn) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    // Check if parrot is locked
    if (GameState.isParrotLocked(parrotId)) {
        showToast(
            `${parrot.name} is locked`,
            `Unlock the parrot first to release it`,
            'error',
            3000
        );
        return;
    }

    if (!confirm(`Release ${parrot.name} to the wild? You won't get any coins.`)) return;

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
        `${parrot.name} released`,
        `Set free to the wild`,
        'info'
    );
}

/**
 * Toggle lock status of a parrot to prevent selling/freeing
 * @param {number} parrotId - Parrot ID
 * @param {Function} saveGameFn - Save game function
 */
export async function toggleLockParrot(parrotId, saveGameFn) {
    const parrots = GameState.getParrots();
    const recentOffspring = GameState.getRecentOffspring();
    const parrot = parrots.find(p => p.id === parrotId) || recentOffspring.find(p => p.id === parrotId);
    if (!parrot) return;

    const isCurrentlyLocked = GameState.isParrotLocked(parrotId);

    if (isCurrentlyLocked) {
        GameState.removeLockedParrot(parrotId);
        showToast(
            `${parrot.name} unlocked`,
            `Can now be sold or released`,
            'info'
        );
    } else {
        GameState.addLockedParrot(parrotId);
        showToast(
            `${parrot.name} locked`,
            `Protected from selling and releasing`,
            'success'
        );
    }

    await UI.updateUI();

    // Also update breeding lab if we're on that tab
    if (GameState.getCurrentTab() === 'breeding') {
        await UI.updateBreedingLab();
    }

    if (saveGameFn) saveGameFn();
}
