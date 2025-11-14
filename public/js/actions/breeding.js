/**
 * ChromaWing Breeding Simulator - Breeding Actions
 * Handles breeding pair management and breeding process
 */

import * as GameState from '../core/gameState.js';
import { Parrot } from '../core/parrot.js';
import { breedParrotGenes } from '../core/genetics.js';
import { showToast } from '../lib/notifications.js';
import { getRandomName } from '../lib/utils.js';
import * as UI from '../ui.js';

/**
 * Add parrot to left breeding slot
 * @param {number} parrotId - Parrot ID
 */
export async function breedOnLeft(parrotId) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const breedingPair = GameState.getBreedingPair();
    // Prevent selecting the same parrot in both slots
    if (breedingPair.right === parrotId) {
        return;
    }

    GameState.setBreedingPair({ ...breedingPair, left: parrotId });
    await UI.renderBreedingSlots();
    await UI.renderParrotGrid(); // Refresh cards to show L/R badges immediately
    UI.updateBreedButton();

    // Refresh action buttons to update heart button state
    await UI.updatePreview();
}

/**
 * Add parrot to right breeding slot
 * @param {number} parrotId - Parrot ID
 */
export async function breedOnRight(parrotId) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const breedingPair = GameState.getBreedingPair();
    // Prevent selecting the same parrot in both slots
    if (breedingPair.left === parrotId) {
        return;
    }

    GameState.setBreedingPair({ ...breedingPair, right: parrotId });
    await UI.renderBreedingSlots();
    await UI.renderParrotGrid(); // Refresh cards to show L/R badges immediately
    UI.updateBreedButton();

    // Refresh action buttons to update heart button state
    await UI.updatePreview();
}

/**
 * Remove parrot from breeding slot
 * @param {string} slot - 'left' or 'right'
 */
export async function removeFromSlot(slot) {
    const breedingPair = GameState.getBreedingPair();
    breedingPair[slot] = null;
    GameState.setBreedingPair(breedingPair);
    await UI.renderBreedingSlots();
    UI.updateBreedButton();

    // Refresh action buttons to update heart button state
    await UI.updatePreview();
}

/**
 * Breed parrots and create offspring
 * @param {Function} saveGameFn - Save game function
 * @param {Function} checkAchievementsFn - Check achievements function
 */
export async function breedParrots(saveGameFn, checkAchievementsFn) {
    const breedingPair = GameState.getBreedingPair();
    if (breedingPair.left === null || breedingPair.right === null) return;

    const parrots = GameState.getParrots();
    const parent1 = parrots.find(p => p.id === breedingPair.left);
    const parent2 = parrots.find(p => p.id === breedingPair.right);

    if (!parent1 || !parent2) return;

    // Check if player has enough coins (breeding costs 50 coins)
    const BREEDING_COST = 50;
    let coins = GameState.getCoins();
    if (coins < BREEDING_COST) {
        showToast(
            `Not enough coins!`,
            `Breeding costs ${BREEDING_COST} coins. You have ${coins}.`,
            'error',
            3000
        );
        return;
    }

    // Disable breed button to prevent double-clicking
    const breedBtn = document.getElementById('breedButton');
    const breedBtnLarge = document.getElementById('breedButtonLarge');
    if (breedBtn) breedBtn.disabled = true;
    if (breedBtnLarge) breedBtnLarge.disabled = true;

    // Deduct breeding cost
    GameState.addCoins(-BREEDING_COST);
    coins = GameState.getCoins(); // Update coins after breeding cost

    // Generate 4 offspring
    const offspring = [];
    for (let i = 0; i < 4; i++) {
        const childGenes = breedParrotGenes(parent1.genes, parent2.genes);
        const childGen = Math.max(parent1.generation, parent2.generation) + 1;

        // Update generation tracker
        const currentGen = GameState.getGeneration();
        if (childGen > currentGen) {
            GameState.setGeneration(childGen);
        }

        const child = new Parrot(
            getRandomName(),
            childGenes,
            childGen,
            GameState.getAndIncrementParrotIdCounter()
        );
        offspring.push(child);
    }

    // Auto-examine offspring if enabled
    const autoExamineEnabled = GameState.getAutoExamineEnabled();
    const EXAM_COST = 100;
    let examineCount = 0;
    let examineMessage = '';

    if (autoExamineEnabled && offspring.length > 0) {
        const maxExaminations = Math.min(offspring.length, Math.floor(coins / EXAM_COST));

        for (let i = 0; i < maxExaminations; i++) {
            GameState.addCoins(-EXAM_COST);
            GameState.addExaminedParrot(offspring[i].id);
            examineCount++;
        }

        if (examineCount > 0) {
            examineMessage = ` ${examineCount} examined (-${examineCount * EXAM_COST} coins).`;
        } else {
            examineMessage = ` Auto-exam: Need ${EXAM_COST} coins per chick.`;
        }
    }

    // Add offspring to recent offspring list (shown in breeding lab)
    // Append to existing offspring instead of replacing them
    offspring.forEach(child => GameState.addRecentOffspring(child));

    // Clear breeding pair
    GameState.setBreedingPair({ left: null, right: null });

    // Update UI
    await UI.updateUI();

    // Update breeding lab if we're on the breeding tab
    if (GameState.getCurrentTab() === 'breeding') {
        await UI.updateBreedingLab();
    }

    // Re-enable breed buttons
    if (breedBtn) breedBtn.disabled = false;
    if (breedBtnLarge) breedBtnLarge.disabled = false;

    if (saveGameFn) saveGameFn();
    if (checkAchievementsFn) checkAchievementsFn(saveGameFn);

    // Show success toast with total offspring count
    const totalOffspring = GameState.getRecentOffspring().length;
    showToast(
        `Breeding successful!`,
        `4 new chicks born!${examineMessage} ${totalOffspring} total waiting in Breeding Lab.`,
        'success',
        6000
    );

    console.log('Breeding complete:', offspring.length, 'offspring created, examined:', examineCount, 'total waiting:', totalOffspring);
}
