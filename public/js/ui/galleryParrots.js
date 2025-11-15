/**
 * ChromaWing Breeding Simulator - Gallery Parrots Module
 * Beautiful showcase parrots based on RYB color wheel
 */

import Parrot from '../core/parrot.js';
import { generateParrotSVG } from '../lib/svg.js';

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
 */
const GALLERY_PARROTS = [
    {
        id: 'gallery-sunset',
        name: '🌅 Sunset Serenade',
        theme: 'Warm sunset gradient',
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
        name: '🌊 Ocean Depths',
        theme: 'Cool ocean blues',
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
        name: '🌲 Forest Canopy',
        theme: 'Lush forest greens',
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
        name: '👑 Royal Majesty',
        theme: 'Regal purples and violets',
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
        name: '🔥 Phoenix Flame',
        theme: 'Fiery reds and oranges',
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
        name: '☀️ Golden Sunshine',
        theme: 'Bright yellows and golds',
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
        name: '🌆 Twilight Dreams',
        theme: 'Magical purple-orange contrast',
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
        name: '🌸 Spring Blossom',
        theme: 'Soft magenta and chartreuse',
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
        name: '✨ Aurora Borealis',
        theme: 'Northern lights spectrum',
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
        name: '💎 Ruby Radiance',
        theme: 'Deep crimson reds',
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
        name: '💚 Emerald Garden',
        theme: 'Rich emerald greens',
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
        name: '💙 Sapphire Sky',
        theme: 'Deep sapphire blues',
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
        r: [false, false, false, false],
        g: [false, false, false, false],
        b: [false, false, false, false]
    };

    // Convert 0-255 to number of true alleles (0-4)
    const rCount = Math.round((rgb.r / 255) * 4);
    const gCount = Math.round((rgb.g / 255) * 4);
    const bCount = Math.round((rgb.b / 255) * 4);

    // Set alleles to true based on count
    for (let i = 0; i < rCount; i++) genes.r[i] = true;
    for (let i = 0; i < gCount; i++) genes.g[i] = true;
    for (let i = 0; i < bCount; i++) genes.b[i] = true;

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

    // Create parrot with these genes
    const parrot = new Parrot(definition.id, definition.name, genes, 1, 'gallery');
    parrot.galleryTheme = definition.theme;

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
        parrots: [],
        loading: true,
        selectedGalleryParrot: null,

        // Initialize component
        async init() {
            console.log('Gallery component initializing...');
            await this.loadGalleryParrots();
        },

        // Load gallery parrots
        async loadGalleryParrots() {
            this.loading = true;
            try {
                this.parrots = getGalleryParrots();
                console.log(`Loaded ${this.parrots.length} gallery parrots`);
            } catch (error) {
                console.error('Error loading gallery parrots:', error);
            } finally {
                this.loading = false;
            }
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
