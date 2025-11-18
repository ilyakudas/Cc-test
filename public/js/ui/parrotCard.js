/**
 * ChromaWing Breeding Simulator - Parrot Card Module
 * Parrot card creation and display
 */

import * as GameState from '../core/gameState.js';
import { generateParrotSVG } from '../lib/svg.js';
import { t } from '../lib/i18n.js';

/**
 * Rarity configuration for display
 */
const RARITY_CONFIG = {
    'common': { color: '#9e9e9e', labelKey: 'rarity.common' },
    'uncommon': { color: '#4caf50', labelKey: 'rarity.uncommon' },
    'rare': { color: '#2196f3', labelKey: 'rarity.rare' },
    'epic': { color: '#9c27b0', labelKey: 'rarity.epic' },
    'legendary': { color: '#ff9800', labelKey: 'rarity.legendary' }
};

/**
 * Create parrot card element
 * @param {Parrot} parrot - Parrot object
 * @param {boolean} isStore - Whether this is a store parrot
 * @returns {Promise<HTMLElement>} Card element
 */
export async function createParrotCard(parrot, isStore) {
    const card = document.createElement('div');
    card.className = 'parrot-card';

    const selectedParrotId = GameState.getSelectedParrotId();
    if (selectedParrotId === parrot.id) {
        card.classList.add('selected');
    }

    const svg = await generateParrotSVG(parrot);
    const rarity = parrot.calculateRarity();
    const price = parrot.getValue();
    const breedingPair = GameState.getBreedingPair();

    // Check if parrot is in breeding slots
    let breedingIndicator = '';
    if (breedingPair.left === parrot.id) {
        breedingIndicator = '<div class="breeding-indicator breeding-left">L</div>';
    } else if (breedingPair.right === parrot.id) {
        breedingIndicator = '<div class="breeding-indicator breeding-right">R</div>';
    }

    // Check if parrot has been examined
    let examinedIndicator = '';
    if (!isStore && GameState.hasExaminedParrot(parrot.id)) {
        examinedIndicator = '<div class="examined-indicator" title="Lab Examined">🔬</div>';
    }

    // Check if parrot is locked
    let lockIndicator = '';
    if (!isStore && GameState.isParrotLocked(parrot.id)) {
        lockIndicator = '<div class="lock-indicator" title="Locked">🔒</div>';
    }

    const rarityInfo = RARITY_CONFIG[rarity];

    // Calculate beauty score for display
    const beauty = parrot.calculateBeauty();
    const beautyScore = beauty.score;

    // Beauty score color coding (cool to warm spectrum)
    let beautyColor = '#607d8b'; // Low: Blue-gray (cold)
    if (beautyScore >= 180) beautyColor = '#e91e63'; // Exceptional: Hot pink
    else if (beautyScore >= 130) beautyColor = '#ff5722'; // High: Deep orange
    else if (beautyScore >= 80) beautyColor = '#ffc107'; // Medium: Amber
    else if (beautyScore >= 40) beautyColor = '#00bcd4'; // Medium-low: Cyan

    // Extract colors for all body parts
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
    const partLabelKeys = {
        'wings': 'bodyParts.wings',
        'special_wing': 'bodyParts.specialWing',
        'body': 'bodyParts.body',
        'head': 'bodyParts.head',
        'tail': 'bodyParts.tail',
        'accents': 'bodyParts.accents'
    };

    let colorPalette = '<div class="color-palette">';
    bodyParts.forEach(partName => {
        const colorData = parrot.calculateBodyPartColor(partName);
        const label = t(partLabelKeys[partName]);

        if (colorData.isGradient) {
            // For gradients, create animated gradient square with border
            colorPalette += `
                <div class="color-square gradient-square"
                     title="${label}: ${t('laboratory.gradient')}"
                     style="--start-color: ${colorData.startColor}; --end-color: ${colorData.endColor};">
                </div>
            `;
        } else {
            // For solid colors, just show the color
            colorPalette += `
                <div class="color-square"
                     title="${label}"
                     style="background: ${colorData.color};">
                </div>
            `;
        }
    });
    colorPalette += '</div>';

    // Performance genes display
    let performanceGenes = '';
    if (!isStore) {
        const perfStats = parrot.getPerformanceStats();
        performanceGenes = `
            <div class="performance-genes">
                <span title="Agility: ${perfStats.agility.category}" class="perf-gene perf-${perfStats.agility.category}">⚡${perfStats.agility.level}</span>
                <span title="Intelligence: ${perfStats.intelligence.category}" class="perf-gene perf-${perfStats.intelligence.category}">🧠${perfStats.intelligence.level}</span>
                <span title="Stamina: ${perfStats.stamina.category}" class="perf-gene perf-${perfStats.stamina.category}">💪${perfStats.stamina.level}</span>
                <span title="Speed: ${perfStats.speed.category}" class="perf-gene perf-${perfStats.speed.category}">🏃${perfStats.speed.level}</span>
                <span title="Fertility: ${perfStats.fertility.category}" class="perf-gene perf-${perfStats.fertility.category}">🥚${perfStats.fertility.level}</span>
            </div>
        `;
    }

    // Trophy/contest indicators and gradient symbol
    let trophyIndicator = '';
    if (!isStore) {
        const trophies = GameState.getParrotTrophies(parrot.id);
        const hasGradients = parrot.hasAnyGradients();

        if (trophies && trophies.length > 0 || hasGradients) {
            const tierIcons = ['🎨', '🌈', '✨', '🎭', '👑'];

            trophyIndicator = '<div class="trophy-indicator">';

            // Add gradient symbol first if parrot has gradients
            if (hasGradients) {
                trophyIndicator += `<span title="Has gradient colors" class="gradient-symbol">✨</span>`;
            }

            // Add trophies
            if (trophies && trophies.length > 0) {
                trophies.forEach(trophy => {
                    const tierIcon = tierIcons[trophy.tier] || '🏆';
                    const suffix = trophy.placement === 1 ? 'st' : trophy.placement === 2 ? 'nd' : 'rd';
                    trophyIndicator += `<span title="Tier ${trophy.tier + 1} - ${trophy.placement}${suffix}">${tierIcon}${trophy.badge}</span>`;
                });
            }

            trophyIndicator += '</div>';
        }
    }

    card.innerHTML = `
        ${isStore ? `<div class="price">${price}💰</div>` : ''}
        ${breedingIndicator}
        ${examinedIndicator}
        ${lockIndicator}
        <div class="parrot-mini">${svg}</div>
        ${colorPalette}
        ${performanceGenes}
        <div class="parrot-name">${parrot.name}</div>
        <div class="parrot-gen">${t('common.generation')} ${parrot.generation}</div>
        <div class="rarity-badge" style="background: ${rarityInfo.color};">${t(rarityInfo.labelKey)}</div>
        <div class="beauty-badge" style="background: ${beautyColor}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">${t('beauty.score')}: ${beautyScore}</div>
        ${trophyIndicator}
    `;

    card.onclick = () => window.selectParrotHandler(parrot.id);

    return card;
}
