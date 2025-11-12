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

export const MUTATION_RATE = 0.05; // 5% chance per allele
