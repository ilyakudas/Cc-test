// ChromaWing Breeding Simulator - Main Entry Point
// v3.0 - Refactored with modules

// Import core modules
import { Parrot } from './models/Parrot.js';
import { state, resetGame } from './game/gameState.js';
import { CONTEST_TIERS, MUTATION_RATE } from './data/constants.js';
import { getRandomName } from './utils/naming.js';
import { randomBodyPartGenes, breedBodyPartGenes, getDNAString, hasFullGenotype } from './utils/genetics.js';
import { generateParrotSVG } from './rendering/svgRenderer.js';
import { initGame, newGame, generateStore } from './game/init.js';
import { breedParrots, sellParrot } from './game/breeding.js';
import { updateUI, updateStats, breedOnLeft, breedOnRight, buyParrot, removeFromSlot } from './ui/renderer.js';
import { switchTab, toggleMutations, openLaboratory, closeModal } from './ui/events.js';
import { showToast, dismissToast, toggleNotificationHistory, clearNotificationHistory } from './ui/notifications.js';
import { saveGame, loadGame, exportSaveData, importSaveData, getSaveInfo } from './game/saveLoad.js';
import { checkAchievements, closeWinModal } from './game/achievements.js';
import {
    renderContestsTab,
    enterContest,
    takeCoinsReward,
    takeParrotReward,
    closeContestModal
} from './game/contests.js';

// Expose to window for HTML onclick handlers
window.Parrot = Parrot;
window.state = state;
window.generateParrotSVG = generateParrotSVG;
window.getRandomName = getRandomName;
window.randomBodyPartGenes = randomBodyPartGenes;
window.breedBodyPartGenes = breedBodyPartGenes;
window.getDNAString = getDNAString;
window.hasFullGenotype = hasFullGenotype;
window.CONTEST_TIERS = CONTEST_TIERS;
window.MUTATION_RATE = MUTATION_RATE;

// Game functions
window.initGame = initGame;
window.newGame = newGame;
window.generateStore = generateStore;
window.breedParrots = breedParrots;
window.sellParrot = sellParrot;

// UI functions
window.updateUI = updateUI;
window.updateStats = updateStats;
window.breedOnLeft = breedOnLeft;
window.breedOnRight = breedOnRight;
window.buyParrot = buyParrot;
window.removeFromSlot = removeFromSlot;
window.switchTab = switchTab;
window.toggleMutations = toggleMutations;
window.openLaboratory = openLaboratory;
window.closeModal = closeModal;
window.closeContestModal = closeContestModal;
window.toggleNotificationHistory = toggleNotificationHistory;
window.clearNotificationHistory = clearNotificationHistory;

// Toast notification system
window.showToast = showToast;
window.dismissToast = dismissToast;

// Save/Load system
window.saveGame = saveGame;
window.loadGame = loadGame;
window.exportSaveData = exportSaveData;
window.importSaveData = importSaveData;
window.getSaveInfo = getSaveInfo;

// Achievements system
window.checkAchievements = () => checkAchievements(saveGame);
window.closeWinModal = closeWinModal;

// Contest system
window.enterContestHandler = (tierIndex) => enterContest(tierIndex, saveGame, updateStats, checkAchievements);
window.takeCoinsRewardHandler = (tier, place, coins) => takeCoinsReward(tier, place, coins, saveGame, updateStats, checkAchievements);
window.takeParrotRewardHandler = (tier, place) => takeParrotReward(tier, place, saveGame, updateStats, checkAchievements);
window.closeContestModalHandler = closeContestModal;
window.switchTabHandler = switchTab;

console.log('ChromaWing v3.0 - Modular version loaded');
console.log('Modules loaded:', {
    Parrot: !!Parrot,
    state: !!state,
    initGame: !!initGame,
    updateUI: !!updateUI,
    breedParrots: !!breedParrots
});

// Initialize game when DOM is ready
async function initialize() {
    console.log('Initializing ChromaWing...');

    try {
        await initGame();
        await updateUI();

        // Check achievements on load
        checkAchievements(saveGame);

        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Error loading game. Check console for details.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Export everything
export {
    Parrot,
    state,
    resetGame,
    CONTEST_TIERS,
    MUTATION_RATE,
    getRandomName,
    randomBodyPartGenes,
    breedBodyPartGenes,
    getDNAString,
    hasFullGenotype,
    generateParrotSVG,
    initGame,
    newGame,
    breedParrots,
    updateUI
};
