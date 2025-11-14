/**
 * ChromaWing Breeding Simulator - Mutations Module
 * Mutation display functionality
 */

import * as GameState from '../gameState.js';

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
