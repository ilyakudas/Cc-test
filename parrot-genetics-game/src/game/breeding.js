// ChromaWing - Breeding Logic
// v3.0

import { Parrot } from '../models/Parrot.js';
import { state, addParrot, clearBreedingPair, addCoins } from './gameState.js';
import { getRandomName } from '../utils/naming.js';
import { breedBodyPartGenes } from '../utils/genetics.js';
import { BODY_PARTS, MUTATION_RATE } from '../data/constants.js';

// Breed two parrots
export async function breedParrots() {
    if (!state.breedingPair.left || !state.breedingPair.right) {
        alert('Please select two parrots to breed!');
        return;
    }

    const parent1 = state.parrots.find(p => p.id === state.breedingPair.left);
    const parent2 = state.parrots.find(p => p.id === state.breedingPair.right);

    if (!parent1 || !parent2) {
        alert('Error: Could not find parent parrots!');
        return;
    }

    // Breeding cost
    const breedingCost = 50;
    if (state.coins < breedingCost) {
        alert(`Need ${breedingCost} coins to breed!`);
        return;
    }

    state.coins -= breedingCost;

    // Create offspring
    const offspringGenes = {};

    for (const bodyPart of BODY_PARTS) {
        const parent1Part = parent1.genes[bodyPart];
        const parent2Part = parent2.genes[bodyPart];

        offspringGenes[bodyPart] = breedBodyPartGenes(
            parent1Part,
            parent2Part,
            state.mutationsEnabled,
            MUTATION_RATE
        );
    }

    // Create offspring
    const generation = Math.max(parent1.generation, parent2.generation) + 1;
    const offspring = new Parrot(getRandomName(), offspringGenes, generation);

    addParrot(offspring);

    // Show notification (if function exists)
    if (window.showToast) {
        window.showToast(
            `New parrot born: ${offspring.name}!`,
            `Generation ${generation} from ${parent1.name} × ${parent2.name}`,
            'success'
        );
    }

    // Clear breeding pair
    clearBreedingPair();

    // Update UI (if function exists)
    if (window.updateUI) {
        await window.updateUI();
    }

    return offspring;
}

// Sell a parrot
export function sellParrot(parrotId) {
    const parrot = state.parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const sellValue = Math.floor(parrot.getValue() * 0.5);

    if (state.parrots.length <= 1) {
        alert('Cannot sell your last parrot!');
        return;
    }

    if (!confirm(`Sell ${parrot.name} for ${sellValue} coins?`)) {
        return;
    }

    // Remove parrot and add coins
    state.parrots = state.parrots.filter(p => p.id !== parrotId);
    addCoins(sellValue);

    // Clear from breeding if selected
    if (state.breedingPair.left === parrotId) {
        state.breedingPair.left = null;
    }
    if (state.breedingPair.right === parrotId) {
        state.breedingPair.right = null;
    }

    // Update UI
    if (window.updateUI) {
        window.updateUI();
    }
}
