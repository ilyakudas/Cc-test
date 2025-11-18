/**
 * ChromaWing Breeding Simulator - Mutations Module
 * Mutation and settings display functionality
 */

import * as GameState from '../core/gameState.js';
import { t } from '../lib/i18n.js';

/**
 * Update mutation display in stats bar
 */
export function updateMutationDisplay() {
    const statusEl = document.getElementById('mutationStatus');
    const iconEl = document.getElementById('mutationIcon');
    const mutationsEnabled = GameState.getMutationsEnabled();

    if (mutationsEnabled) {
        statusEl.textContent = t('common.on');
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🧪';
    } else {
        statusEl.textContent = t('common.off');
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
    }
}

/**
 * Update auto-examine display in stats bar
 */
export function updateAutoExamDisplay() {
    const statusEl = document.getElementById('autoExamineStatus');
    const iconEl = document.getElementById('autoExamineIcon');
    const autoExamEnabled = GameState.getAutoExamineEnabled();

    if (autoExamEnabled) {
        statusEl.textContent = t('common.on');
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🔬';
    } else {
        statusEl.textContent = t('common.off');
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
    }
}
