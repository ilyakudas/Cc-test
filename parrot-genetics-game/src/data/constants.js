// ChromaWing - Game Constants
// v3.0

export const PARROT_NAMES = [
    'Aurora', 'Blaze', 'Crystal', 'Dazzle', 'Echo', 'Flame', 'Glimmer', 'Horizon',
    'Iris', 'Jewel', 'Kaleidoscope', 'Luna', 'Mystic', 'Nova', 'Opal', 'Phoenix',
    'Quest', 'Rainbow', 'Starlight', 'Twilight', 'Unity', 'Vortex', 'Whisper', 'Xenon',
    'Yonder', 'Zenith', 'Azure', 'Breeze', 'Cascade', 'Dawn', 'Ember', 'Frost',
    'Galaxy', 'Haven', 'Indigo', 'Jasper', 'Karma', 'Luxe', 'Midnight', 'Nebula',
    'Oracle', 'Prism', 'Quartz', 'Radiance', 'Solstice', 'Thunder', 'Umbra', 'Velvet',
    'Wonder', 'Xanthe', 'Yarrow', 'Zephyr'
];

export const BODY_PARTS = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

export const RARITY_MULTIPLIERS = {
    'common': 1.0,
    'uncommon': 1.3,
    'rare': 1.6,
    'epic': 2.0,
    'legendary': 2.5
};

export const RARITY_COLORS = {
    'common': '#9e9e9e',
    'uncommon': '#4caf50',
    'rare': '#2196f3',
    'epic': '#9c27b0',
    'legendary': '#ff9800'
};

export const RARITY_LABELS = {
    'common': 'Common',
    'uncommon': 'Uncommon',
    'rare': 'Rare',
    'epic': 'Epic',
    'legendary': 'Legendary'
};

// Beauty color scheme - thermal spectrum
export function getBeautyColor(beautyScore) {
    if (beautyScore < 40) return '#607d8b';  // Blue-gray (cold)
    if (beautyScore < 80) return '#00bcd4';  // Cyan
    if (beautyScore < 130) return '#ffc107'; // Amber/Yellow
    if (beautyScore < 180) return '#ff5722'; // Deep Orange
    return '#e91e63';                        // Hot Pink
}

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
            description: 'Must have at least 3 different beautiful colors'
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
            description: 'Must have at least 2 beautiful gradients'
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
            description: 'Must have at least one complementary color pair'
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
            description: 'Must have gradients AND complementary colors'
        },
        unlocked: false
    }
];

// Rare contest parrot templates
export const RARE_CONTEST_PARROTS = {
    // Tier 0: Beginner Beauty Show
    0: {
        1: {
            name: 'Golden Dawn',
            description: 'Warm golden tones perfect for rainbow showcases',
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
            name: 'Silver Mist',
            description: 'Cool silvery blues perfect for rainbow showcases',
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
            name: 'Bronze Gleam',
            description: 'Earthy bronze tones with a metallic sheen',
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
            name: 'Prismatic Pride',
            description: 'A dazzling display of the full color spectrum',
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
            name: 'Chromatic Dream',
            description: 'A harmonious blend of vivid hues',
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
            name: 'Spectrum Wing',
            description: 'Every color of the rainbow in perfect harmony',
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
            name: 'Aurora Cascade',
            description: 'Flowing colors like the northern lights',
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
            name: 'Twilight Flow',
            description: 'Sunset colors in graceful transitions',
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
            name: 'Ocean Drift',
            description: 'Sea blues meet warm sunset hints',
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
            name: 'Ember & Ice',
            description: 'Fire and frost in perfect opposition',
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
            name: 'Sunset Contrast',
            description: 'Bold orange skies meet deep ocean blues',
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
            name: 'Forest Fire',
            description: 'Vibrant greens clash with burning reds',
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
            name: 'Celestial Perfection',
            description: 'The pinnacle of chromatic beauty - required for endgame',
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
            name: 'Royal Spectrum',
            description: 'Majestic beauty fit for royalty',
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
            name: 'Noble Radiance',
            description: 'Dignified elegance with stunning color play',
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

export const MUTATION_RATE = 0.05; // 5% chance per allele
