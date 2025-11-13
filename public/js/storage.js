/**
 * ChromaWing Breeding Simulator - Storage Module
 * Save/load game state to cookies
 */

import { Parrot } from './parrot.js';
import { CONTEST_TIERS } from './constants.js';
import * as GameState from './gameState.js';

/**
 * Save current game state to cookies
 */
export function saveGame() {
    const gameStateData = {
        parrots: GameState.getParrots().map(p => ({
            id: p.id,
            name: p.name,
            genes: p.genes,
            generation: p.generation,
            isRare: p.isRare,
            rareSource: p.rareSource,
            description: p.description
        })),
        storeParrots: GameState.getStoreParrots().map(p => ({
            id: p.id,
            name: p.name,
            genes: p.genes,
            generation: p.generation,
            isRare: p.isRare,
            rareSource: p.rareSource,
            description: p.description
        })),
        recentOffspring: GameState.getRecentOffspring().map(p => ({
            id: p.id,
            name: p.name,
            genes: p.genes,
            generation: p.generation,
            isRare: p.isRare,
            rareSource: p.rareSource,
            description: p.description
        })),
        coins: GameState.getCoins(),
        parrotIdCounter: GameState.getParrotIdCounter(),
        generation: GameState.getGeneration(),
        usedNames: Array.from(GameState.getUsedNames()),
        examinedParrots: Array.from(GameState.getExaminedParrots()),
        lockedParrots: Array.from(GameState.getLockedParrots()),
        contestProgress: GameState.getContestProgress(),
        parrotTrophies: GameState.getParrotTrophies(),
        achievements: GameState.getAchievements(),
        mutationsEnabled: GameState.getMutationsEnabled(),
        mutationRate: GameState.getMutationRate(),
        autoExamineEnabled: GameState.getAutoExamineEnabled()
    };

    try {
        const gameData = JSON.stringify(gameStateData);
        document.cookie = `chromawing_save=${encodeURIComponent(gameData)};max-age=31536000;path=/`;
        console.log('Game saved successfully - Parrots:', gameStateData.parrots.length,
                    'Store:', gameStateData.storeParrots.length,
                    'Offspring:', gameStateData.recentOffspring.length,
                    'Coins:', gameStateData.coins);
        return true;
    } catch (e) {
        console.error('Failed to save game:', e);
        return false;
    }
}

/**
 * Load game state from cookies
 * @returns {boolean} True if load successful
 */
export function loadGame() {
    const cookies = document.cookie.split(';');
    console.log('Loading game... found cookies:', cookies.length);

    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        console.log('Checking cookie:', name);

        if (name === 'chromawing_save') {
            console.log('Found chromawing_save cookie, length:', value.length);

            try {
                const gameStateData = JSON.parse(decodeURIComponent(value));
                console.log('Parsed save data - Parrots:', gameStateData.parrots?.length,
                            'Store:', gameStateData.storeParrots?.length,
                            'Offspring:', gameStateData.recentOffspring?.length,
                            'Coins:', gameStateData.coins);

                // Restore parrots
                const restoredParrots = gameStateData.parrots.map(p => {
                    const parrot = new Parrot(p.name, p.genes, p.generation, p.id);
                    if (p.isRare) {
                        parrot.isRare = p.isRare;
                        parrot.rareSource = p.rareSource;
                        parrot.description = p.description;
                    }
                    return parrot;
                });
                GameState.setParrots(restoredParrots);

                // Restore store parrots
                const restoredStoreParrots = (gameStateData.storeParrots || []).map(p => {
                    const parrot = new Parrot(p.name, p.genes, p.generation, p.id);
                    if (p.isRare) {
                        parrot.isRare = p.isRare;
                        parrot.rareSource = p.rareSource;
                        parrot.description = p.description;
                    }
                    return parrot;
                });
                GameState.setStoreParrots(restoredStoreParrots);

                // Restore recent offspring
                const restoredOffspring = (gameStateData.recentOffspring || []).map(p => {
                    const parrot = new Parrot(p.name, p.genes, p.generation, p.id);
                    if (p.isRare) {
                        parrot.isRare = p.isRare;
                        parrot.rareSource = p.rareSource;
                        parrot.description = p.description;
                    }
                    return parrot;
                });
                GameState.setRecentOffspring(restoredOffspring);

                // Restore other state
                GameState.setCoins(gameStateData.coins);
                GameState.setParrotIdCounter(gameStateData.parrotIdCounter);
                GameState.setGeneration(gameStateData.generation);

                // Restore used names
                const usedNamesSet = new Set(gameStateData.usedNames || []);
                GameState.setUsedNames(usedNamesSet);

                // Restore examined parrots
                const examinedSet = new Set(gameStateData.examinedParrots || []);
                GameState.setExaminedParrots(examinedSet);

                // Restore locked parrots
                const lockedSet = new Set(gameStateData.lockedParrots || []);
                GameState.setLockedParrots(lockedSet);

                GameState.setContestProgress(gameStateData.contestProgress || {});
                GameState.setParrotTrophies(gameStateData.parrotTrophies || {});
                GameState.setAchievements(gameStateData.achievements || { unlocked: [], progress: {} });
                GameState.setMutationsEnabled(gameStateData.mutationsEnabled !== undefined ? gameStateData.mutationsEnabled : true);
                GameState.setMutationRate(gameStateData.mutationRate || 0.05);
                GameState.setAutoExamineEnabled(gameStateData.autoExamineEnabled !== undefined ? gameStateData.autoExamineEnabled : false);

                // Update auto-examine UI
                const autoExamineStatusEl = document.getElementById('autoExamineStatus');
                const autoExamineIconEl = document.getElementById('autoExamineIcon');
                if (autoExamineStatusEl && autoExamineIconEl) {
                    if (GameState.getAutoExamineEnabled()) {
                        autoExamineStatusEl.textContent = 'ON';
                        autoExamineStatusEl.style.color = '#4caf50';
                        autoExamineIconEl.textContent = '🔬';
                    } else {
                        autoExamineStatusEl.textContent = 'OFF';
                        autoExamineStatusEl.style.color = '#dc3545';
                        autoExamineIconEl.textContent = '🔒';
                    }
                }

                // Restore contest tier unlock status
                if (gameStateData.contestProgress) {
                    CONTEST_TIERS.forEach((tier, index) => {
                        if (index === 0) {
                            tier.unlocked = true;
                        } else {
                            const anyCompleted = Object.values(gameStateData.contestProgress).some(
                                progress => progress[index - 1]
                            );
                            if (anyCompleted) {
                                tier.unlocked = true;
                            }
                        }
                    });
                }

                console.log('Game loaded successfully - Parrots:', restoredParrots.length,
                            'Store:', restoredStoreParrots.length,
                            'Offspring:', restoredOffspring.length,
                            'Coins:', gameStateData.coins);
                return true;
            } catch (e) {
                console.error('Failed to load game:', e);
                return false;
            }
        }
    }
    return false;
}

/**
 * Start a new game (reset everything)
 * @returns {boolean} True if new game started
 */
export function newGame() {
    if (!confirm('Start a new game? This will erase your current progress!')) {
        return false;
    }

    // Clear cookie
    document.cookie = 'chromawing_save=;max-age=0;path=/';

    // Reset all game state
    GameState.resetGameState();

    // Reset contest tiers
    CONTEST_TIERS.forEach((tier, index) => {
        tier.unlocked = (index === 0);
    });

    console.log('New game started');
    return true;
}
