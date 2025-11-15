/**
 * ChromaWing Breeding Simulator - Color Lab Module
 * Interactive gene editor for creating custom parrots
 */

import { Parrot } from '../core/parrot.js';
import { generateParrotSVG } from '../lib/svg.js';
import * as GameState from '../core/gameState.js';

/**
 * Body parts that can be customized
 */
const BODY_PARTS = [
    { key: 'wings', label: 'Wings', icon: '🪽' },
    { key: 'special_wing', label: 'Special Wing', icon: '✨' },
    { key: 'body', label: 'Body', icon: '🦜' },
    { key: 'head', label: 'Head', icon: '👁️' },
    { key: 'tail', label: 'Tail', icon: '🎨' },
    { key: 'accents', label: 'Accents', icon: '💫' }
];

/**
 * Create default genes (all false, no gradient)
 */
function createDefaultGenes() {
    const genes = {};
    BODY_PARTS.forEach(part => {
        genes[part.key] = {
            red: [false, false, false, false],
            green: [false, false, false, false],
            blue: [false, false, false, false],
            gradient: false
        };
    });
    return genes;
}

/**
 * Create Alpine.js reactive component for Color Lab
 * @returns {Object} Alpine.js component definition
 */
export function createColorLabComponent() {
    return {
        // Current parrot being edited
        currentGenes: null,
        parrotName: 'Custom Parrot',
        previewParrot: null,
        previewSVG: '',

        // UI state
        selectedBodyPart: 'wings',
        loading: false,

        // Initialize component
        async init() {
            console.log('Color Lab component initializing...');
            this.resetToDefault();

            // Listen for load-parrot events from Gallery
            window.addEventListener('load-parrot', (event) => {
                console.log('[COLORLAB] Received load-parrot event');
                this.handleLoadParrot(event.detail);
            });
        },

        // Reset to default (all genes off)
        resetToDefault() {
            this.currentGenes = createDefaultGenes();
            this.parrotName = 'Custom Parrot';
            this.updatePreview();
        },

        // Randomize all genes
        randomize() {
            const genes = {};
            BODY_PARTS.forEach(part => {
                genes[part.key] = {
                    red: [
                        Math.random() > 0.5,
                        Math.random() > 0.5,
                        Math.random() > 0.5,
                        Math.random() > 0.5
                    ],
                    green: [
                        Math.random() > 0.5,
                        Math.random() > 0.5,
                        Math.random() > 0.5,
                        Math.random() > 0.5
                    ],
                    blue: [
                        Math.random() > 0.5,
                        Math.random() > 0.5,
                        Math.random() > 0.5,
                        Math.random() > 0.5
                    ],
                    gradient: Math.random() > 0.7  // 30% chance of gradient
                };
            });
            this.currentGenes = genes;
            this.updatePreview();
        },

        // Toggle a specific gene
        toggleGene(bodyPart, color, index) {
            this.currentGenes[bodyPart][color][index] = !this.currentGenes[bodyPart][color][index];
            this.updatePreview();
        },

        // Toggle gradient for a body part
        toggleGradient(bodyPart) {
            this.currentGenes[bodyPart].gradient = !this.currentGenes[bodyPart].gradient;
            this.updatePreview();
        },

        // Set all genes of a color to a specific value
        setAllGenesOfColor(bodyPart, color, value) {
            for (let i = 0; i < 4; i++) {
                this.currentGenes[bodyPart][color][i] = value;
            }
            this.updatePreview();
        },

        // Update the preview parrot
        async updatePreview() {
            // Create a temporary parrot with current genes
            this.previewParrot = new Parrot(this.parrotName, this.currentGenes, 1, 'colorlab-preview');
            this.previewSVG = await generateParrotSVG(this.previewParrot);
        },

        // Save current design to Gallery (My Creations)
        saveToGallery() {
            if (!this.parrotName || this.parrotName.trim() === '') {
                alert('Please enter a name for your parrot!');
                return;
            }

            // Get existing custom parrots from localStorage
            const customParrots = this.getCustomParrots();

            // Create new custom parrot
            const customParrot = {
                id: 'custom-' + Date.now(),
                name: this.parrotName,
                genes: JSON.parse(JSON.stringify(this.currentGenes)),  // Deep copy
                created: Date.now()
            };

            // Add to collection
            customParrots.push(customParrot);

            // Save to localStorage
            localStorage.setItem('chromawing_custom_gallery', JSON.stringify(customParrots));

            // Show confirmation
            console.log('Saved custom parrot to gallery:', customParrot.name);
            alert(`✅ "${this.parrotName}" saved to Gallery!`);

            // Trigger Gallery update if it exists
            if (window.galleryComponent && window.galleryComponent.loadCustomParrots) {
                window.galleryComponent.loadCustomParrots();
            }
        },

        // Handle load-parrot event (called from event listener)
        handleLoadParrot(parrotData) {
            console.log('[COLORLAB] handleLoadParrot called for:', parrotData.name);

            // Update parrot name
            this.parrotName = parrotData.name + ' (Copy)';

            // Create a completely new genes object
            const genes = {};
            BODY_PARTS.forEach(part => {
                const sourceGenes = parrotData.genes[part.key];
                if (sourceGenes) {
                    genes[part.key] = {
                        red: [...sourceGenes.red],
                        green: [...sourceGenes.green],
                        blue: [...sourceGenes.blue],
                        gradient: sourceGenes.gradient
                    };
                } else {
                    // Fallback to default if body part doesn't exist
                    genes[part.key] = {
                        red: [false, false, false, false],
                        green: [false, false, false, false],
                        blue: [false, false, false, false],
                        gradient: false
                    };
                }
            });

            // Replace the entire currentGenes object
            this.currentGenes = genes;
            console.log('[COLORLAB] Loaded genes:', genes.wings.red);

            // Update preview
            this.updatePreview();
            console.log('[COLORLAB] Parrot loaded successfully');
        },

        // Get custom parrots from localStorage
        getCustomParrots() {
            const saved = localStorage.getItem('chromawing_custom_gallery');
            return saved ? JSON.parse(saved) : [];
        },

        // Select a body part for editing
        selectBodyPart(bodyPartKey) {
            this.selectedBodyPart = bodyPartKey;
        },

        // Get the current selected body part object
        getSelectedBodyPart() {
            return BODY_PARTS.find(part => part.key === this.selectedBodyPart);
        },

        // Get genes for the selected body part
        getSelectedGenes() {
            return this.currentGenes[this.selectedBodyPart];
        },

        // Count active genes for a color
        countActiveGenes(bodyPart, color) {
            return this.currentGenes[bodyPart][color].filter(g => g).length;
        },

        // Get computed RGB color for a body part
        getComputedColor(bodyPart) {
            const genes = this.currentGenes[bodyPart];

            // If gradient is disabled, all 4 genes contribute to one solid color
            if (!genes.gradient) {
                const r = this.countActiveGenes(bodyPart, 'red') * 64;
                const g = this.countActiveGenes(bodyPart, 'green') * 64;
                const b = this.countActiveGenes(bodyPart, 'blue') * 64;
                return `rgb(${r}, ${g}, ${b})`;
            }

            // If gradient is enabled, split genes into two groups:
            // Genes 0-1: START color (each gene adds 128 to RGB)
            // Genes 2-3: END color (each gene adds 128 to RGB)
            const startR = (genes.red[0] ? 128 : 0) + (genes.red[1] ? 128 : 0);
            const startG = (genes.green[0] ? 128 : 0) + (genes.green[1] ? 128 : 0);
            const startB = (genes.blue[0] ? 128 : 0) + (genes.blue[1] ? 128 : 0);

            const endR = (genes.red[2] ? 128 : 0) + (genes.red[3] ? 128 : 0);
            const endG = (genes.green[2] ? 128 : 0) + (genes.green[3] ? 128 : 0);
            const endB = (genes.blue[2] ? 128 : 0) + (genes.blue[3] ? 128 : 0);

            const startColor = `rgb(${startR}, ${startG}, ${startB})`;
            const endColor = `rgb(${endR}, ${endG}, ${endB})`;

            return `linear-gradient(90deg, ${startColor}, ${endColor})`;
        },

    };
}

/**
 * Export BODY_PARTS for use in HTML template
 */
export { BODY_PARTS };
