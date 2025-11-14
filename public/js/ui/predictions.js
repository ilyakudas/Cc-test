/**
 * ChromaWing Breeding Simulator - Predictions Component
 * Alpine.js reactive component for offspring predictions
 */

import * as GameState from '../core/gameState.js';
import { Parrot } from '../core/parrot.js';
import { breedParrotGenes } from '../core/genetics.js';
import { generateParrotSVG } from '../lib/svg.js';

/**
 * Calculate genetic diversity between two parrots
 */
function calculateGeneticDiversity(parrot1, parrot2) {
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
    let differences = 0;
    let total = 0;

    for (const bodyPart of bodyParts) {
        const part1 = parrot1.genes[bodyPart];
        const part2 = parrot2.genes[bodyPart];

        // Compare RGB alleles
        for (const channel of ['red', 'green', 'blue']) {
            for (let i = 0; i < 4; i++) {
                total++;
                if (part1[channel][i] !== part2[channel][i]) {
                    differences++;
                }
            }
        }

        // Compare gradient
        total++;
        if (part1.gradient !== part2.gradient) {
            differences++;
        }
    }

    return Math.round((differences / total) * 100);
}

/**
 * Create Alpine.js reactive component for predictions
 */
export function createPredictionsComponent() {
    return {
        // State
        predictions: [],
        beautyStats: null,
        isLoading: false,
        hasGenerated: false,

        // Computed properties
        get leftParrot() {
            const pair = GameState.getBreedingPair();
            const parrots = GameState.getParrots();
            return pair.left ? parrots.find(p => p.id === pair.left) : null;
        },

        get rightParrot() {
            const pair = GameState.getBreedingPair();
            const parrots = GameState.getParrots();
            return pair.right ? parrots.find(p => p.id === pair.right) : null;
        },

        get hasBothParents() {
            return this.leftParrot && this.rightParrot;
        },

        get diversityScore() {
            if (!this.hasBothParents) return 0;
            return calculateGeneticDiversity(this.leftParrot, this.rightParrot);
        },

        get diversityLabel() {
            const score = this.diversityScore;
            return score > 50 ? 'High' : score > 25 ? 'Medium' : 'Low';
        },

        get mutationChance() {
            return GameState.getMutationsEnabled() ? 15 : 0;
        },

        // Methods
        async generatePredictions() {
            if (!this.hasBothParents) return;

            this.isLoading = true;
            this.predictions = [];

            try {
                // Generate 10 predicted offspring
                const newPredictions = [];
                for (let i = 0; i < 10; i++) {
                    const childGenes = breedParrotGenes(this.leftParrot.genes, this.rightParrot.genes);
                    const childGen = Math.max(this.leftParrot.generation, this.rightParrot.generation) + 1;
                    const predictedParrot = new Parrot(`Prediction ${i + 1}`, childGenes, childGen, -1);

                    // Calculate beauty score
                    const beautyResult = predictedParrot.calculateBeauty();
                    const beautyScore = Math.round(beautyResult.score);

                    // Generate SVG
                    const svg = await generateParrotSVG(predictedParrot);

                    newPredictions.push({
                        parrot: predictedParrot,
                        beauty: beautyScore,
                        svg: svg
                    });
                }

                // Calculate beauty statistics
                const beautyScores = newPredictions.map(p => p.beauty);
                this.beautyStats = {
                    min: Math.min(...beautyScores),
                    max: Math.max(...beautyScores),
                    avg: Math.round(beautyScores.reduce((a, b) => a + b, 0) / beautyScores.length)
                };

                this.predictions = newPredictions;
                this.hasGenerated = true;
            } finally {
                this.isLoading = false;
            }
        },

        // Initialize when parents change
        init() {
            console.log('Predictions component initialized', {
                hasBothParents: this.hasBothParents,
                leftParrot: !!this.leftParrot,
                rightParrot: !!this.rightParrot
            });

            // Watch for parent changes
            this.$watch('hasBothParents', (value) => {
                console.log('hasBothParents changed:', value);
                if (value && !this.hasGenerated) {
                    this.generatePredictions();
                }
            });

            // Generate immediately if both parents are selected
            if (this.hasBothParents) {
                console.log('Generating initial predictions...');
                this.generatePredictions();
            }

            // Listen for breeding pair changes from outside Alpine
            document.addEventListener('breeding-pair-changed', () => {
                console.log('breeding-pair-changed event received');
                // Force re-evaluation of computed properties
                this.$nextTick(() => {
                    if (this.hasBothParents && !this.hasGenerated) {
                        this.generatePredictions();
                    }
                });
            });
        }
    };
}
