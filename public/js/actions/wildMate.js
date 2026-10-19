/**
 * ChromaWing Breeding Simulator - Wild Mate Actions
 * Handles releasing parrots and finding wild mates
 */

import * as GameState from '../core/gameState.js';
import { Parrot } from '../core/parrot.js';
import { breedParrotGenes } from '../core/genetics.js';
import { showToast } from '../lib/notifications.js';
import { getRandomName } from '../lib/utils.js';
import * as UI from '../ui.js';
import { t } from '../lib/i18n.js';
import {
    MATE_SEARCH_BASE_COST,
    MATE_SEARCH_INCREMENT,
    INTELLIGENCE_RETRY_MULTIPLIER,
    SPEED_COST_MODIFIER
} from '../lib/economy.js';
import {
    initializeGenePool,
    addGenesToPool,
    calculateReleaseCredits,
    generateWildMateOptions,
    calculatePoolQuality,
    calculatePoolDiversity
} from '../lib/wildMate.js';

/**
 * Release a parrot to the wild
 * @param {number} parrotId - Parrot ID to release
 * @param {Function} saveGameFn - Save game function
 */
export function releaseParrot(parrotId, saveGameFn) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);

    if (!parrot) {
        showToast(
            t('wildMate.toasts.parrotNotFound.title'),
            t('wildMate.toasts.parrotNotFound.message'),
            'error'
        );
        return;
    }

    // Check if parrot is locked
    if (GameState.isParrotLocked(parrotId)) {
        showToast(
            t('wildMate.toasts.releaseLocked.title', { name: parrot.name }),
            t('wildMate.toasts.releaseLocked.message'),
            'error',
            3000
        );
        return;
    }

    // Calculate credits earned
    const creditsEarned = calculateReleaseCredits(parrot);

    // Initialize gene pool if needed
    let genePool = GameState.getWildGenePool();
    if (!genePool) {
        genePool = initializeGenePool();
    }

    // Add parrot's genes to pool
    genePool = addGenesToPool(genePool, parrot.genes);
    GameState.setWildGenePool(genePool);

    // Add to release history
    GameState.addReleaseRecord({
        parrotId: parrot.id,
        name: parrot.name,
        timestamp: Date.now(),
        creditsEarned
    });

    // Add conservation credits
    GameState.addConservationCredits(creditsEarned);

    // Remove parrot from collection
    GameState.removeParrot(parrotId);

    // Clear from breeding pair if present
    const breedingPair = GameState.getBreedingPair();
    if (breedingPair.left === parrotId) {
        GameState.setBreedingPair({ ...breedingPair, left: null });
    }
    if (breedingPair.right === parrotId) {
        GameState.setBreedingPair({ ...breedingPair, right: null });
    }
    GameState.setSelectedParrotId(null);

    // Update UI and save
    UI.updateUI();
    if (saveGameFn) saveGameFn();

    // Show success toast
    const rarity = parrot.calculateRarity();
    showToast(
        t('wildMate.toasts.released.title', { name: parrot.name }),
        t('wildMate.toasts.released.message', { credits: creditsEarned, rarity: t(`rarity.${rarity}`) }),
        'success',
        5000
    );
}

/**
 * Calculate cost for wild mate search
 * @param {Parrot} parrot - The parrot searching
 * @returns {number} Cost in conservation credits
 */
export function calculateSearchCost(parrot) {
    let cost = MATE_SEARCH_BASE_COST;

    // Add increment based on previous attempts
    cost += parrot.wildMateAttempts * MATE_SEARCH_INCREMENT;

    // Apply speed modifier
    const perfStats = parrot.getPerformanceStats();
    cost += SPEED_COST_MODIFIER[perfStats.speed.category];

    return Math.max(5, cost); // Minimum 5 credits
}

/**
 * Start wild mate search
 * @param {number} parrotId - Parrot ID searching for mate
 * @param {Function} saveGameFn - Save game function
 * @returns {Object|null} Mate options or null if failed
 */
export function startWildMateSearch(parrotId, saveGameFn) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);

    if (!parrot) {
        showToast(t('wildMate.toasts.parrotNotFound.title'), t('wildMate.toasts.parrotNotFound.message'), 'error');
        return null;
    }

    // Check if parrot has already found a wild mate
    if (parrot.hasFoundWildMate) {
        showToast(
            t('wildMate.toasts.alreadyFoundMate.title', { name: parrot.name }),
            t('wildMate.toasts.alreadyFoundMate.message'),
            'error',
            4000
        );
        return null;
    }

    // Check gene pool exists
    const genePool = GameState.getWildGenePool();
    if (!genePool) {
        showToast(
            t('wildMate.toasts.poolEmpty.title'),
            t('wildMate.toasts.poolEmpty.message'),
            'error',
            4000
        );
        return null;
    }

    // Calculate cost
    const cost = calculateSearchCost(parrot);
    const credits = GameState.getConservationCredits();

    if (credits < cost) {
        showToast(
            t('wildMate.toasts.notEnoughCredits.title'),
            t('wildMate.toasts.notEnoughCredits.message', { cost, credits }),
            'error',
            4000
        );
        return null;
    }

    // Deduct credits
    GameState.subtractConservationCredits(cost);

    // Increment attempt counter
    parrot.wildMateAttempts++;

    // Generate mate options
    const mateOptions = generateWildMateOptions(
        parrot,
        genePool,
        getRandomName,
        () => GameState.getAndIncrementParrotIdCounter()
    );

    // Convert to Parrot objects
    const mateParrots = mateOptions.map(m => new Parrot(m.name, m.genes, m.generation, m.id));

    // Save state
    if (saveGameFn) saveGameFn();

    // Show success toast
    const poolQuality = calculatePoolQuality(genePool);
    const qualityStars = Math.floor(poolQuality * 5);
    showToast(
        t('wildMate.toasts.matesFound.title', { name: parrot.name }),
        t('wildMate.toasts.matesFound.message', { count: mateParrots.length, stars: '⭐'.repeat(qualityStars) }),
        'success',
        4000
    );

    return {
        searchingParrot: parrot,
        mates: mateParrots,
        cost
    };
}

/**
 * Select a wild mate and breed
 * @param {number} searchingParrotId - ID of searching parrot
 * @param {Parrot} selectedMate - The selected mate
 * @param {Function} saveGameFn - Save game function
 */
export function selectWildMate(searchingParrotId, selectedMate, saveGameFn) {
    const parrots = GameState.getParrots();
    const searchingParrot = parrots.find(p => p.id === searchingParrotId);

    if (!searchingParrot) {
        showToast(t('wildMate.toasts.parrotNotFound.title'), t('wildMate.toasts.parrotNotFound.message'), 'error');
        return;
    }

    // Mark parrot as having found wild mate
    searchingParrot.hasFoundWildMate = true;

    // Breed with the selected mate
    const offspringGenes = breedParrotGenes(searchingParrot.genes, selectedMate.genes);

    // Create offspring
    const offspring = new Parrot(
        getRandomName(),
        offspringGenes,
        searchingParrot.generation + 1,
        GameState.getAndIncrementParrotIdCounter()
    );

    // Add to recent offspring
    GameState.addRecentOffspring(offspring);

    // Update UI and save
    UI.updateUI();
    if (saveGameFn) saveGameFn();

    // Show success toast
    const rarity = offspring.calculateRarity();
    showToast(
        t('wildMate.toasts.offspringBorn.title', { name: offspring.name }),
        t('wildMate.toasts.offspringBorn.message', { parent: searchingParrot.name, mate: selectedMate.name, rarity: t(`rarity.${rarity}`) }),
        'success',
        5000
    );

    return offspring;
}

/**
 * Cancel wild mate search (refund partial credits)
 * @param {number} cost - Original search cost
 * @param {Function} saveGameFn - Save game function
 */
export function cancelWildMateSearch(cost, saveGameFn) {
    // Refund 50% of credits
    const refund = Math.floor(cost * 0.5);
    GameState.addConservationCredits(refund);

    if (saveGameFn) saveGameFn();

    showToast(
        t('wildMate.toasts.searchCancelled.title'),
        t('wildMate.toasts.searchCancelled.message', { refund }),
        'info',
        3000
    );
}

/**
 * Get gene pool statistics
 * @returns {Object} Pool statistics
 */
export function getGenePoolStats() {
    const genePool = GameState.getWildGenePool();

    if (!genePool) {
        return {
            exists: false,
            quality: 0,
            diversity: 0,
            releasesCount: GameState.getReleaseHistory().length
        };
    }

    const quality = calculatePoolQuality(genePool);
    const diversity = calculatePoolDiversity(genePool);
    const releasesCount = GameState.getReleaseHistory().length;

    return {
        exists: true,
        quality,
        diversity,
        qualityStars: Math.floor(quality * 5),
        diversityPercent: Math.floor(diversity * 100),
        releasesCount
    };
}
