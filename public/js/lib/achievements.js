/**
 * ChromaWing Breeding Simulator - Achievements Module
 * Achievement system with win conditions
 */

import * as GameState from '../core/gameState.js';
import { showToast } from './notifications.js';
import { ACHIEVEMENT_COIN_THRESHOLDS } from './economy.js';

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = {
    // Contest Achievements
    'contest_beginner': {
        id: 'contest_beginner',
        name: '🎨 First Steps',
        description: 'Place top 3 in Beginner Beauty Show',
        category: 'contests',
        check: () => {
            const contestProgress = GameState.getContestProgress();
            return Object.values(contestProgress).some(pp => pp[0] && pp[0].placed <= 3);
        }
    },
    'contest_all_tiers': {
        id: 'contest_all_tiers',
        name: '👑 Contest Master',
        description: 'Place top 3 in all 5 contest tiers',
        category: 'contests',
        check: () => {
            const contestProgress = GameState.getContestProgress();
            return Object.values(contestProgress).some(pp => {
                return pp[0] && pp[1] && pp[2] && pp[3] && pp[4] &&
                       pp[0].placed <= 3 && pp[1].placed <= 3 && pp[2].placed <= 3 &&
                       pp[3].placed <= 3 && pp[4].placed <= 3;
            });
        }
    },
    'contest_perfect_run': {
        id: 'contest_perfect_run',
        name: '🥇 Perfect Champion',
        description: 'Win 1st place in all 5 tiers with the same parrot',
        category: 'contests',
        check: () => {
            const contestProgress = GameState.getContestProgress();
            return Object.values(contestProgress).some(pp => {
                return pp[0] && pp[1] && pp[2] && pp[3] && pp[4] &&
                       pp[0].placed === 1 && pp[1].placed === 1 && pp[2].placed === 1 &&
                       pp[3].placed === 1 && pp[4].placed === 1;
            });
        }
    },
    'elite_champion': {
        id: 'elite_champion',
        name: '💎 Elite Champion',
        description: 'Win 1st place in Elite Grand Prix',
        category: 'contests',
        isWinCondition: true,
        check: () => {
            const contestProgress = GameState.getContestProgress();
            return Object.values(contestProgress).some(pp => pp[4] && pp[4].placed === 1);
        }
    },

    // Breeding/Beauty Achievements
    'beautiful_parrot': {
        id: 'beautiful_parrot',
        name: '🌸 Beauty Enthusiast',
        description: 'Breed a parrot with 100+ beauty score',
        category: 'breeding',
        check: () => {
            return GameState.getParrots().some(p => p.calculateBeauty().score >= 100);
        }
    },
    'stunning_parrot': {
        id: 'stunning_parrot',
        name: '✨ Master Breeder',
        description: 'Breed a parrot with 150+ beauty score',
        category: 'breeding',
        check: () => {
            return GameState.getParrots().some(p => p.calculateBeauty().score >= 150);
        }
    },
    'perfect_parrot': {
        id: 'perfect_parrot',
        name: '🌟 Perfection Achieved',
        description: 'Breed a parrot with 200 beauty score',
        category: 'breeding',
        isWinCondition: true,
        check: () => {
            return GameState.getParrots().some(p => p.calculateBeauty().score >= 200);
        }
    },
    'gradient_master': {
        id: 'gradient_master',
        name: '🌈 Gradient Collector',
        description: 'Own a parrot with gradients on all 6 body parts',
        category: 'breeding',
        check: () => {
            return GameState.getParrots().some(p => {
                return Object.values(p.genes).every(part => part.gradient);
            });
        }
    },

    // Collection Achievements
    'collector_10': {
        id: 'collector_10',
        name: '🦜 Aviary Starter',
        description: 'Own 10 parrots at once',
        category: 'collection',
        check: () => GameState.getParrots().length >= 10
    },
    'collector_25': {
        id: 'collector_25',
        name: '🏆 Aviary Expert',
        description: 'Own 25 parrots at once',
        category: 'collection',
        check: () => GameState.getParrots().length >= 25
    },
    'full_rarity_set': {
        id: 'full_rarity_set',
        name: '💫 Rarity Collector',
        description: 'Own at least one parrot of each rarity level',
        category: 'collection',
        check: () => {
            const rarities = new Set(GameState.getParrots().map(p => p.calculateRarity()));
            return rarities.has('common') && rarities.has('uncommon') &&
                   rarities.has('rare') && rarities.has('epic') && rarities.has('legendary');
        }
    },
    'full_genotype': {
        id: 'full_genotype',
        name: '🧬 Geneticist',
        description: 'Collect ALL 5 values (0,1,2,3,4 dominant) for each R/G/B on each body part',
        category: 'collection',
        isWinCondition: true,
        check: () => {
            const parrots = GameState.getParrots();
            const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
            const colors = ['red', 'green', 'blue'];

            for (const bodyPart of bodyParts) {
                for (const color of colors) {
                    const values = new Set();
                    parrots.forEach(p => {
                        const count = p.countDominant(p.genes[bodyPart][color]);
                        values.add(count);
                    });
                    if (values.size < 5) return false;
                }
            }
            return true;
        }
    },

    // Generation Achievements
    'generation_5': {
        id: 'generation_5',
        name: '🌱 Lineage Builder',
        description: 'Breed a parrot to generation 5',
        category: 'breeding',
        check: () => GameState.getParrots().some(p => p.generation >= 5)
    },
    'generation_10': {
        id: 'generation_10',
        name: '🌳 Dynasty Creator',
        description: 'Breed a parrot to generation 10',
        category: 'breeding',
        check: () => GameState.getParrots().some(p => p.generation >= 10)
    },

    // Economic Achievements
    'wealthy_1000': {
        id: 'wealthy_1000',
        name: '💰 Entrepreneur',
        description: `Accumulate ${ACHIEVEMENT_COIN_THRESHOLDS.WEALTHY} coins`,
        category: 'economic',
        check: () => GameState.getCoins() >= ACHIEVEMENT_COIN_THRESHOLDS.WEALTHY
    },
    'wealthy_5000': {
        id: 'wealthy_5000',
        name: '💎 Business Mogul',
        description: `Accumulate ${ACHIEVEMENT_COIN_THRESHOLDS.VERY_WEALTHY} coins`,
        category: 'economic',
        check: () => GameState.getCoins() >= ACHIEVEMENT_COIN_THRESHOLDS.VERY_WEALTHY
    },

    // Special Achievements
    'all_achievements': {
        id: 'all_achievements',
        name: '🏅 Ultimate Master',
        description: 'Unlock all other achievements',
        category: 'special',
        isWinCondition: true,
        check: () => {
            const achievements = GameState.getAchievements();
            const allIds = Object.keys(ACHIEVEMENTS).filter(id => id !== 'all_achievements');
            return allIds.every(id => achievements.unlocked.includes(id));
        }
    }
};

/**
 * Check and unlock achievements
 * @param {Function} saveGameFn - Save game function to call after unlocking
 * @returns {Array} Newly unlocked achievements
 */
export function checkAchievements(saveGameFn) {
    let newlyUnlocked = [];
    const achievements = GameState.getAchievements();

    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
        // Skip if already unlocked
        if (achievements.unlocked.includes(id)) continue;

        // Check if achievement is completed
        if (achievement.check()) {
            GameState.addUnlockedAchievement(id);
            newlyUnlocked.push(achievement);

            // Show toast notification
            showToast(
                `Achievement Unlocked!`,
                `${achievement.name}: ${achievement.description}`,
                'success',
                6000
            );

            // Check if it's a win condition
            if (achievement.isWinCondition) {
                showWinConditionModal(achievement);
            }
        }
    }

    if (newlyUnlocked.length > 0 && saveGameFn) {
        saveGameFn();
    }

    return newlyUnlocked;
}

/**
 * Show win condition achievement modal
 * @param {Object} achievement - Achievement that was unlocked
 */
export function showWinConditionModal(achievement) {
    setTimeout(() => {
        let modal = document.getElementById('winModal');
        if (!modal) {
            const modalHTML = `
                <div class="modal" id="winModal">
                    <div class="modal-content">
                        <div id="winDisplay"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('winModal');
        }

        const display = document.getElementById('winDisplay');
        const allWinConditions = Object.values(ACHIEVEMENTS).filter(a => a.isWinCondition);
        const achievements = GameState.getAchievements();
        const completedWinConditions = allWinConditions.filter(a => achievements.unlocked.includes(a.id));

        let html = '<div style="text-align: center; padding: 30px;">';
        html += '<h1 style="font-size: 3em; margin: 0 0 10px 0;">🏆</h1>';
        html += `<h2 style="margin: 0 0 20px 0; color: #4caf50;">Win Condition Achieved!</h2>`;
        html += `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">`;
        html += `<h3 style="margin: 0 0 10px 0;">${achievement.name}</h3>`;
        html += `<p style="margin: 0; font-size: 1.1em;">${achievement.description}</p>`;
        html += `</div>`;

        html += `<div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 12px;">`;
        html += `<h4 style="margin: 0 0 15px 0;">Win Conditions Progress</h4>`;
        allWinConditions.forEach(wc => {
            const completed = achievements.unlocked.includes(wc.id);
            html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: white; border-radius: 8px;">`;
            html += `<span style="text-align: left;">${wc.name}</span>`;
            html += `<span>${completed ? '✅' : '⬜'}</span>`;
            html += `</div>`;
        });
        html += `</div>`;

        if (completedWinConditions.length === allWinConditions.length) {
            html += `<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 12px; margin: 20px 0;">`;
            html += `<h2 style="margin: 0 0 10px 0;">🎉 GAME COMPLETE! 🎉</h2>`;
            html += `<p style="margin: 0; font-size: 1.2em;">You've achieved all win conditions!</p>`;
            html += `</div>`;
        }

        html += '<button class="btn" onclick="window.closeWinModal()" style="margin-top: 20px; font-size: 1.1em; padding: 15px 40px;">Continue Playing</button>';
        html += '</div>';

        display.innerHTML = html;
        modal.classList.add('active');
    }, 1000);
}

/**
 * Close win modal
 */
export function closeWinModal() {
    const modal = document.getElementById('winModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Get achievement statistics
 * @returns {Object} Achievement stats
 */
export function getAchievementStats() {
    const achievements = GameState.getAchievements();
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = achievements.unlocked.length;
    const winConditions = Object.values(ACHIEVEMENTS).filter(a => a.isWinCondition);
    const completedWinConditions = winConditions.filter(a => achievements.unlocked.includes(a.id));

    return {
        total,
        unlocked,
        percentage: Math.round((unlocked / total) * 100),
        winConditions: winConditions.length,
        completedWinConditions: completedWinConditions.length
    };
}

// Expose to window for onclick handlers
if (typeof window !== 'undefined') {
    window.closeWinModal = closeWinModal;
}
