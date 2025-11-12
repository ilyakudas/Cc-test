// ChromaWing Breeding Simulator - Main Entry Point
// v3.0 - Refactored with modules

// Import core modules
import { Parrot } from './models/Parrot.js';
import { state, resetGame } from './game/gameState.js';
import { CONTEST_TIERS, MUTATION_RATE } from './data/constants.js';
import { getRandomName } from './utils/naming.js';
import { randomBodyPartGenes, breedBodyPartGenes, getDNAString, hasFullGenotype } from './utils/genetics.js';
import { generateParrotSVG } from './rendering/svgRenderer.js';

// Expose to window for HTML onclick handlers (temporary - will be refactored)
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

// Re-export everything temporarily
// This allows the original code to work while we gradually refactor

console.log('ChromaWing v3.0 - Modular version loaded');
console.log('Modules loaded:', {
    Parrot: !!Parrot,
    state: !!state,
    CONTEST_TIERS: !!CONTEST_TIERS,
    generateParrotSVG: !!generateParrotSVG
});

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

function initializeGame() {
    console.log('Game initialized');
    // Game initialization logic will go here
    // For now, we're just confirming modules load correctly
}

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
    generateParrotSVG
};
