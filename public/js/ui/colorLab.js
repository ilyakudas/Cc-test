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

        // Load a parrot for editing (clone from gallery)
        loadParrot(parrot) {
            // Deep copy the genes
            this.currentGenes = JSON.parse(JSON.stringify(parrot.genes));
            this.parrotName = parrot.name + ' (Copy)';
            this.updatePreview();
            console.log('Loaded parrot for editing:', parrot.name);
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
            const r = this.countActiveGenes(bodyPart, 'red') * 64;
            const g = this.countActiveGenes(bodyPart, 'green') * 64;
            const b = this.countActiveGenes(bodyPart, 'blue') * 64;
            return `rgb(${r}, ${g}, ${b})`;
        }
    };
}

/**
 * Export BODY_PARTS for use in HTML template
 */
export { BODY_PARTS };
