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
 * Breed a performance gene (simple 4-allele trait)
 * @param {Array} parent1Alleles - First parent's alleles (4 booleans)
 * @param {Array} parent2Alleles - Second parent's alleles (4 booleans)
 * @returns {Array} Child alleles (4 booleans)
 */
export function breedPerformanceGene(parent1Alleles, parent2Alleles) {
    const childAlleles = [];

    for (let i = 0; i < 4; i++) {
        // Randomly inherit from either parent
        let allele = Math.random() < 0.5 ? parent1Alleles[i] : parent2Alleles[i];

        // Apply mutations if enabled
        if (getMutationsEnabled() && Math.random() < getMutationRate()) {
            allele = !allele;
        }

        childAlleles.push(allele);
    }

    return childAlleles;
}

/**
 * Breed two parrots to create offspring genes
 * @param {Object} parent1Genes - First parent's genes
 * @param {Object} parent2Genes - Second parent's genes
 * @returns {Object} Child genes with all body parts and performance genes
 */
export function breedParrotGenes(parent1Genes, parent2Genes) {
    const childGenes = {
        wings: breedBodyPart(parent1Genes.wings, parent2Genes.wings),
        special_wing: breedBodyPart(parent1Genes.special_wing, parent2Genes.special_wing),
        body: breedBodyPart(parent1Genes.body, parent2Genes.body),
        head: breedBodyPart(parent1Genes.head, parent2Genes.head),
        tail: breedBodyPart(parent1Genes.tail, parent2Genes.tail),
        accents: breedBodyPart(parent1Genes.accents, parent2Genes.accents)
    };

    // Breed performance genes (with fallback for backward compatibility)
    childGenes.agility = breedPerformanceGene(
        parent1Genes.agility || [true, true, false, false],
        parent2Genes.agility || [true, true, false, false]
    );
    childGenes.intelligence = breedPerformanceGene(
        parent1Genes.intelligence || [true, true, false, false],
        parent2Genes.intelligence || [true, true, false, false]
    );
    childGenes.stamina = breedPerformanceGene(
        parent1Genes.stamina || [true, true, false, false],
        parent2Genes.stamina || [true, true, false, false]
    );
    childGenes.speed = breedPerformanceGene(
        parent1Genes.speed || [true, true, false, false],
        parent2Genes.speed || [true, true, false, false]
    );
    childGenes.fertility = breedPerformanceGene(
        parent1Genes.fertility || [true, true, false, false],
        parent2Genes.fertility || [true, true, false, false]
    );

    return childGenes;
}
