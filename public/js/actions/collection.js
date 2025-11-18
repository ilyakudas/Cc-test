/**
 * ChromaWing Breeding Simulator - Collection Actions
 * Handles parrot collection management (freeing and locking)
 */

import * as GameState from '../core/gameState.js';
import { showToast } from '../lib/notifications.js';
import * as UI from '../ui.js';

/**
 * Free parrot (now redirects to Wild Mate release system)
 * @param {number} parrotId - Parrot ID
 * @param {Function} saveGameFn - Save game function
 */
export async function freeParrot(parrotId, saveGameFn) {
    // Import and use the new Wild Mate release system
    const { releaseParrot } = await import('./wildMate.js');
    releaseParrot(parrotId, saveGameFn);
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
