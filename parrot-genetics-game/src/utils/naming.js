// ChromaWing - Name Generation
// v3.0

import { PARROT_NAMES } from '../data/constants.js';
import { state } from '../game/gameState.js';

export function getRandomName() {
    const availableNames = PARROT_NAMES.filter(name => !state.usedNames.has(name));

    if (availableNames.length === 0) {
        state.usedNames.clear();
        return PARROT_NAMES[Math.floor(Math.random() * PARROT_NAMES.length)];
    }

    const name = availableNames[Math.floor(Math.random() * availableNames.length)];
    state.usedNames.add(name);
    return name;
}

export function resetUsedNames() {
    state.usedNames.clear();
}
