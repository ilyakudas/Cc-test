/**
 * ChromaWing Breeding Simulator - Selection Actions
 * Handles parrot selection for viewing
 */

import * as GameState from '../core/gameState.js';
import * as UI from '../ui.js';

/**
 * Select a parrot for viewing
 * @param {number} parrotId - Parrot ID
 */
export async function selectParrot(parrotId) {
    GameState.setSelectedParrotId(parrotId);
    await UI.updateUI();
    // Ensure action buttons reflect current breeding state
    await UI.updatePreview();
}
