/**
 * ChromaWing Breeding Simulator - Core UI Module
 * Main UI orchestrator function
 */

import { updateStats } from './stats.js';
import { renderParrotGrid } from './parrotGrid.js';
import { renderBreedingSlots } from './breedingSlots.js';
import { updatePreview } from './preview.js';

/**
 * Update entire UI (master update function)
 * Orchestrates all UI updates across different modules
 */
export async function updateUI() {
    updateStats();
    await renderParrotGrid();
    await renderBreedingSlots();
    await updatePreview();
}
