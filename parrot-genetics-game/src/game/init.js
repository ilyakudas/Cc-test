// ChromaWing - Game Initialization
// v3.0

import { Parrot } from '../models/Parrot.js';
import { state, resetGame } from './gameState.js';
import { getRandomName } from '../utils/naming.js';
import { randomBodyPartGenes } from '../utils/genetics.js';

// Initialize a new game
export async function initGame() {
    // Create starter parrot
    const starterGenes = {
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
    };

    const starter = new Parrot('Twilight', starterGenes, 1);
    state.parrots = [starter];

    // Generate store with random parrots
    generateStore();

    return true;
}

// Generate store parrots
export function generateStore() {
    state.storeParrots = [];

    // Generate 3-5 random parrots
    const count = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
        const genes = {
            wings: randomBodyPartGenes(),
            special_wing: randomBodyPartGenes(),
            body: randomBodyPartGenes(),
            head: randomBodyPartGenes(),
            tail: randomBodyPartGenes(),
            accents: randomBodyPartGenes()
        };

        const parrot = new Parrot(getRandomName(), genes, 1);
        state.storeParrots.push(parrot);
    }
}

// Start a new game
export function newGame() {
    if (!confirm('Start a new game? This will erase your current progress!')) {
        return;
    }

    resetGame();
    initGame();

    // Trigger UI update
    if (window.updateUI) {
        window.updateUI();
    }
}
