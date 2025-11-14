/**
 * ChromaWing Breeding Simulator - Offspring Actions
 * Handles offspring management (moving to collection, selling, dismissing)
 */

import * as GameState from '../core/gameState.js';
import { showToast } from '../lib/notifications.js';
import * as UI from '../ui.js';

/**
 * Move all recent offspring to collection
 */
export async function moveOffspringToCollection(saveGameFn) {
    const offspring = GameState.getRecentOffspring();
    if (offspring.length === 0) return;

    GameState.moveRecentOffspringToCollection();
    await UI.updateUI();
    await UI.updateBreedingLab();

    if (saveGameFn) saveGameFn();

    showToast(
        `Moved to collection!`,
        `${offspring.length} parrots added to your collection`,
        'success',
        3000
    );
}

/**
 * Sell all recent offspring (excluding locked ones)
 */
export async function sellAllOffspring(saveGameFn) {
    const offspring = GameState.getRecentOffspring();
    if (offspring.length === 0) return;

    // Separate locked and unlocked offspring
    const unlockedOffspring = offspring.filter(p => !GameState.isParrotLocked(p.id));
    const lockedCount = offspring.length - unlockedOffspring.length;

    if (unlockedOffspring.length === 0) {
        showToast(
            'Cannot sell offspring',
            `All ${offspring.length} offspring are locked. Unlock them first to sell.`,
            'error',
            3000
        );
        return;
    }

    // Calculate total value of unlocked offspring
    let totalValue = 0;
    unlockedOffspring.forEach(parrot => {
        totalValue += parrot.getValue();
    });

    // Add coins
    GameState.addCoins(totalValue);

    // Remove only the unlocked offspring
    unlockedOffspring.forEach(parrot => {
        GameState.removeRecentOffspring(parrot.id);
    });

    await UI.updateStats();
    await UI.updateBreedingLab();

    if (saveGameFn) saveGameFn();

    const message = lockedCount > 0
        ? `${unlockedOffspring.length} sold for ${totalValue} coins. ${lockedCount} locked offspring kept.`
        : `${unlockedOffspring.length} parrot${unlockedOffspring.length !== 1 ? 's' : ''} sold for ${totalValue} coins`;

    showToast(
        `Offspring sold!`,
        message,
        'success',
        4000
    );
}

/**
 * Dismiss all recent offspring (excluding locked ones)
 */
export async function dismissOffspring(saveGameFn) {
    const offspring = GameState.getRecentOffspring();
    if (offspring.length === 0) return;

    // Separate locked and unlocked offspring
    const unlockedOffspring = offspring.filter(p => !GameState.isParrotLocked(p.id));
    const lockedCount = offspring.length - unlockedOffspring.length;

    if (unlockedOffspring.length === 0) {
        showToast(
            'Cannot dismiss offspring',
            `All ${offspring.length} offspring are locked. Unlock them first to dismiss.`,
            'error',
            3000
        );
        return;
    }

    // Remove only the unlocked offspring
    unlockedOffspring.forEach(parrot => {
        GameState.removeRecentOffspring(parrot.id);
    });

    await UI.updateBreedingLab();

    if (saveGameFn) saveGameFn();

    const message = lockedCount > 0
        ? `${unlockedOffspring.length} dismissed. ${lockedCount} locked offspring kept.`
        : `${unlockedOffspring.length} parrot${unlockedOffspring.length !== 1 ? 's' : ''} released into the wild`;

    showToast(
        `Offspring dismissed`,
        message,
        'info',
        3000
    );
}
