/**
 * ChromaWing Breeding Simulator - Parrot Grid Module
 * Parrot grid rendering for collection and store tabs
 */

import * as GameState from '../gameState.js';
import { createParrotCard } from './parrotCard.js';

/**
 * Render parrot grid for collection and store tabs
 */
export async function renderParrotGrid() {
    const collectionGrid = document.getElementById('collectionTab');
    const storeGrid = document.getElementById('storeTab');

    collectionGrid.innerHTML = '';
    storeGrid.innerHTML = '';

    const parrots = GameState.getParrots();
    const storeParrots = GameState.getStoreParrots();

    for (const parrot of parrots) {
        const card = await createParrotCard(parrot, false);
        collectionGrid.appendChild(card);
    }

    for (const parrot of storeParrots) {
        const card = await createParrotCard(parrot, true);
        storeGrid.appendChild(card);
    }
}
