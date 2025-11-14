/**
 * ChromaWing Breeding Simulator - Actions Module
 * Re-export facade for backward compatibility
 *
 * This file re-exports all action modules for backward compatibility.
 * Individual modules are in the actions/ directory.
 */

// Re-export all action modules
export { selectParrot } from './actions/selection.js';
export { breedOnLeft, breedOnRight, removeFromSlot, breedParrots } from './actions/breeding.js';
export { buyParrot, startSellHold, cancelSellHold } from './actions/trading.js';
export { freeParrot, toggleLockParrot } from './actions/collection.js';
export { openLaboratory, performExamination, closeModal } from './actions/laboratory.js';
export { moveOffspringToCollection, sellAllOffspring, dismissOffspring } from './actions/offspring.js';
export { toggleMutations, toggleAutoExamine } from './actions/settings.js';
