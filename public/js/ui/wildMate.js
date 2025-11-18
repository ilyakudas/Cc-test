/**
 * ChromaWing Breeding Simulator - Wild Mate UI Module
 * Rendering for wild mate system
 */

import * as GameState from '../core/gameState.js';
import { Parrot } from '../core/parrot.js';
import { generateParrotSVG } from '../lib/svg.js';
import { getGenePoolStats, calculateSearchCost } from '../actions/wildMate.js';
import {
    calculatePoolQuality,
    calculatePoolDiversity,
    calculateFrequency
} from '../lib/wildMate.js';

/**
 * Render the Wild Mate tab
 */
export async function renderWildMateTab() {
    const tab = document.getElementById('wildMateTab');
    if (!tab) return;

    const stats = getGenePoolStats();
    const parrots = GameState.getParrots();
    const credits = GameState.getConservationCredits();

    let html = `
        <div class="wild-mate-container">
            <div class="wild-mate-header">
                <h3>🌿 Wild Mate Finding System</h3>
                <p style="color: #666; font-size: 0.9em; margin-top: 8px;">
                    Release parrots to build the wild gene pool, then find mates for your collection
                </p>
            </div>

            <!-- Gene Pool Dashboard -->
            <div class="gene-pool-dashboard">
                <h4>📊 Gene Pool Status</h4>
                ${renderGenePoolDashboard(stats)}
            </div>

            <!-- Your Parrots Section -->
            <div class="wild-mate-parrots">
                <h4>🦜 Your Parrots</h4>
                ${renderParrotActions(parrots, stats.exists)}
            </div>
        </div>
    `;

    tab.innerHTML = html;
}

/**
 * Render gene pool dashboard
 */
function renderGenePoolDashboard(stats) {
    if (!stats.exists) {
        return `
            <div class="gene-pool-empty">
                <div class="empty-icon">🌱</div>
                <h3>Wild Gene Pool is Empty</h3>
                <p>Release some parrots to start building the wild population!</p>
                <p style="margin-top: 16px;">
                    <strong>How it works:</strong>
                </p>
                <ul style="text-align: left; margin: 12px auto; max-width: 400px;">
                    <li>Release parrots to earn 🌿 Conservation Credits</li>
                    <li>Their genes strengthen the wild gene pool</li>
                    <li>Use credits to find mates from the wild population</li>
                    <li>Better parrots = better credits & better pool quality</li>
                </ul>
            </div>
        `;
    }

    const qualityClass = stats.quality >= 0.7 ? 'excellent' : stats.quality >= 0.5 ? 'good' : 'poor';
    const diversityClass = stats.diversityPercent >= 60 ? 'high' : stats.diversityPercent >= 30 ? 'medium' : 'low';

    return `
        <div class="gene-pool-stats">
            <div class="pool-stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-label">Pool Quality</div>
                <div class="stat-value ${qualityClass}">
                    ${'⭐'.repeat(stats.qualityStars)}
                </div>
                <div class="stat-detail">${(stats.quality * 100).toFixed(0)}%</div>
            </div>

            <div class="pool-stat-card">
                <div class="stat-icon">🧬</div>
                <div class="stat-label">Diversity</div>
                <div class="stat-value ${diversityClass}">
                    ${stats.diversityPercent}%
                </div>
                <div class="stat-detail">${diversityClass.toUpperCase()}</div>
            </div>

            <div class="pool-stat-card">
                <div class="stat-icon">🦜</div>
                <div class="stat-label">Total Releases</div>
                <div class="stat-value">
                    ${stats.releasesCount}
                </div>
                <div class="stat-detail">parrots</div>
            </div>

            <div class="pool-stat-card">
                <div class="stat-icon">🌿</div>
                <div class="stat-label">Your Credits</div>
                <div class="stat-value">
                    ${GameState.getConservationCredits()}
                </div>
                <div class="stat-detail">credits</div>
            </div>
        </div>

        <div class="pool-info-box">
            <strong>💡 Tip:</strong> Higher quality and diversity means better wild mates!
            Release diverse parrots to improve the gene pool.
        </div>
    `;
}

/**
 * Render parrot action cards
 */
function renderParrotActions(parrots, poolExists) {
    if (parrots.length === 0) {
        return `
            <div class="empty-state">
                <p>No parrots in your collection</p>
            </div>
        `;
    }

    let html = '<div class="wild-mate-parrot-grid">';

    for (const parrot of parrots) {
        const perfStats = parrot.getPerformanceStats();
        const beauty = parrot.calculateBeauty();
        const beautyPercent = Math.floor((beauty.score / beauty.maxScore) * 100);
        const beautyStars = Math.floor((beauty.score / beauty.maxScore) * 5);
        const isLocked = GameState.isParrotLocked(parrot.id);
        const hasFoundMate = parrot.hasFoundWildMate;

        const searchCost = calculateSearchCost(parrot);

        html += `
            <div class="wild-mate-parrot-card">
                <div class="parrot-mini-preview">
                    <div class="parrot-svg-mini">${generateParrotSVG(parrot, 100, 100)}</div>
                </div>
                <div class="parrot-info">
                    <h4>${parrot.name}</h4>
                    <div class="parrot-stats-mini">
                        <div>Beauty: ${'⭐'.repeat(beautyStars)} (${beautyPercent}%)</div>
                        <div>Rarity: ${parrot.calculateRarity()}</div>
                        <div>Gen: ${parrot.generation}</div>
                    </div>
                    <div class="performance-stats-mini">
                        <span title="Agility: ${perfStats.agility.category}">⚡${perfStats.agility.level}</span>
                        <span title="Intelligence: ${perfStats.intelligence.category}">🧠${perfStats.intelligence.level}</span>
                        <span title="Stamina: ${perfStats.stamina.category}">💪${perfStats.stamina.level}</span>
                        <span title="Speed: ${perfStats.speed.category}">🏃${perfStats.speed.level}</span>
                        <span title="Fertility: ${perfStats.fertility.category}">🥚${perfStats.fertility.level}</span>
                    </div>
                </div>
                <div class="parrot-actions">
                    ${renderParrotActionButtons(parrot, isLocked, hasFoundMate, poolExists, searchCost)}
                </div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

/**
 * Render action buttons for a parrot
 */
function renderParrotActionButtons(parrot, isLocked, hasFoundMate, poolExists, searchCost) {
    let html = '';

    // Release button
    if (isLocked) {
        html += `
            <button class="btn-wild-action" disabled title="Unlock parrot to release">
                🔒 Locked
            </button>
        `;
    } else {
        html += `
            <button class="btn-wild-action btn-release" onclick="releaseParrotHandler(${parrot.id})">
                🌿 Release to Wild
            </button>
        `;
    }

    // Find mate button
    if (hasFoundMate) {
        html += `
            <button class="btn-wild-action" disabled title="This parrot has already found a wild mate">
                ✓ Mate Found
            </button>
        `;
    } else if (!poolExists) {
        html += `
            <button class="btn-wild-action" disabled title="Release parrots first to build gene pool">
                🔍 Find Mate (Pool Empty)
            </button>
        `;
    } else {
        const credits = GameState.getConservationCredits();
        const canAfford = credits >= searchCost;

        html += `
            <button class="btn-wild-action btn-find-mate"
                    onclick="findWildMateHandler(${parrot.id})"
                    ${canAfford ? '' : 'disabled'}
                    title="${canAfford ? `Search for wild mate (${searchCost} 🌿)` : `Need ${searchCost} 🌿 credits`}">
                🔍 Find Mate (${searchCost} 🌿)
            </button>
        `;
    }

    return html;
}

/**
 * Show mate selection modal
 */
export async function showMateSelectionModal(searchingParrot, mates, searchCost) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'wildMateModal';

    let html = `
        <div class="modal-content wild-mate-modal-content">
            <span class="modal-close" onclick="closeMateModalHandler()">&times;</span>
            <div class="mate-selection-container">
                <h2>🔍 Wild Mates Found!</h2>
                <p>Found ${mates.length} potential mates for <strong>${searchingParrot.name}</strong></p>

                <div class="mate-options-grid">
    `;

    for (let i = 0; i < mates.length; i++) {
        const mate = mates[i];
        const beauty = mate.calculateBeauty();
        const beautyStars = Math.floor((beauty.score / beauty.maxScore) * 5);
        const rarity = mate.calculateRarity();

        html += `
            <div class="mate-option-card">
                <div class="mate-preview">
                    ${generateParrotSVG(mate, 150, 150)}
                </div>
                <div class="mate-info">
                    <h3>${mate.name}</h3>
                    <div class="mate-stats">
                        <div>Beauty: ${'⭐'.repeat(beautyStars)}</div>
                        <div>Rarity: ${rarity}</div>
                        <div>Generation: ${mate.generation}</div>
                    </div>
                    <button class="btn btn-primary" onclick="selectMateHandler(${searchingParrot.id}, ${i})">
                        ✓ Select This Mate
                    </button>
                    <button class="btn btn-secondary" onclick="viewMateDetailsHandler(${i})">
                        👁️ View Details
                    </button>
                </div>
            </div>
        `;
    }

    html += `
                </div>

                <div class="mate-modal-actions">
                    <button class="btn btn-cancel" onclick="cancelMateSearchHandler(${searchCost})">
                        ✖ Cancel (Refund 50%)
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.innerHTML = html;
    document.body.appendChild(modal);

    // Store mates in window for access
    window.currentMateOptions = mates;
}

/**
 * Close mate selection modal
 */
export function closeMateSelectionModal() {
    const modal = document.getElementById('wildMateModal');
    if (modal) {
        modal.remove();
    }
    window.currentMateOptions = null;
}
