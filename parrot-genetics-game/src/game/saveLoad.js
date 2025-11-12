// ChromaWing - Save/Load System
// v3.0

import { state, resetGame } from './gameState.js';
import { Parrot } from '../models/Parrot.js';
import { showToast } from '../ui/notifications.js';

const SAVE_KEY = 'chromawing_save';
const AUTO_SAVE_INTERVAL = 30000; // Auto-save every 30 seconds

let autoSaveTimer = null;

/**
 * Serialize game state to JSON-friendly format
 */
export function serializeGameState() {
    return {
        parrots: state.parrots.map(p => ({
            id: p.id,
            name: p.name,
            genes: p.genes,
            generation: p.generation
        })),
        storeParrots: state.storeParrots.map(p => ({
            id: p.id,
            name: p.name,
            genes: p.genes,
            generation: p.generation
        })),
        selectedParrotId: state.selectedParrotId,
        breedingPair: state.breedingPair,
        currentTab: state.currentTab,
        coins: state.coins,
        parrotIdCounter: state.parrotIdCounter,
        generation: state.generation,
        gradientIdCounter: state.gradientIdCounter,
        examinedParrots: Array.from(state.examinedParrots),
        contestProgress: state.contestProgress,
        parrotTrophies: state.parrotTrophies,
        achievements: {
            unlocked: [...state.achievements.unlocked],
            progress: { ...state.achievements.progress }
        },
        mutationsEnabled: state.mutationsEnabled,
        usedNames: Array.from(state.usedNames),
        saveDate: new Date().toISOString(),
        version: '3.0'
    };
}

/**
 * Deserialize JSON data and restore game state
 */
export function deserializeGameState(data) {
    // Restore parrot collections
    state.parrots = data.parrots.map(p =>
        new Parrot(p.name, p.genes, p.generation, p.id)
    );

    state.storeParrots = data.storeParrots.map(p =>
        new Parrot(p.name, p.genes, p.generation, p.id)
    );

    // Restore simple state
    state.selectedParrotId = data.selectedParrotId;
    state.breedingPair = data.breedingPair;
    state.currentTab = data.currentTab || 'collection';
    state.coins = data.coins;
    state.parrotIdCounter = data.parrotIdCounter;
    state.generation = data.generation;
    state.gradientIdCounter = data.gradientIdCounter;

    // Restore Sets
    state.examinedParrots = new Set(data.examinedParrots || []);
    state.usedNames = new Set(data.usedNames || []);

    // Restore contest and achievement state
    state.contestProgress = data.contestProgress || {};
    state.parrotTrophies = data.parrotTrophies || {};
    state.achievements = {
        unlocked: data.achievements?.unlocked || [],
        progress: data.achievements?.progress || {}
    };

    state.mutationsEnabled = data.mutationsEnabled !== undefined ? data.mutationsEnabled : true;
}

/**
 * Save game to localStorage
 */
export function saveGame() {
    try {
        const serialized = serializeGameState();
        const jsonString = JSON.stringify(serialized);
        localStorage.setItem(SAVE_KEY, jsonString);

        console.log('[Save] Game saved successfully');
        showToast('Game Saved', 'Your progress has been saved', 'success');
        return true;
    } catch (error) {
        console.error('[Save] Failed to save game:', error);
        showToast('Save Failed', 'Could not save game progress', 'error');
        return false;
    }
}

/**
 * Load game from localStorage
 */
export function loadGame() {
    try {
        const jsonString = localStorage.getItem(SAVE_KEY);

        if (!jsonString) {
            console.log('[Load] No save data found');
            return false;
        }

        const data = JSON.parse(jsonString);

        // Version check
        if (data.version !== '3.0') {
            console.warn('[Load] Save file version mismatch');
            showToast('Warning', 'Save file from different version', 'warning');
        }

        deserializeGameState(data);

        console.log('[Load] Game loaded successfully');
        console.log('[Load] Loaded:', {
            parrots: state.parrots.length,
            coins: state.coins,
            generation: state.generation
        });

        showToast('Game Loaded', `Loaded ${state.parrots.length} parrots, ${state.coins} coins`, 'success');
        return true;
    } catch (error) {
        console.error('[Load] Failed to load game:', error);
        showToast('Load Failed', 'Could not load saved game', 'error');
        return false;
    }
}

/**
 * Check if save data exists
 */
export function hasSaveData() {
    return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Delete save data
 */
export function deleteSaveData() {
    try {
        localStorage.removeItem(SAVE_KEY);
        console.log('[Save] Save data deleted');
        return true;
    } catch (error) {
        console.error('[Save] Failed to delete save data:', error);
        return false;
    }
}

/**
 * Get save file info
 */
export function getSaveInfo() {
    try {
        const jsonString = localStorage.getItem(SAVE_KEY);
        if (!jsonString) return null;

        const data = JSON.parse(jsonString);
        return {
            saveDate: data.saveDate,
            version: data.version,
            parrots: data.parrots.length,
            coins: data.coins,
            generation: data.generation
        };
    } catch (error) {
        console.error('[Save] Failed to get save info:', error);
        return null;
    }
}

/**
 * Enable auto-save functionality
 */
export function enableAutoSave() {
    if (autoSaveTimer) {
        console.warn('[AutoSave] Already enabled');
        return;
    }

    autoSaveTimer = setInterval(() => {
        console.log('[AutoSave] Auto-saving game...');
        saveGame();
    }, AUTO_SAVE_INTERVAL);

    console.log('[AutoSave] Enabled (every 30 seconds)');
}

/**
 * Disable auto-save functionality
 */
export function disableAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
        console.log('[AutoSave] Disabled');
    }
}

/**
 * Export game data as downloadable JSON
 */
export function exportSaveData() {
    try {
        const serialized = serializeGameState();
        const jsonString = JSON.stringify(serialized, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `chromawing_save_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();

        URL.revokeObjectURL(url);
        showToast('Export Success', 'Save file downloaded', 'success');
        return true;
    } catch (error) {
        console.error('[Export] Failed to export save:', error);
        showToast('Export Failed', 'Could not export save file', 'error');
        return false;
    }
}

/**
 * Import game data from JSON file
 */
export function importSaveData(fileContent) {
    try {
        const data = JSON.parse(fileContent);
        deserializeGameState(data);

        // Save to localStorage
        localStorage.setItem(SAVE_KEY, fileContent);

        showToast('Import Success', 'Save file imported', 'success');
        return true;
    } catch (error) {
        console.error('[Import] Failed to import save:', error);
        showToast('Import Failed', 'Invalid save file format', 'error');
        return false;
    }
}
