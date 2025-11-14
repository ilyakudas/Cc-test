/**
 * ChromaWing Breeding Simulator - Main Module
 * Initialization, game loop, and global handlers
 */

import * as GameState from './core/gameState.js';
import { Parrot } from './core/parrot.js';
import { getRandomName, createParrotWithPurity } from './lib/utils.js';
import * as UI from './ui.js';
import * as Actions from './actions.js';
import * as Contests from './lib/contests.js';
import { saveGame, loadGame } from './core/storage.js';
import { checkAchievements } from './lib/achievements.js';
import { CONTEST_TIERS } from './lib/constants.js';
import { createBreedingSlotsComponent } from './ui/breedingSlots.js';

/**
 * Initialize a new game with starter parrots
 */
async function initGame() {
    // Create predefined beautiful parrot - In collection
    const twilight = new Parrot('Twilight', {
        wings: {
            red: [false, false, true, true],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        special_wing: {
            red: [true, true, true, true],
            green: [true, false, false, false],
            blue: [false, false, false, false],
            gradient: false
        },
        body: {
            red: [true, true, true, true],
            green: [true, true, false, false],
            blue: [false, false, false, false],
            gradient: false
        },
        head: {
            red: [true, true, true, false],
            green: [true, true, true, false],
            blue: [false, false, false, false],
            gradient: false
        },
        tail: {
            red: [false, false, true, true],
            green: [true, true, true, true],
            blue: [false, false, true, true],
            gradient: true
        },
        accents: {
            red: [true, false, true, false],
            green: [false, false, true, true],
            blue: [true, true, false, false],
            gradient: false
        }
    }, 1, 0);

    GameState.addParrot(twilight);
    GameState.setParrotIdCounter(1);

    // Create Prism parrot for store
    const prism = new Parrot('Prism', {
        wings: {
            red: [true, true, false, false],
            green: [false, false, true, true],
            blue: [true, true, true, true],
            gradient: true
        },
        special_wing: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [true, true, true, true],
            gradient: false
        },
        body: {
            red: [true, true, true, true],
            green: [true, true, true, false],
            blue: [false, false, false, false],
            gradient: false
        },
        head: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [true, true, true, true],
            gradient: false
        },
        tail: {
            red: [true, true, true, true],
            green: [true, true, false, false],
            blue: [false, false, true, true],
            gradient: true
        },
        accents: {
            red: [true, true, true, false],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: false
        }
    }, 1, 1);

    GameState.incrementParrotIdCounter();

    await generateStore(prism);
    await UI.updateUI();
}

/**
 * Generate store parrots
 * @param {Parrot} prismParrot - Optional predefined parrot to add
 */
async function generateStore(prismParrot = null) {
    GameState.clearStoreParrots();

    // Add Prism parrot if provided
    if (prismParrot) {
        GameState.addStoreParrot(prismParrot);
    }

    // TEST: Add max rarity parrot
    const maxRarityParrot = new Parrot('[TEST-MAX-RARITY]', {
        wings: {
            red: [true, true, true, true],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        special_wing: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [true, true, true, true],
            gradient: true
        },
        body: {
            red: [true, true, true, true],
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: true
        },
        head: {
            red: [true, true, true, true],
            green: [false, false, false, false],
            blue: [false, false, false, false],
            gradient: true
        },
        tail: {
            red: [false, false, false, false],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        accents: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: true
        }
    }, 1, GameState.getAndIncrementParrotIdCounter());
    GameState.addStoreParrot(maxRarityParrot);

    // TEST: Add max beauty parrot
    const maxBeautyParrot = new Parrot('[TEST-MAX-BEAUTY]', {
        wings: {
            red: [true, true, true, true],
            green: [false, false, false, false],
            blue: [false, false, false, false],
            gradient: false
        },
        special_wing: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [true, true, true, true],
            gradient: false
        },
        body: {
            red: [true, true, true, true],
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: false
        },
        head: {
            red: [false, false, false, false],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: false
        },
        tail: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: false
        },
        accents: {
            red: [true, true, true, true],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: false
        }
    }, 1, GameState.getAndIncrementParrotIdCounter());
    GameState.addStoreParrot(maxBeautyParrot);

    // TEST: Add max gradient beauty parrot
    const maxGradientParrot = new Parrot('[TEST-MAX-GRADIENT]', {
        wings: {
            red: [true, true, true, true],
            green: [false, false, true, true],
            blue: [false, false, false, false],
            gradient: true
        },
        special_wing: {
            red: [false, false, false, false],
            green: [true, true, true, true],
            blue: [false, false, true, true],
            gradient: true
        },
        body: {
            red: [false, false, true, true],
            green: [false, false, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        head: {
            red: [true, true, false, false],
            green: [true, true, true, true],
            blue: [false, false, false, false],
            gradient: true
        },
        tail: {
            red: [false, false, false, false],
            green: [true, true, false, false],
            blue: [true, true, true, true],
            gradient: true
        },
        accents: {
            red: [true, true, true, true],
            green: [false, false, false, false],
            blue: [true, true, false, false],
            gradient: true
        }
    }, 1, GameState.getAndIncrementParrotIdCounter());
    GameState.addStoreParrot(maxGradientParrot);

    // Generate store parrots with diverse rarities
    const targetRarities = ['legendary', 'legendary', 'epic', 'rare', 'uncommon', 'common'];

    for (const targetRarity of targetRarities) {
        let parrot = null;
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            attempts++;

            let genes;
            if (targetRarity === 'legendary') {
                genes = createParrotWithPurity('high');
                const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
                const numGradients = 2 + Math.floor(Math.random() * 2);
                for (let j = 0; j < numGradients; j++) {
                    const part = bodyParts[Math.floor(Math.random() * bodyParts.length)];
                    genes[part].gradient = true;
                }
            } else if (targetRarity === 'epic') {
                genes = createParrotWithPurity('high');
            } else if (targetRarity === 'rare') {
                genes = createParrotWithPurity('medium');
            } else if (targetRarity === 'uncommon') {
                genes = createParrotWithPurity('low');
            } else {
                genes = createParrotWithPurity('random');
            }

            const testParrot = new Parrot(
                getRandomName(),
                genes,
                1,
                GameState.getParrotIdCounter()
            );
            const actualRarity = testParrot.calculateRarity();

            if (actualRarity === targetRarity || attempts >= maxAttempts) {
                parrot = testParrot;
                GameState.incrementParrotIdCounter();
                break;
            }
        }

        if (parrot) {
            GameState.addStoreParrot(parrot);
        }
    }
}

/**
 * Start a new game
 */
async function newGame() {
    if (!confirm('Start a new game? This will erase your current progress!')) {
        return;
    }

    // Clear cookie
    document.cookie = 'chromawing_save=;max-age=0;path=/';

    // Reset all game state
    GameState.resetGameState();

    // Update mutation display
    UI.updateMutationDisplay();

    // Reset contest tiers
    CONTEST_TIERS.forEach((tier, index) => {
        tier.unlocked = (index === 0);
    });

    // Reinitialize
    await initGame();
}

// ===== WINDOW HANDLERS FOR HTML ONCLICK ATTRIBUTES =====

window.selectParrotHandler = (parrotId) => Actions.selectParrot(parrotId);
window.breedOnLeftHandler = (parrotId) => Actions.breedOnLeft(parrotId);
window.breedOnRightHandler = (parrotId) => Actions.breedOnRight(parrotId);
window.removeFromSlotHandler = (slot) => Actions.removeFromSlot(slot);
window.breedParrotsHandler = () => Actions.breedParrots(saveGame, checkAchievements);
window.buyParrotHandler = (parrotId) => Actions.buyParrot(parrotId, saveGame, checkAchievements);
window.startSellHoldHandler = (parrotId) => {
    Actions.startSellHold(parrotId, event, saveGame);
};
window.cancelSellHoldHandler = () => Actions.cancelSellHold();
window.freeParrotHandler = (parrotId) => Actions.freeParrot(parrotId, saveGame);
window.toggleLockParrotHandler = (parrotId) => Actions.toggleLockParrot(parrotId, saveGame);
window.openLaboratoryHandler = (parrotId) => Actions.openLaboratory(parrotId);
window.performExaminationHandler = (parrotId) => Actions.performExamination(parrotId, saveGame);
window.closeModalHandler = () => Actions.closeModal();
window.toggleMutationsHandler = () => Actions.toggleMutations(saveGame);
window.newGameHandler = () => newGame();
window.switchTabHandler = (tab) => {
    UI.switchTab(tab, event, Contests.renderContestsTab);
};
window.enterContestHandler = (tierIndex) => {
    Contests.enterContest(tierIndex, saveGame, UI.updateStats, checkAchievements);
};
window.takeCoinsRewardHandler = (tierIndex, placement, coinsAmount) => {
    Contests.takeCoinsReward(tierIndex, placement, coinsAmount, saveGame, UI.updateStats, checkAchievements);
};
window.takeParrotRewardHandler = (tierIndex, placement) => {
    Contests.takeParrotReward(tierIndex, placement, saveGame, UI.updateStats, checkAchievements);
};
window.closeContestModalHandler = () => Contests.closeContestModal();
window.closeSplashScreen = () => {
    const splash = document.getElementById('splashScreen');
    if (splash) {
        splash.classList.remove('active');
    }
};
window.moveOffspringToCollectionHandler = () => Actions.moveOffspringToCollection(saveGame);
window.sellAllOffspringHandler = () => Actions.sellAllOffspring(saveGame);
window.dismissOffspringHandler = () => Actions.dismissOffspring(saveGame);
window.toggleAutoExamineHandler = () => Actions.toggleAutoExamine(saveGame);

// ===== ALPINE.JS COMPONENTS =====

// Register Alpine.js component for breeding slots (reactive UI)
// Wait for Alpine to be available, then register component
document.addEventListener('alpine:init', () => {
    if (window.Alpine) {
        window.Alpine.data('breedingSlots', createBreedingSlotsComponent);
    }
});

// ===== INITIALIZATION =====

window.addEventListener('load', async () => {
    // Try to load saved game
    const loaded = loadGame();

    if (loaded) {
        // Game loaded from save
        console.log('Game loaded - Store has', GameState.getStoreParrots().length, 'parrots');

        // Only generate store if it's empty (for old saves without store data)
        if (GameState.getStoreParrots().length === 0) {
            console.log('Store is empty, generating new store parrots');
            await generateStore();
        }

        await UI.updateUI();
    } else {
        // New game
        await initGame();
    }
});
