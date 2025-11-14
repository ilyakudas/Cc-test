/**
 * ChromaWing Breeding Simulator - Contests Module
 * Contest system with tiers, rewards, and rare parrots
 */

import * as GameState from '../core/gameState.js';
import { Parrot } from '../core/parrot.js';
import { showToast } from './notifications.js';
import { CONTEST_TIERS, RARE_CONTEST_PARROTS } from './constants.js';

/**
 * Render contests tab with all tiers
 */
export function renderContestsTab() {
    const contestsTab = document.getElementById('contestsTab');
    const selectedParrotId = GameState.getSelectedParrotId();
    const parrots = GameState.getParrots();
    const parrot = selectedParrotId !== null ? parrots.find(p => p.id === selectedParrotId) : null;

    let html = '<div style="padding: 20px;">';

    if (!parrot) {
        html += '<div style="text-align: center; padding: 40px; color: #999;">';
        html += '<h3>Select a parrot from your collection to enter contests!</h3>';
        html += '<button class="btn" onclick="window.switchTabHandler(\'collection\')">Go to Collection</button>';
        html += '</div>';
        contestsTab.innerHTML = html;
        return;
    }

    html += `<h3>🏆 Beauty Contests for ${parrot.name}</h3>`;
    html += '<p style="color: #666; margin-bottom: 20px;">Compete to win coins and badges. Beat each tier to unlock the next!</p>';

    const contestProgress = GameState.getContestProgress();
    const coins = GameState.getCoins();

    CONTEST_TIERS.forEach((tier, index) => {
        const prevCompleted = index === 0 || (contestProgress[selectedParrotId] && contestProgress[selectedParrotId][index - 1]);
        const isUnlocked = tier.unlocked && prevCompleted;
        const hasCompleted = contestProgress[selectedParrotId] && contestProgress[selectedParrotId][index];

        const bgColor = hasCompleted ? '#d4edda' : (isUnlocked ? '#f8f9fa' : '#f0f0f0');
        const borderColor = hasCompleted ? '#28a745' : (isUnlocked ? '#667eea' : '#ccc');

        html += `<div style="margin-bottom: 20px; padding: 20px; background: ${bgColor}; border-radius: 12px; border: 2px solid ${borderColor}; opacity: ${isUnlocked || hasCompleted ? 1 : 0.6};">`;
        html += '<div style="display: flex; justify-content: space-between; align-items: start;">';
        html += '<div style="flex: 1;">';
        html += `<h4 style="margin: 0 0 10px 0;">${tier.name} ${!isUnlocked && !hasCompleted ? '🔒' : ''} ${hasCompleted ? '✅' : ''}</h4>`;
        html += `<p style="color: #666; margin: 0 0 10px 0;">${tier.description}</p>`;

        if (tier.specialRules) {
            html += '<div style="background: #fff3cd; padding: 10px; border-radius: 6px; margin-bottom: 10px;">';
            html += `<strong>Rule:</strong> ${tier.specialRules.description}`;
            html += '</div>';
        }

        html += '<div style="display: flex; gap: 20px; font-size: 0.9em; color: #666; flex-wrap: wrap;">';
        html += `<span>💰 Entry: ${tier.entryCost}</span>`;
        html += `<span>🥇 ${tier.rewards[1].coins} | 🥈 ${tier.rewards[2].coins} | 🥉 ${tier.rewards[3].coins}</span>`;
        html += '</div>';

        if (hasCompleted) {
            const result = contestProgress[selectedParrotId][index];
            const suffix = result.placed === 1 ? 'st' : result.placed === 2 ? 'nd' : result.placed === 3 ? 'rd' : 'th';
            html += '<div style="margin-top: 10px; padding: 10px; background: white; border-radius: 6px;">';
            html += `<strong>Completed:</strong> ${result.badge} ${result.placed}${suffix} place • ${result.coins} coins`;
            html += '</div>';
        }

        html += '</div>';

        html += '<div style="min-width: 150px; text-align: right;">';
        if (!isUnlocked && !hasCompleted) {
            html += '<button class="btn" disabled style="opacity: 0.5;">🔒 Locked</button>';
        } else if (hasCompleted) {
            html += '<button class="btn" disabled style="opacity: 0.5; background: #28a745; color: white;">✅ Complete</button>';
        } else {
            html += `<button class="btn btn-contest" onclick="window.enterContestHandler(${index})" style="background: #667eea; color: white;" ${coins < tier.entryCost ? 'disabled' : ''}>`;
            html += `${coins < tier.entryCost ? '❌ Need ' + tier.entryCost : '🎯 Enter (' + tier.entryCost + '💰)'}`;
            html += '</button>';
        }
        html += '</div>';

        html += '</div>';
        html += '</div>';
    });

    html += '</div>';
    contestsTab.innerHTML = html;
}

/**
 * Enter a contest tier
 * @param {number} tierIndex - Tier index (0-4)
 * @param {Function} saveGameFn - Save game function
 * @param {Function} updateStatsFn - Update stats function
 * @param {Function} checkAchievementsFn - Check achievements function
 */
export async function enterContest(tierIndex, saveGameFn, updateStatsFn, checkAchievementsFn) {
    const tier = CONTEST_TIERS[tierIndex];
    const selectedParrotId = GameState.getSelectedParrotId();
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === selectedParrotId);

    if (!parrot) {
        showToast('No parrot selected', 'Go to collection first', 'warning');
        return;
    }

    if (tier.specialRules && !tier.specialRules.validator(parrot)) {
        showToast('Does not meet requirements', tier.specialRules.description, 'error');
        return;
    }

    const coins = GameState.getCoins();
    if (coins < tier.entryCost) {
        showToast('Not enough coins', `Need ${tier.entryCost} coins`, 'error');
        return;
    }

    GameState.addCoins(-tier.entryCost);
    if (updateStatsFn) updateStatsFn();

    const parrotBeauty = parrot.calculateBeauty();
    const opponents = generateAIOpponents(tier, 5);

    const competitors = [
        { parrot, beauty: parrotBeauty, isPlayer: true },
        ...opponents
    ];

    competitors.sort((a, b) => b.beauty.score - a.beauty.score);

    const playerIndex = competitors.findIndex(c => c.isPlayer);
    const placement = playerIndex + 1;

    let coinsWon = 0;
    let badge = null;
    if (placement <= 3) {
        const reward = tier.rewards[placement];
        coinsWon = reward.coins;
        badge = reward.badge;
    }

    // Record contest progress
    GameState.setContestProgress(selectedParrotId, tierIndex, { placed: placement, coins: coinsWon, badge });

    // Unlock next tier if placed top 3
    if (placement <= 3 && tierIndex < CONTEST_TIERS.length - 1) {
        CONTEST_TIERS[tierIndex + 1].unlocked = true;
    }

    // Add trophy
    if (badge) {
        GameState.addParrotTrophy(selectedParrotId, { tier: tierIndex, badge, placement });
    }

    if (updateStatsFn) updateStatsFn();
    if (saveGameFn) saveGameFn();

    showContestResults(tier, tierIndex, competitors, placement, coinsWon, badge, parrot);
}

/**
 * Generate AI opponents for a contest
 * @param {Object} tier - Contest tier object
 * @param {number} count - Number of opponents
 * @returns {Array} Array of opponent objects
 */
export function generateAIOpponents(tier, count) {
    const opponents = [];
    const [minBeauty, maxBeauty] = tier.minBeautyRange;
    const aiNames = ['Luna Eclipse', 'Prismatic Wing', 'Sunset Dancer', 'Ocean Breeze', 'Forest Gem', 'Twilight Star'];

    for (let i = 0; i < count; i++) {
        const targetBeauty = minBeauty + Math.random() * (maxBeauty - minBeauty);
        const mockBeauty = {
            score: Math.round(targetBeauty + (Math.random() - 0.5) * 15),
            maxScore: 200,
            traits: [],
            bodyPartColors: {},
            partContributions: {}
        };

        opponents.push({
            parrot: { name: aiNames[i] || `Competitor ${i + 1}`, id: `ai_${i}` },
            beauty: mockBeauty,
            isPlayer: false
        });
    }

    return opponents;
}

/**
 * Show contest results modal
 * @param {Object} tier - Contest tier
 * @param {number} tierIndex - Tier index
 * @param {Array} competitors - All competitors
 * @param {number} placement - Player placement
 * @param {number} coinsWon - Coins won
 * @param {string} badge - Badge won
 * @param {Parrot} playerParrot - Player's parrot
 */
export function showContestResults(tier, tierIndex, competitors, placement, coinsWon, badge, playerParrot) {
    const modal = document.getElementById('contestModal');
    const display = document.getElementById('contestDisplay');

    const won = placement <= 3;
    const bgColor = won ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa';
    const textColor = won ? 'white' : '#333';
    const placeSuffix = placement === 1 ? 'st' : placement === 2 ? 'nd' : placement === 3 ? 'rd' : 'th';

    let html = `<h2 style="text-align: center; margin-bottom: 20px;">${tier.name}</h2>`;

    html += `<div style="text-align: center; padding: 30px; background: ${bgColor}; border-radius: 12px; margin-bottom: 20px; color: ${textColor};">`;
    html += `<h1 style="margin: 0 0 10px 0; font-size: 3em;">${won ? badge : '😔'}</h1>`;
    html += `<h3 style="margin: 0 0 5px 0;">${playerParrot.name} placed ${placement}${placeSuffix}!</h3>`;
    html += '</div>';

    // Show reward choice for top 3
    if (won) {
        const rareTemplate = RARE_CONTEST_PARROTS[tierIndex]?.[placement];
        if (rareTemplate) {
            const tempRareParrot = createRareParrot(tierIndex, placement);
            const parrotSellValue = tempRareParrot ? calculateParrotSellValue(tempRareParrot) : 0;

            html += '<h3 style="text-align: center; margin: 20px 0;">Choose Your Reward</h3>';
            html += '<div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px;">';

            // Coins option
            html += '<div style="flex: 1; max-width: 300px; border: 2px solid #4caf50; border-radius: 12px; padding: 20px; background: white; text-align: center;">';
            html += '<h4 style="margin: 0 0 10px 0; color: #4caf50;">💰 Take Coins</h4>';
            html += `<p style="font-size: 2em; margin: 10px 0; font-weight: bold;">${coinsWon} coins</p>`;
            html += '<p style="color: #666; font-size: 0.9em;">Safe choice - immediate value</p>';
            html += `<button class="btn" style="background: #4caf50; color: white; width: 100%;" onclick="window.takeCoinsRewardHandler(${tierIndex}, ${placement}, ${coinsWon})">Take Coins</button>`;
            html += '</div>';

            // Parrot option
            html += '<div style="flex: 1; max-width: 300px; border: 2px solid #9c27b0; border-radius: 12px; padding: 20px; background: white; text-align: center;">';
            html += `<h4 style="margin: 0 0 10px 0; color: #9c27b0;">🦜 Take ${rareTemplate.name}</h4>`;
            html += `<p style="font-size: 1.2em; margin: 10px 0; font-weight: bold; color: #9c27b0;">${rareTemplate.description}</p>`;
            if (tempRareParrot) {
                const beauty = tempRareParrot.calculateBeauty();
                html += `<p style="margin: 5px 0;"><strong>Beauty:</strong> ${beauty.score} pts</p>`;
            }
            html += `<p style="color: #666; font-size: 0.9em;">Sell value: ~${parrotSellValue} coins</p>`;
            html += `<p style="color: #e91e63; font-size: 0.85em; font-weight: 600;">Unique parrot with special genes!</p>`;
            html += `<button class="btn" style="background: #9c27b0; color: white; width: 100%;" onclick="window.takeParrotRewardHandler(${tierIndex}, ${placement})">Take Parrot</button>`;
            html += '</div>';

            html += '</div>';
        } else {
            html += `<p style="text-align: center; font-size: 1.5em; margin: 10px 0;">Won ${coinsWon} coins!</p>`;
        }
    } else {
        html += '<p style="text-align: center; margin: 10px 0;">Better luck next time!</p>';
    }

    html += '<h4 style="margin: 20px 0 10px 0;">Final Rankings</h4>';
    html += '<div style="background: #f8f9fa; border-radius: 12px; padding: 15px;">';

    competitors.forEach((comp, index) => {
        const isPlayer = comp.isPlayer;
        const placeNum = index + 1;
        const placeBadge = placeNum === 1 ? '🥇' : placeNum === 2 ? '🥈' : placeNum === 3 ? '🥉' : `${placeNum}.`;

        html += `<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 8px; background: ${isPlayer ? '#e3f2fd' : 'white'}; border-radius: 8px; border: ${isPlayer ? '2px solid #2196f3' : '1px solid #ddd'};">`;
        html += '<div style="display: flex; align-items: center; gap: 10px;">';
        html += `<span style="font-size: 1.2em; min-width: 40px;">${placeBadge}</span>`;
        html += `<strong style="color: ${isPlayer ? '#2196f3' : '#333'};">${comp.parrot.name}${isPlayer ? ' (You)' : ''}</strong>`;
        html += '</div>';
        html += '<div style="text-align: right;">';
        html += `<span style="font-weight: 600; color: #667eea;">${comp.beauty.score} pts</span>`;
        html += '</div>';
        html += '</div>';
    });

    html += '</div>';

    if (!won) {
        html += '<div style="text-align: center; margin-top: 20px;">';
        html += '<button class="btn" onclick="window.closeContestModalHandler()">Close</button>';
        html += '</div>';
    }

    display.innerHTML = html;
    modal.classList.add('active');
}

/**
 * Close contest modal
 */
export function closeContestModal() {
    document.getElementById('contestModal').classList.remove('active');
    renderContestsTab();
}

/**
 * Create a rare parrot from contest reward template
 * @param {number} tierIndex - Tier index
 * @param {number} placement - Placement (1, 2, or 3)
 * @returns {Parrot} Rare parrot
 */
export function createRareParrot(tierIndex, placement) {
    const rareTemplate = RARE_CONTEST_PARROTS[tierIndex]?.[placement];
    if (!rareTemplate) {
        console.error(`No rare parrot defined for tier ${tierIndex}, placement ${placement}`);
        return null;
    }

    const parrot = new Parrot(rareTemplate.name, rareTemplate.genes, 1);
    parrot.isRare = true;
    parrot.rareSource = { tier: tierIndex, placement };
    parrot.description = rareTemplate.description;

    return parrot;
}

/**
 * Calculate sell value for a parrot
 * @param {Parrot} parrot - Parrot object
 * @returns {number} Sell value in coins
 */
export function calculateParrotSellValue(parrot) {
    const beauty = parrot.calculateBeauty();
    const baseValue = Math.round(beauty.score * 0.55);
    if (parrot.isRare) {
        return Math.round(baseValue * 0.9);
    }
    return baseValue;
}

/**
 * Handle player choosing coins reward
 * @param {number} tierIndex - Tier index
 * @param {number} placement - Placement
 * @param {number} coinsAmount - Coins amount
 * @param {Function} saveGameFn - Save game function
 * @param {Function} updateStatsFn - Update stats function
 * @param {Function} checkAchievementsFn - Check achievements function
 */
export function takeCoinsReward(tierIndex, placement, coinsAmount, saveGameFn, updateStatsFn, checkAchievementsFn) {
    GameState.addCoins(coinsAmount);
    if (updateStatsFn) updateStatsFn();
    if (saveGameFn) saveGameFn();
    if (checkAchievementsFn) checkAchievementsFn(saveGameFn);

    showToast('Coins received!', `+${coinsAmount} coins`, 'success');
    closeContestModal();
    renderContestsTab();
}

/**
 * Handle player choosing parrot reward
 * @param {number} tierIndex - Tier index
 * @param {number} placement - Placement
 * @param {Function} saveGameFn - Save game function
 * @param {Function} updateStatsFn - Update stats function
 * @param {Function} checkAchievementsFn - Check achievements function
 */
export function takeParrotReward(tierIndex, placement, saveGameFn, updateStatsFn, checkAchievementsFn) {
    const rareParrot = createRareParrot(tierIndex, placement);

    if (!rareParrot) {
        showToast('Error', 'Failed to create rare parrot', 'error');
        return;
    }

    GameState.addParrot(rareParrot);
    if (updateStatsFn) updateStatsFn();
    if (saveGameFn) saveGameFn();
    if (checkAchievementsFn) checkAchievementsFn(saveGameFn);

    showToast('Rare parrot received!', `${rareParrot.name} added to your collection`, 'success');
    closeContestModal();
    renderContestsTab();
}
