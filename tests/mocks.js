/**
 * Browser API Mocks for Node.js Testing
 * Provides minimal implementations of browser APIs needed for headless simulation
 */

// Mock localStorage
export class MockLocalStorage {
    constructor() {
        this.store = new Map();
    }

    getItem(key) {
        return this.store.get(key) || null;
    }

    setItem(key, value) {
        this.store.set(key, String(value));
    }

    removeItem(key) {
        this.store.delete(key);
    }

    clear() {
        this.store.clear();
    }

    get length() {
        return this.store.size;
    }
}

// Mock notifications (no-op for headless)
export const mockShowToast = (title, message, type) => {
    // Silent in headless mode - tests can override if needed
};

// Mock UI updates (no-op for headless)
export const mockUI = {
    updateUI: async () => {},
    updateStats: () => {},
    renderParrotGrid: async () => {},
    renderStoreGrid: async () => {},
    renderBreedingSlots: async () => {},
    updateBreedButton: () => {},
    updatePreview: async () => {},
    renderOffspringGrid: async () => {},
    showLaboratoryModal: async () => {}
};

// Mock global objects for Node.js environment
export function setupMockGlobals() {
    global.localStorage = new MockLocalStorage();

    // Mock minimal window object if needed
    if (typeof window === 'undefined') {
        global.window = {
            localStorage: global.localStorage
        };
    }
}

// Clean up mocks
export function cleanupMocks() {
    if (global.localStorage) {
        global.localStorage.clear();
    }
}
