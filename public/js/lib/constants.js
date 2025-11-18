/**
 * ChromaWing Breeding Simulator - Constants Module
 * Contains all game configuration constants
 */

// Parrot name pool
export const PARROT_NAMES = [
    'Aurora', 'Blaze', 'Crystal', 'Dazzle', 'Echo', 'Flame', 'Glimmer', 'Horizon',
    'Iris', 'Jewel', 'Kaleidoscope', 'Luna', 'Mystic', 'Nova', 'Opal', 'Phoenix',
    'Quest', 'Rainbow', 'Starlight', 'Twilight', 'Unity', 'Vortex', 'Whisper', 'Xenon',
    'Yonder', 'Zenith', 'Azure', 'Breeze', 'Cascade', 'Dawn', 'Ember', 'Frost',
    'Galaxy', 'Haven', 'Indigo', 'Jasper', 'Karma', 'Luxe', 'Midnight', 'Nebula',
    'Oracle', 'Prism', 'Quartz', 'Radiance', 'Solstice', 'Thunder', 'Umbra', 'Velvet',
    'Wonder', 'Xanthe', 'Yarrow', 'Zephyr'
];

// Toast notification icons
export const TOAST_ICONS = {
    'success': '✅',
    'info': 'ℹ️',
    'warning': '⚠️',
    'error': '❌'
};

// Contest tier configurations
// Note: validator functions reference Parrot class, will be initialized after Parrot is loaded
export const CONTEST_TIERS = [
    {
        name: '🎨 Beginner Beauty Show',
        description: 'A friendly local competition for budding beauties',
        entryCost: 50,
        minBeautyRange: [40, 60],
        rewards: { 1: {coins: 150, badge: '🥇'}, 2: {coins: 100, badge: '🥈'}, 3: {coins: 75, badge: '🥉'} },
        specialRules: null,
        unlocked: true
    },
    {
        name: '🌈 Rainbow Showcase',
        description: 'Celebrate diversity with colorful plumage',
        entryCost: 100,
        minBeautyRange: [70, 90],
        rewards: { 1: {coins: 300, badge: '🥇'}, 2: {coins: 200, badge: '🥈'}, 3: {coins: 150, badge: '🥉'} },
        specialRules: {
            type: 'minColors',
            description: 'Must have at least 3 different beautiful colors',
            validator: (parrot) => {
                const beauty = parrot.calculateBeauty();
                const solidParts = Object.keys(beauty.bodyPartColors).filter(bp => beauty.bodyPartColors[bp]?.type === 'solid');
                const colors = new Set(solidParts.map(bp => beauty.bodyPartColors[bp].color).filter(c => c !== 'mixed'));
                return colors.size >= 3;
            }
        },
        unlocked: false
    },
    {
        name: '✨ Gradient Masters',
        description: 'Where smooth transitions steal the show',
        entryCost: 200,
        minBeautyRange: [100, 130],
        rewards: { 1: {coins: 500, badge: '🥇'}, 2: {coins: 350, badge: '🥈'}, 3: {coins: 250, badge: '🥉'} },
        specialRules: {
            type: 'minGradients',
            description: 'Must have at least 2 beautiful gradients',
            validator: (parrot) => {
                return Object.values(parrot.genes).filter(part => part.gradient).length >= 2;
            }
        },
        unlocked: false
    },
    {
        name: '🎭 Contrast Championship',
        description: 'Bold opposites make stunning statements',
        entryCost: 300,
        minBeautyRange: [130, 160],
        rewards: { 1: {coins: 750, badge: '🥇'}, 2: {coins: 500, badge: '🥈'}, 3: {coins: 350, badge: '🥉'} },
        specialRules: {
            type: 'complementary',
            description: 'Must have at least one complementary color pair',
            validator: (parrot) => {
                const beauty = parrot.calculateBeauty();
                return beauty.traits.some(t => t.includes('Complementary') || t.includes('complementary'));
            }
        },
        unlocked: false
    },
    {
        name: '👑 Elite Grand Prix',
        description: 'The ultimate test of chromatic perfection',
        entryCost: 500,
        minBeautyRange: [180, 220],
        rewards: { 1: {coins: 1500, badge: '🥇'}, 2: {coins: 1000, badge: '🥈'}, 3: {coins: 750, badge: '🥉'} },
        specialRules: {
            type: 'all',
            description: 'Must have gradients AND complementary colors',
            validator: (parrot) => {
                const hasGradients = Object.values(parrot.genes).filter(part => part.gradient).length >= 2;
                const beauty = parrot.calculateBeauty();
                const hasComplementary = beauty.traits.some(t => t.includes('Complementary') || t.includes('complementary'));
                return hasGradients && hasComplementary;
            }
        },
        unlocked: false
    }
];

// Rare contest parrot templates
// Names and descriptions use i18n translation keys
export const RARE_CONTEST_PARROTS = {
    // Tier 0: Beginner Beauty Show
    0: {
        1: {
            nameKey: 'contestParrots.goldenDawn',
            descKey: 'contestParrots.goldenDawnDesc',
            genes: {
                wings: { red: [true, true, true, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false },
                special_wing: { red: [true, true, true, true], green: [true, true, true, false], blue: [false, false, false, false], gradient: false },
                body: { red: [true, true, true, true], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                head: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, false, false], gradient: false },
                tail: { red: [true, true, true, false], green: [true, true, true, false], blue: [false, false, false, false], gradient: false },
                accents: { red: [true, true, true, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false }
            }
        },
        2: {
            nameKey: 'contestParrots.silverMist',
            descKey: 'contestParrots.silverMistDesc',
            genes: {
                wings: { red: [false, false, false, false], green: [true, true, true, false], blue: [true, true, true, true], gradient: false },
                special_wing: { red: [true, true, true, false], green: [true, true, true, true], blue: [true, true, true, true], gradient: false },
                body: { red: [false, false, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false },
                head: { red: [true, true, true, false], green: [true, true, true, false], blue: [true, true, true, false], gradient: false },
                tail: { red: [false, false, false, false], green: [true, true, true, false], blue: [true, true, true, false], gradient: false },
                accents: { red: [true, true, false, false], green: [true, true, false, false], blue: [true, true, false, false], gradient: false }
            }
        },
        3: {
            nameKey: 'contestParrots.bronzeGleam',
            descKey: 'contestParrots.bronzeGleamDesc',
            genes: {
                wings: { red: [true, true, false, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                special_wing: { red: [true, true, true, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false },
                body: { red: [true, true, false, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                head: { red: [true, true, true, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                tail: { red: [true, true, false, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                accents: { red: [true, false, false, false], green: [false, false, false, false], blue: [false, false, false, false], gradient: false }
            }
        }
    },

    // Tier 1: Rainbow Showcase (rewards have gradients)
    1: {
        1: {
            nameKey: 'contestParrots.prismaticPride',
            descKey: 'contestParrots.prismaticPrideDesc',
            genes: {
                wings: { red: [true, true, false, false], green: [true, true, true, true], blue: [true, true, true, false], gradient: true },
                special_wing: { red: [false, false, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                body: { red: [false, false, false, false], green: [true, true, true, true], blue: [false, false, false, false], gradient: false },
                head: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false },
                tail: { red: [false, false, false, false], green: [true, true, false, false], blue: [true, true, true, true], gradient: false },
                accents: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: false }
            }
        },
        2: {
            nameKey: 'contestParrots.chromaticDream',
            descKey: 'contestParrots.chromaticDreamDesc',
            genes: {
                wings: { red: [false, false, false, false], green: [true, true, true, true], blue: [false, false, true, true], gradient: true },
                special_wing: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false },
                body: { red: [false, false, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false },
                head: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: false },
                tail: { red: [true, true, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: false },
                accents: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, false, false], gradient: false }
            }
        },
        3: {
            nameKey: 'contestParrots.spectrumWing',
            descKey: 'contestParrots.spectrumWingDesc',
            genes: {
                wings: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false },
                special_wing: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, false, false], gradient: false },
                body: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: false },
                head: { red: [false, false, false, false], green: [true, true, true, true], blue: [false, false, false, false], gradient: false },
                tail: { red: [false, false, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false },
                accents: { red: [true, true, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false }
            }
        }
    },

    // Tier 2: Gradient Masters (rewards have complementary colors)
    2: {
        1: {
            nameKey: 'contestParrots.auroraCascade',
            descKey: 'contestParrots.auroraCascadeDesc',
            genes: {
                wings: { red: [false, false, true, true], green: [true, true, true, true], blue: [true, true, false, false], gradient: true },
                special_wing: { red: [true, true, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                body: { red: [false, false, true, true], green: [true, true, false, false], blue: [true, true, true, true], gradient: true },
                head: { red: [true, true, false, false], green: [true, true, true, true], blue: [false, false, true, true], gradient: true },
                tail: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true },
                accents: { red: [false, false, true, true], green: [true, true, true, true], blue: [true, true, true, true], gradient: true }
            }
        },
        2: {
            nameKey: 'contestParrots.twilightFlow',
            descKey: 'contestParrots.twilightFlowDesc',
            genes: {
                wings: { red: [true, true, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                special_wing: { red: [true, true, false, false], green: [false, false, true, true], blue: [true, true, false, false], gradient: true },
                body: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true },
                head: { red: [true, true, true, true], green: [false, false, false, false], blue: [true, true, false, false], gradient: false },
                tail: { red: [true, true, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false },
                accents: { red: [true, true, true, true], green: [true, true, true, true], blue: [true, true, false, false], gradient: false }
            }
        },
        3: {
            nameKey: 'contestParrots.oceanDrift',
            descKey: 'contestParrots.oceanDriftDesc',
            genes: {
                wings: { red: [false, false, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                special_wing: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, false, false], gradient: true },
                body: { red: [false, false, false, false], green: [true, true, false, false], blue: [true, true, true, true], gradient: false },
                head: { red: [true, true, true, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false },
                tail: { red: [true, true, false, false], green: [true, false, false, false], blue: [false, false, false, false], gradient: false },
                accents: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, true, false], gradient: false }
            }
        }
    },

    // Tier 3: Contrast Championship (rewards have gradients + complementary)
    3: {
        1: {
            nameKey: 'contestParrots.emberAndIce',
            descKey: 'contestParrots.emberAndIceDesc',
            genes: {
                wings: { red: [true, true, false, false], green: [false, false, false, false], blue: [false, false, true, true], gradient: true },
                special_wing: { red: [true, true, true, true], green: [false, false, true, true], blue: [false, false, true, true], gradient: true },
                body: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, false, false], gradient: true },
                head: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, true, true], gradient: false },
                tail: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false },
                accents: { red: [false, false, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: false }
            }
        },
        2: {
            nameKey: 'contestParrots.sunsetContrast',
            descKey: 'contestParrots.sunsetContrastDesc',
            genes: {
                wings: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true },
                special_wing: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: true },
                body: { red: [false, false, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false },
                head: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, false, false], gradient: false },
                tail: { red: [false, false, false, false], green: [true, true, false, false], blue: [true, true, true, true], gradient: false },
                accents: { red: [true, true, true, true], green: [true, true, true, false], blue: [false, false, false, false], gradient: false }
            }
        },
        3: {
            nameKey: 'contestParrots.forestFire',
            descKey: 'contestParrots.forestFireDesc',
            genes: {
                wings: { red: [true, true, true, true], green: [false, false, true, true], blue: [false, false, false, false], gradient: true },
                special_wing: { red: [false, false, false, false], green: [true, true, true, true], blue: [false, false, false, false], gradient: false },
                body: { red: [true, true, true, true], green: [false, false, false, false], blue: [false, false, false, false], gradient: false },
                head: { red: [true, true, false, false], green: [true, true, true, true], blue: [false, false, false, false], gradient: false },
                tail: { red: [true, true, true, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false },
                accents: { red: [false, false, false, false], green: [true, true, false, false], blue: [false, false, false, false], gradient: false }
            }
        }
    },

    // Tier 4: Elite Grand Prix (ultimate parrots with perfect genes)
    4: {
        1: {
            nameKey: 'contestParrots.celestialPerfection',
            descKey: 'contestParrots.celestialPerfectionDesc',
            genes: {
                wings: { red: [true, true, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                special_wing: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true },
                body: { red: [true, true, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                head: { red: [false, false, true, true], green: [true, true, true, true], blue: [false, false, true, true], gradient: true },
                tail: { red: [true, true, false, false], green: [true, true, true, true], blue: [false, false, true, true], gradient: true },
                accents: { red: [true, true, true, true], green: [false, false, false, false], blue: [true, true, true, true], gradient: true }
            }
        },
        2: {
            nameKey: 'contestParrots.royalSpectrum',
            descKey: 'contestParrots.royalSpectrumDesc',
            genes: {
                wings: { red: [true, true, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                special_wing: { red: [true, true, false, false], green: [true, true, true, true], blue: [false, false, true, true], gradient: true },
                body: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true },
                head: { red: [false, false, true, true], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                tail: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: true },
                accents: { red: [true, true, false, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false }
            }
        },
        3: {
            nameKey: 'contestParrots.nobleRadiance',
            descKey: 'contestParrots.nobleRadianceDesc',
            genes: {
                wings: { red: [true, true, true, true], green: [true, true, false, false], blue: [false, false, true, true], gradient: true },
                special_wing: { red: [false, false, true, true], green: [true, true, true, true], blue: [true, true, false, false], gradient: true },
                body: { red: [true, true, false, false], green: [false, false, true, true], blue: [true, true, true, true], gradient: true },
                head: { red: [true, true, true, true], green: [true, true, true, true], blue: [false, false, true, true], gradient: true },
                tail: { red: [true, true, true, true], green: [false, false, false, false], blue: [true, true, false, false], gradient: false },
                accents: { red: [false, false, false, false], green: [true, true, true, true], blue: [true, true, true, true], gradient: false }
            }
        }
    }
};
