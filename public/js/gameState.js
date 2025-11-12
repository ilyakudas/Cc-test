/**
 * ChromaWing Breeding Simulator - Game State Module
 * Centralizes all global game state
 */

// Core game state
export let parrots = [];
export let storeParrots = [];
export let selectedParrotId = null;
export let breedingPair = { left: null, right: null };
export let currentTab = 'collection';
export let coins = 500;
export let parrotIdCounter = 0;
export let generation = 1;
export let svgCache = null;
export let gradientIdCounter = 0;
export let examinedParrots = new Set();

// Contest state
export let contestProgress = {};
export let parrotTrophies = {};

// Achievement state
export let achievements = {
    unlocked: [],
    progress: {}
};

// Mutation system state
export let mutationsEnabled = true;
export let mutationRate = 0.05;

// Parrot names tracking
export let usedNames = new Set();

// Notification state
export let notificationHistory = [];
export let toastIdCounter = 0;

// Setters for state updates
export function setParrots(newParrots) {
    parrots = newParrots;
}

export function addParrot(parrot) {
    parrots.push(parrot);
}

export function removeParrot(parrotId) {
    const index = parrots.findIndex(p => p.id === parrotId);
    if (index !== -1) {
        parrots.splice(index, 1);
    }
}

export function setStoreParrots(newStoreParrots) {
    storeParrots = newStoreParrots;
}

export function setSelectedParrotId(id) {
    selectedParrotId = id;
}

export function setBreedingPair(newPair) {
    breedingPair = newPair;
}

export function setBreedingSlot(slot, parrotId) {
    breedingPair[slot] = parrotId;
}

export function clearBreedingPair() {
    breedingPair = { left: null, right: null };
}

export function setCurrentTab(tab) {
    currentTab = tab;
}

export function setCoins(amount) {
    coins = amount;
}

export function addCoins(amount) {
    coins += amount;
}

export function subtractCoins(amount) {
    coins -= amount;
}

export function incrementParrotIdCounter() {
    return parrotIdCounter++;
}

export function setGeneration(gen) {
    generation = gen;
}

export function incrementGeneration() {
    generation++;
}

export function setSvgCache(cache) {
    svgCache = cache;
}

export function getNextGradientId() {
    return gradientIdCounter++;
}

export function addExaminedParrot(parrotId) {
    examinedParrots.add(parrotId);
}

export function hasExaminedParrot(parrotId) {
    return examinedParrots.has(parrotId);
}

export function setContestProgress(progress) {
    contestProgress = progress;
}

export function setParrotTrophies(trophies) {
    parrotTrophies = trophies;
}

export function setAchievements(newAchievements) {
    achievements = newAchievements;
}

export function addUnlockedAchievement(achievementId) {
    if (!achievements.unlocked.includes(achievementId)) {
        achievements.unlocked.push(achievementId);
    }
}

export function setMutationsEnabled(enabled) {
    mutationsEnabled = enabled;
}

export function toggleMutationsEnabled() {
    mutationsEnabled = !mutationsEnabled;
    return mutationsEnabled;
}

export function setMutationRate(rate) {
    mutationRate = rate;
}

export function addUsedName(name) {
    usedNames.add(name);
}

export function clearUsedNames() {
    usedNames.clear();
}

export function setNotificationHistory(history) {
    notificationHistory = history;
}

export function addNotification(notification) {
    notificationHistory.push(notification);
}

export function clearNotifications() {
    notificationHistory = [];
}

export function getNextToastId() {
    return toastIdCounter++;
}

// Getters for read-only access
export function getParrots() {
    return parrots;
}

export function getParrotById(id) {
    return parrots.find(p => p.id === id);
}

export function getStoreParrots() {
    return storeParrots;
}

export function getSelectedParrot() {
    return parrots.find(p => p.id === selectedParrotId);
}

export function getBreedingParents() {
    const left = breedingPair.left !== null ? parrots.find(p => p.id === breedingPair.left) : null;
    const right = breedingPair.right !== null ? parrots.find(p => p.id === breedingPair.right) : null;
    return { left, right };
}

export function getCoins() {
    return coins;
}

export function getGeneration() {
    return generation;
}

export function getSvgCache() {
    return svgCache;
}

export function getMutationsEnabled() {
    return mutationsEnabled;
}

export function getMutationRate() {
    return mutationRate;
}

export function getUsedNames() {
    return usedNames;
}

export function getContestProgress() {
    return contestProgress;
}

export function getParrotTrophies() {
    return parrotTrophies;
}

export function getAchievements() {
    return achievements;
}

export function getNotificationHistory() {
    return notificationHistory;
}

// Reset entire game state
export function resetGameState() {
    parrots = [];
    storeParrots = [];
    selectedParrotId = null;
    breedingPair = { left: null, right: null };
    currentTab = 'collection';
    coins = 500;
    parrotIdCounter = 0;
    generation = 1;
    svgCache = null;
    gradientIdCounter = 0;
    examinedParrots = new Set();
    contestProgress = {};
    parrotTrophies = {};
    achievements = {
        unlocked: [],
        progress: {}
    };
    mutationsEnabled = true;
    mutationRate = 0.05;
    usedNames = new Set();
    notificationHistory = [];
    toastIdCounter = 0;
}
