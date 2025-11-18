/**
 * ChromaWing Breeding Simulator - Breeding Slots Module
 * Breeding slot management with Alpine.js reactive patterns
 */

import * as GameState from '../core/gameState.js';
import { generateParrotSVG } from '../lib/svg.js';
import { t } from '../lib/i18n.js';

/**
 * Render breeding slots (left and right parents)
 * Legacy function for non-Alpine implementations
 */
export async function renderBreedingSlots() {
    const leftSlotLarge = document.getElementById('breedSlotLeftLarge');
    const rightSlotLarge = document.getElementById('breedSlotRightLarge');
    const breedingPair = GameState.getBreedingPair();
    const parrots = GameState.getParrots();

    // Render left slot (large - breeding tab)
    if (leftSlotLarge) {
        if (breedingPair.left !== null) {
            const parrot = parrots.find(p => p.id === breedingPair.left);
            if (parrot) {
                const svg = await generateParrotSVG(parrot);
                const rarityTranslated = t(`rarity.${parrot.calculateRarity()}`);
                leftSlotLarge.className = 'breeding-slot-large filled';
                leftSlotLarge.innerHTML = `
                    <div class="slot-label">👈 ${t('breeding.leftParent')}</div>
                    <div class="parrot-display-large">${svg}</div>
                    <div class="parrot-name-large">${parrot.name}</div>
                    <div class="parrot-info-large">${t('common.generation')} ${parrot.generation} • ${rarityTranslated}</div>
                `;
            }
        } else {
            leftSlotLarge.className = 'breeding-slot-large';
            leftSlotLarge.innerHTML = `
                <div class="slot-label">👈 ${t('breeding.leftParent')}</div>
                <div style="color: #ccc; font-size: 0.9em;">${t('breeding.empty')}</div>
            `;
        }
    }

    // Render right slot (large - breeding tab)
    if (rightSlotLarge) {
        if (breedingPair.right !== null) {
            const parrot = parrots.find(p => p.id === breedingPair.right);
            if (parrot) {
                const svg = await generateParrotSVG(parrot);
                const rarityTranslated = t(`rarity.${parrot.calculateRarity()}`);
                rightSlotLarge.className = 'breeding-slot-large filled';
                rightSlotLarge.innerHTML = `
                    <div class="slot-label">${t('breeding.rightParent')} 👉</div>
                    <div class="parrot-display-large">${svg}</div>
                    <div class="parrot-name-large">${parrot.name}</div>
                    <div class="parrot-info-large">${t('common.generation')} ${parrot.generation} • ${rarityTranslated}</div>
                `;
            }
        } else {
            rightSlotLarge.className = 'breeding-slot-large';
            rightSlotLarge.innerHTML = `
                <div class="slot-label">${t('breeding.rightParent')} 👉</div>
                <div style="color: #ccc; font-size: 0.9em;">${t('breeding.empty')}</div>
            `;
        }
    }

    // Update heart button state
    updateHeartButton();
}

/**
 * Update breed button state
 */
export function updateBreedButton() {
    const btn = document.getElementById('breedButton');
    const btnLarge = document.getElementById('breedButtonLarge');
    const breedingPair = GameState.getBreedingPair();

    const bothSelected = breedingPair.left !== null && breedingPair.right !== null;

    if (btn) {
        btn.disabled = !bothSelected;
    }
    if (btnLarge) {
        btnLarge.disabled = !bothSelected;
    }
}

/**
 * Update heart button state (active when both parents selected)
 */
export function updateHeartButton() {
    const heartBtn = document.getElementById('heartButton');
    const breedingPair = GameState.getBreedingPair();

    if (heartBtn) {
        if (breedingPair.left !== null && breedingPair.right !== null) {
            heartBtn.classList.add('active');
        } else {
            heartBtn.classList.remove('active');
        }
    }
}

/**
 * Create Alpine.js reactive component for breeding slots
 * Follows Alpine.js reactive patterns with getters for state management
 * @returns {Object} Alpine.js component definition
 */
export function createBreedingSlotsComponent() {
    return {
        // Reactive getters - Alpine automatically tracks these
        get pair() {
            return GameState.getBreedingPair();
        },

        get canBreed() {
            return this.pair.left !== null && this.pair.right !== null;
        },

        // Get parrot data by ID
        getParrot(parrotId) {
            if (!parrotId) return null;
            const parrots = GameState.getParrots();
            return parrots.find(p => p.id === parrotId);
        },

        // Get parrot SVG for display
        async getParrotSVG(parrotId) {
            if (!parrotId) return '';
            const parrot = this.getParrot(parrotId);
            return parrot ? await generateParrotSVG(parrot) : '';
        },

        // Remove parrot from slot
        removeSlot(slot) {
            const pair = GameState.getBreedingPair();
            pair[slot] = null;
            GameState.setBreedingPair(pair);

            // Dispatch event for other components (like predictions)
            document.dispatchEvent(new CustomEvent('breeding-pair-changed'));

            // UI updates automatically via Alpine reactivity
        },

        // Navigate to breeding tab
        goToBreeding() {
            if (window.switchTabHandler) {
                window.switchTabHandler('breeding');
            }
        },

        // Initialize component
        init() {
            // Listen for external state changes (e.g., load game)
            document.addEventListener('game-state-changed', () => {
                this.$nextTick(() => {
                    // Force re-evaluation of getters
                });
            });
        }
    };
}
