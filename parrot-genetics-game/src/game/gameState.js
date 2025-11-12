// ChromaWing - Game State Management
// v3.0

// Game State
export const state = {
    parrots: [],
    storeParrots: [],
    selectedParrotId: null,
    breedingPair: { left: null, right: null },
    currentTab: 'collection',
    coins: 500,
    parrotIdCounter: 0,
    generation: 1,
    gradientIdCounter: 0,
    examinedParrots: new Set(),

    // Contest State
    contestProgress: {},
    parrotTrophies: {},

    // Achievement State
    achievements: {
        unlocked: [],
        progress: {}
    },

    // Mutation System
    mutationsEnabled: true,

    // Name tracking
    usedNames: new Set()
};

// State Getters
export function getNextParrotId() {
    return state.parrotIdCounter++;
}

export function getNextGradientId() {
    return state.gradientIdCounter++;
}

export function getParrotById(id) {
    return state.parrots.find(p => p.id === id);
}

export function getStoreParrotById(id) {
    return state.storeParrots.find(p => p.id === id);
}

// State Setters
export function addParrot(parrot) {
    state.parrots.push(parrot);
    if (parrot.generation > state.generation) {
        state.generation = parrot.generation;
    }
}

export function removeParrot(id) {
    state.parrots = state.parrots.filter(p => p.id !== id);
}

export function setCoins(amount) {
    state.coins = amount;
}

export function addCoins(amount) {
    state.coins += amount;
}

export function spendCoins(amount) {
    if (state.coins >= amount) {
        state.coins -= amount;
        return true;
    }
    return false;
}

export function setSelectedParrot(id) {
    state.selectedParrotId = id;
}

export function setBreedingLeft(parrotId) {
    state.breedingPair.left = parrotId;
}

export function setBreedingRight(parrotId) {
    state.breedingPair.right = parrotId;
}

export function clearBreedingPair() {
    state.breedingPair = { left: null, right: null };
}

export function setCurrentTab(tab) {
    state.currentTab = tab;
}

export function setMutationsEnabled(enabled) {
    state.mutationsEnabled = enabled;
}

export function toggleMutations() {
    state.mutationsEnabled = !state.mutationsEnabled;
    return state.mutationsEnabled;
}

// Achievement Functions
export function unlockAchievement(achievementId) {
    if (!state.achievements.unlocked.includes(achievementId)) {
        state.achievements.unlocked.push(achievementId);
        return true;
    }
    return false;
}

export function updateAchievementProgress(key, value) {
    state.achievements.progress[key] = value;
}

export function incrementAchievementProgress(key, amount = 1) {
    state.achievements.progress[key] = (state.achievements.progress[key] || 0) + amount;
}

// Contest Progress Functions
export function setContestProgress(parrotId, tierIndex, result) {
    if (!state.contestProgress[parrotId]) {
        state.contestProgress[parrotId] = {};
    }
    state.contestProgress[parrotId][tierIndex] = result;
}

export function getContestProgress(parrotId, tierIndex) {
    return state.contestProgress[parrotId]?.[tierIndex];
}

export function addParrotTrophy(parrotId, badge) {
    if (!state.parrotTrophies[parrotId]) {
        state.parrotTrophies[parrotId] = [];
    }
    state.parrotTrophies[parrotId].push(badge);
}

export function getParrotTrophies(parrotId) {
    return state.parrotTrophies[parrotId] || [];
}

// Examined Parrots
export function markParrotExamined(parrotId) {
    state.examinedParrots.add(parrotId);
}

export function isParrotExamined(parrotId) {
    return state.examinedParrots.has(parrotId);
}

// Reset game state
export function resetGame() {
    state.parrots = [];
    state.storeParrots = [];
    state.selectedParrotId = null;
    state.breedingPair = { left: null, right: null };
    state.currentTab = 'collection';
    state.coins = 500;
    state.parrotIdCounter = 0;
    state.generation = 1;
    state.gradientIdCounter = 0;
    state.examinedParrots = new Set();
    state.contestProgress = {};
    state.parrotTrophies = {};
    state.achievements = {
        unlocked: [],
        progress: {}
    };
    state.mutationsEnabled = true;
    state.usedNames = new Set();
}
