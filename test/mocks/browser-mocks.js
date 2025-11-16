/**
 * Browser API Mocks for Node.js Testing
 * Provides mock implementations of browser APIs needed by game modules
 */

/**
 * Mock localStorage
 */
export class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }

    clear() {
        this.store = {};
    }
}

/**
 * Mock document (minimal implementation)
 */
export class DocumentMock {
    constructor() {
        this.elements = new Map();
    }

    getElementById(id) {
        if (!this.elements.has(id)) {
            this.elements.set(id, new ElementMock(id));
        }
        return this.elements.get(id);
    }
}

/**
 * Mock DOM element
 */
export class ElementMock {
    constructor(id) {
        this.id = id;
        this.disabled = false;
        this.innerHTML = '';
        this.style = {};
        this.classList = new ClassListMock();
    }
}

/**
 * Mock classList
 */
export class ClassListMock {
    constructor() {
        this.classes = new Set();
    }

    add(className) {
        this.classes.add(className);
    }

    remove(className) {
        this.classes.delete(className);
    }

    contains(className) {
        return this.classes.has(className);
    }
}

/**
 * Initialize global mocks for Node.js environment
 */
export function initializeMocks() {
    global.localStorage = new LocalStorageMock();
    global.document = new DocumentMock();

    // Mock console methods if needed (keep original for debugging)
    // global.console.log = () => {};
}

/**
 * Reset all mocks to clean state
 */
export function resetMocks() {
    if (global.localStorage) {
        global.localStorage.clear();
    }
    if (global.document) {
        global.document = new DocumentMock();
    }
}
