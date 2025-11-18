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
import * as I18n from './lib/i18n.js';
import { BREEDING_COST } from './lib/economy.js';

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
    if (!confirm(I18n.t('messages.newGameConfirm'))) {
        return;
    }

    // Clear cookie
    document.cookie = 'chromawing_save=;max-age=0;path=/';

    // Reset all game state
    GameState.resetGameState();

    // Update mutation and auto-exam displays
    UI.updateMutationDisplay();
    UI.updateAutoExamDisplay();

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

/**
 * Change game language and reload
 * @param {string} langCode - Language code (en, es, fr, ru, uk)
 */
window.changeLanguageHandler = (langCode) => {
    console.log(`[Language] Changing language to: ${langCode}`);

    try {
        // Update language in game state
        GameState.setLanguage(langCode);
        console.log(`[Language] Language set in GameState: ${GameState.getLanguage()}`);

        // Save game with new language
        const saved = saveGame();
        console.log(`[Language] Game saved:`, saved);

        // Store language in localStorage as backup
        localStorage.setItem('chromawing_language', langCode);
        console.log(`[Language] Language stored in localStorage`);

        // Reload page to apply new language
        console.log(`[Language] Reloading page...`);
        window.location.reload();
    } catch (error) {
        console.error(`[Language] Error changing language:`, error);
    }
};

// ===== ALPINE.JS COMPONENTS =====

// Alpine component registration is handled in breeding-game-modular.html
// Component is exported from ui/breedingSlots.js and registered via alpine:init event
console.log('v1.3.1 - main.js loaded');

// ===== INITIALIZATION =====

window.addEventListener('load', async () => {
    // STEP 1: Load English translations first (needed for loadGame to work)
    console.log('i18n: Loading default English translations...');
    await I18n.loadTranslations('en');

    // Make i18n available globally immediately (needed for Alpine.js)
    window.i18n = I18n;

    // Start Alpine.js now that i18n is ready
    if (window.startAlpine) {
        console.log('i18n: Starting Alpine.js with translations ready');
        window.startAlpine();
    }

    // STEP 2: Try to load saved game to get language preference
    let savedLang = null;
    const loaded = loadGame();

    if (loaded) {
        savedLang = GameState.getLanguage();
    }

    // STEP 3: Load translations for user's preferred language (if different from English)
    const langToLoad = savedLang || I18n.detectLanguage();
    if (langToLoad !== 'en') {
        console.log(`i18n: Loading ${langToLoad} translations...`);
        await I18n.loadTranslations(langToLoad);
    }

    // Store the detected/loaded language
    if (!savedLang) {
        GameState.setLanguage(langToLoad);
    }

    console.log(`i18n: Game language set to '${GameState.getLanguage()}'`);

    // Initialize language selector on splash screen with translations
    const languageSelectorLabel = document.getElementById('languageSelectorLabel');
    if (languageSelectorLabel) {
        languageSelectorLabel.textContent = I18n.t('languageSelector.label');
    }

    // Update language names in selector
    const languageFlags = document.querySelectorAll('.language-flag');
    languageFlags.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        const nameSpan = btn.querySelector('.language-name');
        if (nameSpan && lang) {
            nameSpan.textContent = I18n.t(`languageSelector.${lang === 'en' ? 'english' : lang === 'es' ? 'spanish' : lang === 'fr' ? 'french' : lang === 'ru' ? 'russian' : 'ukrainian'}`);
        }

        // Highlight the current language
        if (lang === GameState.getLanguage()) {
            btn.style.background = 'rgba(255, 255, 255, 0.4)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        }
    });

    // Translate splash screen elements
    const splashSubtitle = document.querySelector('.splash-subtitle');
    if (splashSubtitle) {
        splashSubtitle.textContent = I18n.t('splash.subtitle');
    }

    // Translate splash description paragraphs
    const splashDescriptions = document.querySelectorAll('.splash-description p');
    if (splashDescriptions.length >= 2) {
        splashDescriptions[0].textContent = I18n.t('splash.description1');
        splashDescriptions[1].textContent = I18n.t('splash.description2');
    }

    // Translate splash buttons
    const btnStart = document.querySelector('.btn-start');
    if (btnStart) {
        btnStart.innerHTML = '🎮 ' + I18n.t('splash.startPlaying');
    }

    const btnNewGame = document.querySelector('.btn-new-game-splash');
    if (btnNewGame) {
        btnNewGame.innerHTML = '🔄 ' + I18n.t('splash.newGame');
    }

    // Translate splash features
    const splashFeatures = document.querySelectorAll('.splash-feature');
    if (splashFeatures.length >= 3) {
        splashFeatures[0].innerHTML = '🧬 ' + I18n.t('splash.feature1');
        splashFeatures[1].innerHTML = '🎨 ' + I18n.t('splash.feature2');
        splashFeatures[2].innerHTML = '🏆 ' + I18n.t('splash.feature3');
    }

    // Translate main game UI elements
    const statBadges = document.querySelectorAll('.stat-badge');
    if (statBadges.length >= 5) {
        // Coins
        const coinsLabel = statBadges[0].querySelector('div > div:first-child');
        if (coinsLabel) coinsLabel.textContent = I18n.t('common.coins');

        // Parrots
        const parrotsLabel = statBadges[1].querySelector('div > div:first-child');
        if (parrotsLabel) parrotsLabel.textContent = I18n.t('common.parrots');

        // Generation
        const generationLabel = statBadges[2].querySelector('div > div:first-child');
        if (generationLabel) generationLabel.textContent = I18n.t('common.generation');

        // Mutations
        const mutationsLabel = statBadges[3].querySelector('div > div:first-child');
        if (mutationsLabel) mutationsLabel.textContent = I18n.t('common.mutations');

        // Auto-Exam
        const autoExamLabel = statBadges[4].querySelector('div > div:first-child');
        if (autoExamLabel) autoExamLabel.textContent = I18n.t('common.autoExam');
    }

    // Translate tab labels
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length >= 6) {
        const tabLabels = tabs[0].querySelectorAll('.tab-label');
        if (tabLabels[0]) tabLabels[0].textContent = I18n.t('tabs.collection');

        const tab1Labels = tabs[1].querySelectorAll('.tab-label');
        if (tab1Labels[0]) tab1Labels[0].textContent = I18n.t('tabs.store');

        const tab2Labels = tabs[2].querySelectorAll('.tab-label');
        if (tab2Labels[0]) tab2Labels[0].textContent = I18n.t('tabs.breeding');

        const tab3Labels = tabs[3].querySelectorAll('.tab-label');
        if (tab3Labels[0]) tab3Labels[0].textContent = I18n.t('tabs.contests');

        const tab4Labels = tabs[4].querySelectorAll('.tab-label');
        if (tab4Labels[0]) tab4Labels[0].textContent = I18n.t('tabs.gallery');

        const tab5Labels = tabs[5].querySelectorAll('.tab-label');
        if (tab5Labels[0]) tab5Labels[0].textContent = I18n.t('tabs.colorLab');
    }

    // Translate panel titles and hints
    const panelTitle = document.getElementById('panelTitle');
    if (panelTitle) {
        panelTitle.textContent = I18n.t('panel.yourParrots');
    }

    const panelHint = document.querySelector('.panel h2 span[style*="color: #999"]');
    if (panelHint) {
        panelHint.textContent = I18n.t('panel.selectTwoToBreed');
    }

    // Translate preview panel
    const previewTitle = document.querySelector('.preview-section h3');
    if (previewTitle) {
        previewTitle.textContent = I18n.t('panel.selectedParrot');
    }

    const emptyPreview = document.querySelector('.empty-preview');
    if (emptyPreview) {
        emptyPreview.textContent = I18n.t('panel.clickToView');
    }

    // Translate breeding button
    const breedButton = document.getElementById('breedButtonLarge');
    if (breedButton) {
        breedButton.innerHTML = `💕 ${I18n.t('breeding.breedButton')} (${I18n.t('breeding.breedCost', { cost: BREEDING_COST })})`;
    }

    // Translate notification panel
    const notificationHeader = document.querySelector('.notification-history-header h3');
    if (notificationHeader) {
        notificationHeader.textContent = I18n.t('common.notifications');
    }

    const clearAllBtn = document.querySelector('.notification-history-header button');
    if (clearAllBtn) {
        clearAllBtn.textContent = I18n.t('common.clearAll');
    }

    if (loaded) {
        // Game loaded from save
        console.log('Game loaded - Store has', GameState.getStoreParrots().length, 'parrots');

        // Update mutation and auto-exam displays with correct translations
        UI.updateMutationDisplay();
        UI.updateAutoExamDisplay();

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
