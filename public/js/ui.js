/**
 * ChromaWing Breeding Simulator - UI Module
 * Main UI module that re-exports from focused sub-modules
 *
 * This file serves as the main entry point for UI functionality.
 * All implementation has been split into focused modules in ./ui/
 */

// Core orchestrator
export { updateUI } from './ui/core.js';

// Tab navigation and breeding lab
export { switchTab, updateBreedingLab } from './ui/tabs.js';

// Stats display
export { updateStats } from './ui/stats.js';

// Parrot card creation
export { createParrotCard } from './ui/parrotCard.js';

// Breeding slots management
export {
    renderBreedingSlots,
    updateBreedButton,
    updateHeartButton,
    createBreedingSlotsComponent
} from './ui/breedingSlots.js';

// Parrot grid rendering
export { renderParrotGrid } from './ui/parrotGrid.js';

// Preview panel
export { updatePreview } from './ui/preview.js';

// Mutation display
export { updateMutationDisplay } from './ui/mutations.js';
