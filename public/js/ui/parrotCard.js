/**
 * ChromaWing Breeding Simulator - Parrot Card Module
 * Parrot card creation and display
 */

import * as GameState from '../core/gameState.js';
import { generateParrotSVG } from '../lib/svg.js';

/**
 * Rarity configuration for display
 */
const RARITY_CONFIG = {
    'common': { color: '#9e9e9e', label: 'Common' },
    'uncommon': { color: '#4caf50', label: 'Uncommon' },
    'rare': { color: '#2196f3', label: 'Rare' },
    'epic': { color: '#9c27b0', label: 'Epic' },
    'legendary': { color: '#ff9800', label: 'Legendary' }
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
    const partLabels = {
        'wings': 'Wings',
        'special_wing': 'Special Wing',
        'body': 'Body',
        'head': 'Head',
        'tail': 'Tail',
        'accents': 'Accents'
    };

    let colorPalette = '<div class="color-palette">';
    bodyParts.forEach(partName => {
        const colorData = parrot.calculateBodyPartColor(partName);
        const label = partLabels[partName];

        if (colorData.isGradient) {
            // For gradients, create animated gradient square
            const isSameColor = colorData.startColor === colorData.endColor;
            colorPalette += `
                <div class="color-square gradient-square${isSameColor ? ' same-color' : ''}"
                     title="${label}: Gradient"
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

    // Trophy/contest indicators
    let trophyIndicator = '';
    if (!isStore) {
        const trophies = GameState.getParrotTrophies(parrot.id);
        if (trophies && trophies.length > 0) {
            const tierIcons = ['🎨', '🌈', '✨', '🎭', '👑'];

            trophyIndicator = '<div class="trophy-indicator">';
            trophies.forEach(trophy => {
                const tierIcon = tierIcons[trophy.tier] || '🏆';
                const suffix = trophy.placement === 1 ? 'st' : trophy.placement === 2 ? 'nd' : 'rd';
                trophyIndicator += `<span title="Tier ${trophy.tier + 1} - ${trophy.placement}${suffix}">${tierIcon}${trophy.badge}</span>`;
            });
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
        <div class="parrot-name">${parrot.name}</div>
        <div class="parrot-gen">Gen ${parrot.generation}</div>
        <div class="rarity-badge" style="background: ${rarityInfo.color};">${rarityInfo.label}</div>
        <div class="beauty-badge" style="background: ${beautyColor}; color: white; font-size: 0.8em; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">Beauty: ${beautyScore}</div>
        ${parrot.hasAnyGradients() ? '<div class="gradient-indicator">✨ Gradient</div>' : ''}
        ${trophyIndicator}
    `;

    card.onclick = () => window.selectParrotHandler(parrot.id);

    return card;
}
