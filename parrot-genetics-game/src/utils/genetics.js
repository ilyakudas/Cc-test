// ChromaWing - Genetics Utilities
// v3.0

// Create random genes for a body part
export function randomBodyPartGenes() {
    return {
        red: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        green: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        blue: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        gradient: false
    };
}

export function randomBoolean() {
    return Math.random() < 0.5;
}

/**
 * Create parrot genes with specific purity level
 * @param {string} targetPurity - 'high' (80% pure), 'medium' (50% pure), 'low' (20% pure), or 'random'
 * @returns {object} Genes object for all body parts
 */
export function createParrotWithPurity(targetPurity) {
    const genes = {};
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    for (const part of bodyParts) {
        const partGenes = {
            red: [],
            green: [],
            blue: [],
            gradient: false
        };

        // Generate each color channel based on purity
        for (const color of ['red', 'green', 'blue']) {
            let alleles;
            if (targetPurity === 'high') {
                // 80% chance of pure (0000 or 1111)
                if (Math.random() < 0.8) {
                    const val = randomBoolean();
                    alleles = [val, val, val, val];
                } else {
                    // Nearly pure (0001 or 1110)
                    const base = randomBoolean();
                    alleles = [base, base, base, !base];
                }
            } else if (targetPurity === 'medium') {
                // 50% pure, 50% mixed
                if (Math.random() < 0.5) {
                    const val = randomBoolean();
                    alleles = [val, val, val, val];
                } else {
                    alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
                }
            } else if (targetPurity === 'low') {
                // Mostly mixed
                alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
            } else {
                // Random
                alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
            }
            partGenes[color] = alleles;
        }

        genes[part] = partGenes;
    }

    return genes;
}

// Create genes with specific purity level
export function createPureGenes(r, g, b, gradient = false) {
    return {
        red: [r, r, r, r],
        green: [g, g, g, g],
        blue: [b, b, b, b],
        gradient
    };
}

// Create gradient genes
export function createGradientGenes(startR, startG, startB, endR, endG, endB) {
    return {
        red: [startR, startR, endR, endR],
        green: [startG, startG, endG, endG],
        blue: [startB, startB, endB, endB],
        gradient: true
    };
}

// Breed two body part genes
export function breedBodyPartGenes(parent1Part, parent2Part, mutationsEnabled, mutationRate) {
    const offspring = {
        red: [],
        green: [],
        blue: [],
        gradient: Math.random() < 0.5 ? parent1Part.gradient : parent2Part.gradient
    };

    // Each allele is inherited from a random parent
    for (let i = 0; i < 4; i++) {
        let redAllele = Math.random() < 0.5 ? parent1Part.red[i] : parent2Part.red[i];
        let greenAllele = Math.random() < 0.5 ? parent1Part.green[i] : parent2Part.green[i];
        let blueAllele = Math.random() < 0.5 ? parent1Part.blue[i] : parent2Part.blue[i];

        // Apply mutations if enabled
        if (mutationsEnabled) {
            if (Math.random() < mutationRate) redAllele = !redAllele;
            if (Math.random() < mutationRate) greenAllele = !greenAllele;
            if (Math.random() < mutationRate) blueAllele = !blueAllele;
        }

        offspring.red.push(redAllele);
        offspring.green.push(greenAllele);
        offspring.blue.push(blueAllele);
    }

    // Gradient can also mutate
    if (mutationsEnabled && Math.random() < mutationRate) {
        offspring.gradient = !offspring.gradient;
    }

    return offspring;
}

// Get DNA string representation
export function getDNAString(parrot, format = 'human') {
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    if (format === 'machine') {
        // Machine-parseable format: 3201-4100-0040-3310-2401-1030
        const parts = bodyParts.map(bp => {
            const part = parrot.genes[bp];
            const r = parrot.countDominant(part.red);
            const g = parrot.countDominant(part.green);
            const b = parrot.countDominant(part.blue);
            const grad = part.gradient ? '1' : '0';
            return `${r}${g}${b}${grad}`;
        });
        return parts.join('-');
    } else {
        // Human-readable format: W:320* S:410 B:004 H:331 T:240* A:103
        const abbrevs = ['W', 'S', 'B', 'H', 'T', 'A'];
        const parts = bodyParts.map((bp, idx) => {
            const part = parrot.genes[bp];
            const r = parrot.countDominant(part.red);
            const g = parrot.countDominant(part.green);
            const b = parrot.countDominant(part.blue);
            const grad = part.gradient ? '*' : '';
            return `${abbrevs[idx]}:${r}${g}${b}${grad}`;
        });
        return parts.join(' ');
    }
}

// Check if player has full genotype collection
export function hasFullGenotype(parrots) {
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
    const colors = ['red', 'green', 'blue'];

    // For each body part and each color, we need all 5 values (0, 1, 2, 3, 4)
    for (const bodyPart of bodyParts) {
        for (const color of colors) {
            const values = new Set();

            for (const parrot of parrots) {
                const part = parrot.genes[bodyPart];
                const count = parrot.countDominant(part[color]);
                values.add(count);
            }

            // Must have all 5 values
            if (values.size < 5) {
                return false;
            }
        }
    }

    return true;
}
