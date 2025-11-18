/**
 * ChromaWing Breeding Simulator - Settings Actions
 * Handles game settings (mutations and auto-examine)
 */

import * as GameState from '../core/gameState.js';
import { showToast } from '../lib/notifications.js';
import { t } from '../lib/i18n.js';

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
        statusEl.textContent = t('common.on');
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🧪';
        showToast(
            t('toasts.mutationsEnabled.title'),
            t('toasts.mutationsEnabled.message'),
            'success',
            3000
        );
    } else {
        statusEl.textContent = t('common.off');
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
        showToast(
            t('toasts.mutationsDisabled.title'),
            t('toasts.mutationsDisabled.message'),
            'info',
            3000
        );
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
        statusEl.textContent = t('common.on');
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🔬';
        showToast(
            t('toasts.autoExamEnabled.title'),
            t('toasts.autoExamEnabled.message'),
            'success',
            3000
        );
    } else {
        statusEl.textContent = t('common.off');
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
        showToast(
            t('toasts.autoExamDisabled.title'),
            t('toasts.autoExamDisabled.message'),
            'info',
            3000
        );
    }

    if (saveGameFn) saveGameFn();
}
