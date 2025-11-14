/**
 * ChromaWing Breeding Simulator - Settings Actions
 * Handles game settings (mutations and auto-examine)
 */

import * as GameState from '../core/gameState.js';
import { showToast } from '../lib/notifications.js';

/**
 * Toggle mutations on/off
 * @param {Function} saveGameFn - Save game function
 */
export function toggleMutations(saveGameFn) {
    const mutationsEnabled = GameState.getMutationsEnabled();
    GameState.setMutationsEnabled(!mutationsEnabled);

    const newState = GameState.getMutationsEnabled();
    const statusEl = document.getElementById('mutationStatus');
    const iconEl = document.getElementById('mutationIcon');

    if (newState) {
        statusEl.textContent = 'ON';
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🧪';
        showToast('Mutations Enabled', 'Breeding can introduce new genes', 'success', 3000);
    } else {
        statusEl.textContent = 'OFF';
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
        showToast('Mutations Disabled', 'Breeding will preserve pure genes', 'info', 3000);
    }

    if (saveGameFn) saveGameFn();
}

/**
 * Toggle auto-examine setting
 * @param {Function} saveGameFn - Save game function
 */
export function toggleAutoExamine(saveGameFn) {
    const enabled = GameState.toggleAutoExamineEnabled();

    // Update UI
    const statusEl = document.getElementById('autoExamineStatus');
    const iconEl = document.getElementById('autoExamineIcon');

    if (enabled) {
        statusEl.textContent = 'ON';
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🔬';
        showToast('Auto-Examine Enabled', 'New offspring will be automatically examined if you have enough coins', 'success', 3000);
    } else {
        statusEl.textContent = 'OFF';
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
        showToast('Auto-Examine Disabled', 'You must manually examine offspring', 'info', 3000);
    }

    if (saveGameFn) saveGameFn();
}
