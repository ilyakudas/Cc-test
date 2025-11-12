/**
 * ChromaWing Breeding Simulator - Genetics Module
 * Breeding functions and genetic operations
 */

import { getMutationsEnabled, getMutationRate } from './gameState.js';

/**
 * Breed a single body part from two parent parts
 * Implements Mendelian inheritance with optional mutations
 * @param {Object} part1 - First parent's body part genes
 * @param {Object} part2 - Second parent's body part genes
 * @returns {Object} Child body part genes
 */
export function breedBodyPart(part1, part2) {
    const childPart = {
        red: [],
        green: [],
        blue: [],
        gradient: Math.random() < 0.5 ? part1.gradient : part2.gradient
    };

    for (let i = 0; i < 4; i++) {
        // Inherit from parent
        let redAllele = Math.random() < 0.5 ? part1.red[i] : part2.red[i];
        let greenAllele = Math.random() < 0.5 ? part1.green[i] : part2.green[i];
        let blueAllele = Math.random() < 0.5 ? part1.blue[i] : part2.blue[i];

        // Apply mutations if enabled
        if (getMutationsEnabled()) {
            const mutationRate = getMutationRate();
            if (Math.random() < mutationRate) redAllele = !redAllele;
            if (Math.random() < mutationRate) greenAllele = !greenAllele;
            if (Math.random() < mutationRate) blueAllele = !blueAllele;
        }

        childPart.red.push(redAllele);
        childPart.green.push(greenAllele);
        childPart.blue.push(blueAllele);
    }

    // Gradient can also mutate
    if (getMutationsEnabled() && Math.random() < getMutationRate()) {
        childPart.gradient = !childPart.gradient;
    }

    return childPart;
}

/**
 * Breed two parrots to create offspring genes
 * @param {Object} parent1Genes - First parent's genes
 * @param {Object} parent2Genes - Second parent's genes
 * @returns {Object} Child genes with all body parts
 */
export function breedParrotGenes(parent1Genes, parent2Genes) {
    return {
        wings: breedBodyPart(parent1Genes.wings, parent2Genes.wings),
        special_wing: breedBodyPart(parent1Genes.special_wing, parent2Genes.special_wing),
        body: breedBodyPart(parent1Genes.body, parent2Genes.body),
        head: breedBodyPart(parent1Genes.head, parent2Genes.head),
        tail: breedBodyPart(parent1Genes.tail, parent2Genes.tail),
        accents: breedBodyPart(parent1Genes.accents, parent2Genes.accents)
    };
}
