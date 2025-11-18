/**
 * ChromaWing Breeding Simulator - Laboratory Actions
 * Handles parrot examination and laboratory modal
 */

import * as GameState from '../core/gameState.js';
import { generateParrotSVG } from '../lib/svg.js';
import { showToast } from '../lib/notifications.js';
import * as UI from '../ui.js';
import { t } from '../lib/i18n.js';
import { EXAMINATION_COST } from '../lib/economy.js';

/**
 * Open laboratory modal for parrot examination
 * @param {number} parrotId - Parrot ID
 */
export async function openLaboratory(parrotId) {
    const parrots = GameState.getParrots();
    const recentOffspring = GameState.getRecentOffspring();
    const parrot = parrots.find(p => p.id === parrotId) || recentOffspring.find(p => p.id === parrotId);
    if (!parrot) return;

    const modal = document.getElementById('laboratoryModal');
    const display = document.getElementById('laboratoryDisplay');

    // Check if parrot has been examined before
    const examinedParrots = GameState.getExaminedParrots();
    const hasBeenExamined = examinedParrots.has(parrotId);
    const coins = GameState.getCoins();

    if (!hasBeenExamined) {
        // Show payment screen
        const svg = await generateParrotSVG(parrot);
        display.innerHTML = `
            <h3>🔬 ${t('laboratory.title')}: ${parrot.name}</h3>
            <p style="color: #666; margin-bottom: 20px;">${t('common.generation')} ${parrot.generation}</p>

            <div style="text-align: center; margin: 20px 0;">
                <button class="btn btn-lab" onclick="window.performExaminationHandler(${parrotId})" ${coins < EXAMINATION_COST ? 'disabled' : ''} style="font-size: 1.1em; padding: 15px 30px; width: 100%; max-width: 400px;">
                    ${coins < EXAMINATION_COST ? '❌ ' + t('laboratory.notEnoughCoins') : '💰 ' + t('laboratory.payAndExamine', { cost: EXAMINATION_COST })}
                </button>
                ${coins < EXAMINATION_COST ? `<p style="color: #dc3545; margin-top: 10px;">${t('laboratory.needMoreCoins', { amount: EXAMINATION_COST - coins })}</p>` : ''}
            </div>

            <div style="text-align: center; margin: 20px 0;">
                <div style="width: 250px; height: 250px; margin: 0 auto; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    ${svg}
                </div>
            </div>

            <div style="background: #e7f3ff; border-left: 4px solid #2196f3; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1976d2;">🔬 ${t('laboratory.analysisIncludes')}</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>${t('laboratory.geneBreakdown')}</li>
                    <li>${t('laboratory.rarityAnalysis')}</li>
                    <li>${t('laboratory.beautyAssessment')}</li>
                    <li>${t('laboratory.rgbValues')}</li>
                </ul>
                <p style="margin: 10px 0 0 0; font-weight: bold; color: #1976d2;">💰 ${t('laboratory.oneTimeCost', { cost: EXAMINATION_COST })}</p>
            </div>
        `;
        modal.classList.add('active');
        return;
    }

    // Show full analysis for examined parrot
    const bodyPartNames = {
        'wings': `🪽 ${t('bodyParts.wings')}`,
        'special_wing': `✨ ${t('bodyParts.specialWing')} (wing-blue-1, 4)`,
        'body': `🦜 ${t('bodyParts.body')}`,
        'head': `👑 ${t('bodyParts.head')}`,
        'tail': `🎨 ${t('bodyParts.tail')}`,
        'accents': `💎 ${t('bodyParts.accents')}`
    };

    // Calculate rarity breakdown
    let totalRareTraits = 0;
    const maxTraits = 60;
    let rarityBreakdown = [];

    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        const part = parrot.genes[bodyPart];
        const redCount = parrot.countDominant(part.red);
        const greenCount = parrot.countDominant(part.green);
        const blueCount = parrot.countDominant(part.blue);

        const redRarity = redCount === 0 || redCount === 4 ? 2 : (redCount === 1 || redCount === 3 ? 1 : 0);
        const greenRarity = greenCount === 0 || greenCount === 4 ? 2 : (greenCount === 1 || greenCount === 3 ? 1 : 0);
        const blueRarity = blueCount === 0 || blueCount === 4 ? 2 : (blueCount === 1 || blueCount === 3 ? 1 : 0);

        let partRarity = redRarity + greenRarity + blueRarity;
        const hasGradient = part.gradient;
        if (hasGradient) partRarity += 4;

        totalRareTraits += partRarity;

        rarityBreakdown.push({
            name: bodyPartNames[bodyPart],
            points: partRarity,
            maxPoints: hasGradient ? 10 : 6,
            hasGradient
        });
    }

    const rarityRatio = totalRareTraits / maxTraits;
    const rarity = parrot.calculateRarity();

    const rarityConfig = {
        'common': { color: '#9e9e9e', label: t('rarity.common') },
        'uncommon': { color: '#4caf50', label: t('rarity.uncommon') },
        'rare': { color: '#2196f3', label: t('rarity.rare') },
        'epic': { color: '#9c27b0', label: t('rarity.epic') },
        'legendary': { color: '#ff9800', label: t('rarity.legendary') }
    };

    const rarityInfo = rarityConfig[rarity];

    let html = `<h3>🔬 ${t('laboratory.title')}: ${parrot.name}</h3>`;
    html += `<p style="color: #666; margin-bottom: 20px;">${t('laboratory.generationTotal', { generation: parrot.generation })}</p>`;

    // Rarity Summary Section
    html += `<div class="body-part-genes" style="background: linear-gradient(135deg, ${rarityInfo.color}22, ${rarityInfo.color}11); border-color: ${rarityInfo.color};">`;
    html += `<h4>📊 ${t('laboratory.rarityAnalysisTitle')} <span class="rarity-badge" style="background: ${rarityInfo.color}; margin-left: 10px;">${rarityInfo.label}</span></h4>`;
    html += `<div class="gene-row">`;
    html += `<div class="gene-label">${t('laboratory.rarityScore')}</div>`;
    html += `<div style="font-weight: bold; color: ${rarityInfo.color};">${totalRareTraits} / ${maxTraits} points (${(rarityRatio * 100).toFixed(1)}%)</div>`;
    html += `</div>`;

    // Breakdown by body part
    html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">${t('laboratory.pointsByBodyPart')}</div>`;
    for (const part of rarityBreakdown) {
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">`;
        html += `<span>${part.name}</span>`;
        html += `<span style="color: ${rarityInfo.color};">${part.points}/${part.maxPoints} ${part.hasGradient ? '✨' : ''}</span>`;
        html += `</div>`;
    }
    html += `</div>`;

    html += `<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; font-size: 0.85em;">`;
    html += `<strong>${t('laboratory.rarityGuide')}</strong><br>`;
    html += `• ${t('laboratory.rarityGuide1')}<br>`;
    html += `• ${t('laboratory.rarityGuide2')}<br>`;
    html += `• ${t('laboratory.rarityGuide3')}<br>`;
    html += `• ${t('laboratory.rarityGuide4')}`;
    html += `</div>`;

    html += `</div>`;

    // Beauty Analysis Section
    const beautyData = parrot.calculateBeauty();
    const beautyPercent = (beautyData.score / beautyData.maxScore) * 100;
    let beautyColor = '#9e9e9e';
    let beautyLabel = t('beauty.plain');
    if (beautyPercent >= 70) {
        beautyColor = '#ff69b4';
        beautyLabel = t('beauty.stunning');
    } else if (beautyPercent >= 50) {
        beautyColor = '#ff1493';
        beautyLabel = t('beauty.beautiful');
    } else if (beautyPercent >= 30) {
        beautyColor = '#dda0dd';
        beautyLabel = t('beauty.pretty');
    } else if (beautyPercent >= 15) {
        beautyColor = '#d8bfd8';
        beautyLabel = t('beauty.decent');
    }

    html += `<div class="body-part-genes" style="background: linear-gradient(135deg, ${beautyColor}22, ${beautyColor}11); border-color: ${beautyColor};">`;
    html += `<h4>🌸 ${t('laboratory.beautyAnalysisTitle')} <span class="rarity-badge" style="background: ${beautyColor}; margin-left: 10px;">${beautyLabel}</span></h4>`;
    html += `<div class="gene-row">`;
    html += `<div class="gene-label">${t('laboratory.beautyScore')}</div>`;
    html += `<div style="font-weight: bold; color: ${beautyColor};">${beautyData.score} / ${beautyData.maxScore} points (${beautyPercent.toFixed(1)}%)</div>`;
    html += `</div>`;

    // Color classifications
    html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">${t('laboratory.bodyPartColors')}</div>`;
    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        if (beautyData.bodyPartColors[bodyPart]) {
            const partColor = beautyData.bodyPartColors[bodyPart];
            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">`;
            html += `<span>${bodyPartNames[bodyPart]}</span>`;
            html += `<span style="color: ${beautyColor}; font-weight: 600;">${partColor.displayColor}</span>`;
            html += `</div>`;
        }
    }
    html += `</div>`;

    // Per-part contributions
    html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">${t('laboratory.beautyContribution')}</div>`;
    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        const contribution = beautyData.partContributions[bodyPart];
        const displayValue = contribution >= 0 ? `+${contribution.toFixed(1)}` : contribution.toFixed(1);
        const color = contribution > 0 ? beautyColor : (contribution < 0 ? '#dc3545' : '#999');
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">`;
        html += `<span>${bodyPartNames[bodyPart]}</span>`;
        html += `<span style="color: ${color}; font-weight: 600;">${displayValue} pts</span>`;
        html += `</div>`;
    }
    html += `</div>`;

    // Beauty traits
    if (beautyData.traits.length > 0) {
        html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
        html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">${t('laboratory.beautyTraits')}</div>`;
        for (const trait of beautyData.traits) {
            const isPositive = trait.includes('+');
            const isNegative = trait.includes('-');
            const icon = isPositive ? '✨' : (isNegative ? '❌' : '⚪');
            html += `<div style="margin-bottom: 3px;">${icon} ${trait}</div>`;
        }
        html += `</div>`;
    }

    html += `<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; font-size: 0.85em;">`;
    html += `<strong>${t('laboratory.beautyGuide')}</strong><br>`;
    html += `• ${t('laboratory.beautyGuide1')}<br>`;
    html += `• ${t('laboratory.beautyGuide2')}<br>`;
    html += `• ${t('laboratory.beautyGuide3')}<br>`;
    html += `• ${t('laboratory.beautyGuide4')}<br>`;
    html += `• ${t('laboratory.beautyGuide5')}<br>`;
    html += `• ${t('laboratory.beautyGuide6')}<br>`;
    html += `• ${t('laboratory.beautyGuide7')}`;
    html += `</div>`;

    html += `</div>`;

    // DNA Sequence Section (Compact, Parseable Format)
    html += `<div class="body-part-genes" style="background: linear-gradient(135deg, #00695c22, #00695c11); border-color: #00695c;">`;
    html += `<h4>🧬 ${t('laboratory.dnaSequence')} <span style="font-size: 0.7em; color: #666; font-weight: normal;">(${t('laboratory.compactGenotype')})</span></h4>`;

    // Generate compact DNA string
    const bodyPartAbbr = {
        'wings': 'W',
        'special_wing': 'S',
        'body': 'B',
        'head': 'H',
        'tail': 'T',
        'accents': 'A'
    };

    let dnaString = '';
    let fullDnaString = '';
    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        const part = parrot.genes[bodyPart];
        const rCount = parrot.countDominant(part.red);
        const gCount = parrot.countDominant(part.green);
        const bCount = parrot.countDominant(part.blue);
        const grad = part.gradient ? '*' : '';

        dnaString += `${bodyPartAbbr[bodyPart]}:${rCount}${gCount}${bCount}${grad} `;
        fullDnaString += `${rCount}${gCount}${bCount}${grad ? '1' : '0'}-`;
    }

    fullDnaString = fullDnaString.slice(0, -1); // Remove trailing dash

    html += `<div style="margin: 10px 0; padding: 12px; background: #f8f9fa; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 0.95em; word-break: break-all;">`;
    html += `<div style="color: #00695c; font-weight: bold; margin-bottom: 8px;">${dnaString.trim()}</div>`;
    html += `<div style="color: #666; font-size: 0.85em; margin-top: 5px;">${t('laboratory.raw')}: ${fullDnaString}</div>`;
    html += `</div>`;

    html += `<div style="margin-top: 10px; padding: 10px; background: #e0f2f1; border-radius: 8px; font-size: 0.85em;">`;
    html += `<strong>${t('laboratory.format')}</strong> ${t('laboratory.formatExplanation')}<br>`;
    html += `• ${t('laboratory.formatPart')}<br>`;
    html += `• ${t('laboratory.formatRGB')}<br>`;
    html += `• ${t('laboratory.formatGradient')}<br>`;
    html += `• ${t('laboratory.formatRaw')}`;
    html += `</div>`;

    html += `</div>`;

    // Body part genes sections
    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        const part = parrot.genes[bodyPart];
        const colorData = parrot.calculateBodyPartColor(bodyPart);

        html += `<div class="body-part-genes">`;
        html += `<h4>${bodyPartNames[bodyPart]}`;
        if (part.gradient) {
            html += ` <span class="gradient-badge">${t('laboratory.gradient').toUpperCase()}</span>`;
        }
        html += `</h4>`;

        // Red genes
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">${t('laboratory.redChannel')}</div>`;
        html += `<div class="gene-alleles">`;
        part.red.forEach((allele, i) => {
            html += `<span class="allele ${allele ? 'dominant' : 'recessive'}">${allele ? 'R' : 'r'}${i+1}</span>`;
        });
        const redValue = parrot.calculateRGBValue(part.red);
        html += ` = ${redValue}/255`;
        html += `</div>`;
        html += `</div>`;

        // Green genes
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">${t('laboratory.greenChannel')}</div>`;
        html += `<div class="gene-alleles">`;
        part.green.forEach((allele, i) => {
            html += `<span class="allele ${allele ? 'dominant' : 'recessive'}">${allele ? 'G' : 'g'}${i+1}</span>`;
        });
        const greenValue = parrot.calculateRGBValue(part.green);
        html += ` = ${greenValue}/255`;
        html += `</div>`;
        html += `</div>`;

        // Blue genes
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">${t('laboratory.blueChannel')}</div>`;
        html += `<div class="gene-alleles">`;
        part.blue.forEach((allele, i) => {
            html += `<span class="allele ${allele ? 'dominant' : 'recessive'}">${allele ? 'B' : 'b'}${i+1}</span>`;
        });
        const blueValue = parrot.calculateRGBValue(part.blue);
        html += ` = ${blueValue}/255`;
        html += `</div>`;
        html += `</div>`;

        // Gradient gene
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">${t('laboratory.gradientGene')}</div>`;
        html += `<div class="gene-alleles">`;
        html += `<span class="allele ${part.gradient ? 'dominant' : 'recessive'}">${part.gradient ? 'GRAD' : 'grad'}</span>`;
        html += `</div>`;
        html += `</div>`;

        // Color preview
        html += `<div class="gene-row" style="margin-top: 10px;">`;
        html += `<div class="gene-label">${t('laboratory.result')}</div>`;
        html += `<div>`;
        if (colorData.isGradient) {
            html += `<span class="color-preview" style="background: linear-gradient(90deg, ${colorData.startColor}, ${colorData.endColor});"></span>`;
            html += ` ${t('laboratory.gradient')}: ${colorData.startColor} → ${colorData.endColor}`;
        } else {
            html += `<span class="color-preview" style="background: ${colorData.color};"></span>`;
            html += ` ${t('laboratory.solid')}: ${colorData.color}`;
        }
        html += `</div>`;
        html += `</div>`;

        html += `</div>`;
    }

    display.innerHTML = html;
    modal.classList.add('active');
}

/**
 * Perform laboratory examination (pay and examine)
 * @param {number} parrotId - Parrot ID
 * @param {Function} saveGameFn - Save game function
 */
export async function performExamination(parrotId, saveGameFn) {
    const parrots = GameState.getParrots();
    const recentOffspring = GameState.getRecentOffspring();
    const parrot = parrots.find(p => p.id === parrotId) || recentOffspring.find(p => p.id === parrotId);
    if (!parrot) return;

    // Check if already examined
    const examinedParrots = GameState.getExaminedParrots();
    if (examinedParrots.has(parrotId)) {
        // Already examined, just show the lab
        openLaboratory(parrotId);
        return;
    }

    // Check if player has enough coins
    const coins = GameState.getCoins();
    if (coins < EXAMINATION_COST) {
        showToast(
            t('toasts.examNotEnoughCoins.title'),
            t('toasts.examNotEnoughCoins.message', { cost: EXAMINATION_COST, current: coins }),
            'error',
            3000
        );
        return;
    }

    GameState.addCoins(-EXAMINATION_COST);
    GameState.addExaminedParrot(parrotId);
    await UI.updateStats();
    await UI.renderParrotGrid(); // Refresh cards to show examined badge immediately
    if (saveGameFn) saveGameFn();

    // Show info toast
    showToast(
        t('toasts.examComplete.title'),
        t('toasts.examComplete.message', { name: parrot.name, cost: EXAMINATION_COST }),
        'info'
    );

    // Re-render the laboratory with full analysis
    openLaboratory(parrotId);
}

/**
 * Close laboratory modal
 */
export function closeModal() {
    document.getElementById('laboratoryModal').classList.remove('active');
}
