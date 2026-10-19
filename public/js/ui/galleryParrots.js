/**
 * ChromaWing Breeding Simulator - Gallery Parrots Module
 * Beautiful showcase parrots based on RYB color wheel
 */

import { Parrot } from '../core/parrot.js';
import { generateParrotSVG } from '../lib/svg.js';
import * as i18n from '../lib/i18n.js';

/**
 * RYB Color Wheel - Artist's traditional color wheel
 * Each color has a name, hex value, and position on the wheel
 */
const RYB_COLOR_WHEEL = {
    // Primary Colors
    red: { hex: '#FF0000', angle: 0, name: 'Red' },
    yellow: { hex: '#FFFF00', angle: 120, name: 'Yellow' },
    blue: { hex: '#0000FF', angle: 240, name: 'Blue' },

    // Secondary Colors
    orange: { hex: '#FF8000', angle: 60, name: 'Orange' },
    green: { hex: '#00FF00', angle: 180, name: 'Green' },
    violet: { hex: '#8000FF', angle: 300, name: 'Violet' },

    // Tertiary Colors
    vermilion: { hex: '#FF4000', angle: 30, name: 'Vermilion' },
    amber: { hex: '#FFBF00', angle: 90, name: 'Amber' },
    chartreuse: { hex: '#80FF00', angle: 150, name: 'Chartreuse' },
    teal: { hex: '#00FF80', angle: 210, name: 'Teal' },
    indigo: { hex: '#4000FF', angle: 270, name: 'Indigo' },
    magenta: { hex: '#FF00FF', angle: 330, name: 'Magenta' }
};

/**
 * Gallery parrot definitions with RYB-based color schemes
 * Each parrot has a theme name based on their color palette
 * Names and themes use i18n translation keys
 */
const GALLERY_PARROTS = [
    {
        id: 'gallery-sunset',
        emoji: '🌅',
        nameKey: 'galleryParrots.sunsetSerenade',
        themeKey: 'galleryParrots.sunsetSerenadeTheme',
        colors: {
            wings: 'orange',
            special_wing: 'vermilion',
            body: 'amber',
            head: 'yellow',
            tail: 'orange',
            accents: 'vermilion'
        },
        gradient: { wings: true, body: true, tail: true }
    },
    {
        id: 'gallery-ocean',
        emoji: '🌊',
        nameKey: 'galleryParrots.oceanDepths',
        themeKey: 'galleryParrots.oceanDepthsTheme',
        colors: {
            wings: 'teal',
            special_wing: 'blue',
            body: 'teal',
            head: 'indigo',
            tail: 'blue',
            accents: 'teal'
        },
        gradient: { wings: true, special_wing: true, tail: true }
    },
    {
        id: 'gallery-forest',
        emoji: '🌲',
        nameKey: 'galleryParrots.forestCanopy',
        themeKey: 'galleryParrots.forestCanopyTheme',
        colors: {
            wings: 'chartreuse',
            special_wing: 'green',
            body: 'green',
            head: 'chartreuse',
            tail: 'green',
            accents: 'teal'
        },
        gradient: { body: true, tail: true }
    },
    {
        id: 'gallery-royal',
        emoji: '👑',
        nameKey: 'galleryParrots.royalMajesty',
        themeKey: 'galleryParrots.royalMajestyTheme',
        colors: {
            wings: 'violet',
            special_wing: 'indigo',
            body: 'violet',
            head: 'magenta',
            tail: 'violet',
            accents: 'indigo'
        },
        gradient: { wings: true, body: true, special_wing: true }
    },
    {
        id: 'gallery-fire',
        emoji: '🔥',
        nameKey: 'galleryParrots.phoenixFlame',
        themeKey: 'galleryParrots.phoenixFlameTheme',
        colors: {
            wings: 'red',
            special_wing: 'vermilion',
            body: 'orange',
            head: 'vermilion',
            tail: 'red',
            accents: 'orange'
        },
        gradient: { wings: true, tail: true, body: true }
    },
    {
        id: 'gallery-sunshine',
        emoji: '☀️',
        nameKey: 'galleryParrots.goldenSunshine',
        themeKey: 'galleryParrots.goldenSunshineTheme',
        colors: {
            wings: 'yellow',
            special_wing: 'amber',
            body: 'amber',
            head: 'yellow',
            tail: 'amber',
            accents: 'orange'
        },
        gradient: { wings: true, body: true }
    },
    {
        id: 'gallery-twilight',
        emoji: '🌆',
        nameKey: 'galleryParrots.twilightDreams',
        themeKey: 'galleryParrots.twilightDreamsTheme',
        colors: {
            wings: 'violet',
            special_wing: 'magenta',
            body: 'orange',
            head: 'amber',
            tail: 'indigo',
            accents: 'vermilion'
        },
        gradient: { wings: true, special_wing: true, tail: true }
    },
    {
        id: 'gallery-spring',
        emoji: '🌸',
        nameKey: 'galleryParrots.springBlossom',
        themeKey: 'galleryParrots.springBlossomTheme',
        colors: {
            wings: 'magenta',
            special_wing: 'vermilion',
            body: 'chartreuse',
            head: 'yellow',
            tail: 'magenta',
            accents: 'amber'
        },
        gradient: { wings: true, body: true }
    },
    {
        id: 'gallery-aurora',
        emoji: '✨',
        nameKey: 'galleryParrots.auroraBorealis',
        themeKey: 'galleryParrots.auroraBorealisTheme',
        colors: {
            wings: 'teal',
            special_wing: 'green',
            body: 'violet',
            head: 'indigo',
            tail: 'magenta',
            accents: 'blue'
        },
        gradient: { wings: true, special_wing: true, body: true, tail: true }
    },
    {
        id: 'gallery-ruby',
        emoji: '💎',
        nameKey: 'galleryParrots.rubyRadiance',
        themeKey: 'galleryParrots.rubyRadianceTheme',
        colors: {
            wings: 'red',
            special_wing: 'vermilion',
            body: 'red',
            head: 'magenta',
            tail: 'red',
            accents: 'vermilion'
        },
        gradient: { special_wing: true, tail: true }
    },
    {
        id: 'gallery-emerald',
        emoji: '💚',
        nameKey: 'galleryParrots.emeraldGarden',
        themeKey: 'galleryParrots.emeraldGardenTheme',
        colors: {
            wings: 'green',
            special_wing: 'teal',
            body: 'chartreuse',
            head: 'green',
            tail: 'green',
            accents: 'teal'
        },
        gradient: { wings: true, tail: true }
    },
    {
        id: 'gallery-sapphire',
        emoji: '💙',
        nameKey: 'galleryParrots.sapphireSky',
        themeKey: 'galleryParrots.sapphireSkyTheme',
        colors: {
            wings: 'blue',
            special_wing: 'indigo',
            body: 'blue',
            head: 'teal',
            tail: 'indigo',
            accents: 'blue'
        },
        gradient: { wings: true, body: true, tail: true }
    }
];

/**
 * Convert color name to RGB values (0-255)
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Create genes for a body part based on RGB values
 * Converts RGB (0-255) to genetic representation (4 alleles each for R, G, B)
 */
function createGenesFromRgb(rgb) {
    const genes = {
        red: [false, false, false, false],
        green: [false, false, false, false],
        blue: [false, false, false, false],
        gradient: false
    };

    // Convert 0-255 to number of true alleles (0-4)
    const rCount = Math.round((rgb.r / 255) * 4);
    const gCount = Math.round((rgb.g / 255) * 4);
    const bCount = Math.round((rgb.b / 255) * 4);

    // Set alleles to true based on count
    for (let i = 0; i < rCount; i++) genes.red[i] = true;
    for (let i = 0; i < gCount; i++) genes.green[i] = true;
    for (let i = 0; i < bCount; i++) genes.blue[i] = true;

    return genes;
}

/**
 * Generate gallery parrot from definition
 */
function createGalleryParrot(definition) {
    // Create genes for each body part
    const genes = {};

    Object.keys(definition.colors).forEach(bodyPart => {
        const colorName = definition.colors[bodyPart];
        const colorData = RYB_COLOR_WHEEL[colorName];
        const rgb = hexToRgb(colorData.hex);

        genes[bodyPart] = createGenesFromRgb(rgb);

        // Set gradient flag if specified
        if (definition.gradient && definition.gradient[bodyPart]) {
            genes[bodyPart].gradient = true;
        } else {
            genes[bodyPart].gradient = false;
        }
    });

    // Translate name and theme using i18n
    const translatedName = `${definition.emoji} ${i18n.t(definition.nameKey)}`;
    const translatedTheme = i18n.t(definition.themeKey);

    // Create parrot with these genes
    // Constructor signature: (name, genes, generation = 1, id = null)
    const parrot = new Parrot(translatedName, genes, 1, definition.id);
    parrot.galleryTheme = translatedTheme;

    return parrot;
}

/**
 * Get all gallery parrots
 */
export function getGalleryParrots() {
    return GALLERY_PARROTS.map(def => createGalleryParrot(def));
}

/**
 * Create Alpine.js reactive component for gallery
 * @returns {Object} Alpine.js component definition
 */
export function createGalleryComponent() {
    return {
        curatedParrots: [],
        customParrots: [],
        loading: true,
        selectedGalleryParrot: null,

        // Initialize component
        async init() {
            console.log('Gallery component initializing...');
            await this.loadGalleryParrots();
        },

        // Load gallery parrots (both curated and custom)
        async loadGalleryParrots() {
            this.loading = true;
            try {
                // Load curated RYB parrots
                this.curatedParrots = getGalleryParrots();
                console.log(`Loaded ${this.curatedParrots.length} curated parrots`);

                // Load custom parrots from localStorage
                this.loadCustomParrots();
            } catch (error) {
                console.error('Error loading gallery parrots:', error);
            } finally {
                this.loading = false;
            }
        },

        // Load custom parrots from localStorage
        loadCustomParrots() {
            try {
                const saved = localStorage.getItem('chromawing_custom_gallery');
                if (saved) {
                    const customData = JSON.parse(saved);
                    // Convert custom data to Parrot objects
                    this.customParrots = customData.map(data => {
                        const parrot = new Parrot(data.name, data.genes, 1, data.id);
                        parrot.isCustom = true;
                        parrot.created = data.created;
                        return parrot;
                    });
                    console.log(`Loaded ${this.customParrots.length} custom parrots`);
                } else {
                    this.customParrots = [];
                }
            } catch (error) {
                console.error('Error loading custom parrots:', error);
                this.customParrots = [];
            }
        },

        // Delete a custom parrot
        deleteCustomParrot(parrot) {
            if (!parrot.isCustom) {
                alert('Cannot delete curated parrots!');
                return;
            }

            if (!confirm(`Delete "${parrot.name}"?`)) {
                return;
            }

            try {
                // Remove from array
                const index = this.customParrots.findIndex(p => p.id === parrot.id);
                if (index !== -1) {
                    this.customParrots.splice(index, 1);
                }

                // Update localStorage
                const customData = this.customParrots.map(p => ({
                    id: p.id,
                    name: p.name,
                    genes: p.genes,
                    created: p.created
                }));
                localStorage.setItem('chromawing_custom_gallery', JSON.stringify(customData));

                console.log('Deleted custom parrot:', parrot.name);
            } catch (error) {
                console.error('Error deleting custom parrot:', error);
                alert('Failed to delete parrot!');
            }
        },

        // Clone a parrot to Color Lab
        cloneToColorLab(parrot) {
            console.log('[GALLERY] Clone button clicked for:', parrot.name);

            // Switch to Color Lab tab FIRST so the elements are visible
            if (window.switchTabHandler) {
                console.log('[GALLERY] Switching to Color Lab tab...');
                window.switchTabHandler('colorlab');
            }

            // Dispatch custom event with parrot data
            // This allows Alpine to handle it in its reactive context
            setTimeout(() => {
                console.log('[GALLERY] Dispatching load-parrot event');
                const event = new CustomEvent('load-parrot', {
                    detail: {
                        name: parrot.name,
                        genes: parrot.genes
                    }
                });
                window.dispatchEvent(event);
            }, 100);  // Small delay to ensure tab switch completes
        },

        // Get SVG for a parrot
        async getParrotSVG(parrot) {
            return await generateParrotSVG(parrot);
        },

        // Select a parrot to view details
        selectParrot(parrot) {
            this.selectedGalleryParrot = parrot;
            console.log('Selected gallery parrot:', parrot.name);
        }
    };
}
