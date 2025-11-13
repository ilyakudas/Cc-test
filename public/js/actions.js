/**
 * ChromaWing Breeding Simulator - Actions Module
 * All user action handlers and game logic
 */

import * as GameState from './gameState.js';
import { Parrot } from './parrot.js';
import { breedParrotGenes } from './genetics.js';
import { generateParrotSVG } from './svg.js';
import { showToast } from './notifications.js';
import { getRandomName, createParrotWithPurity } from './utils.js';
import * as UI from './ui.js';

// Sell hold timer tracking
let sellHoldTimer = null;

/**
 * Select a parrot for viewing
 * @param {number} parrotId - Parrot ID
 */
export function selectParrot(parrotId) {
    GameState.setSelectedParrotId(parrotId);
    UI.updateUI();
}

/**
 * Add parrot to left breeding slot
 * @param {number} parrotId - Parrot ID
 */
export async function breedOnLeft(parrotId) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const breedingPair = GameState.getBreedingPair();
    // Prevent selecting the same parrot in both slots
    if (breedingPair.right === parrotId) {
        return;
    }

    GameState.setBreedingPair({ ...breedingPair, left: parrotId });
    await UI.renderBreedingSlots();
    await UI.renderParrotGrid(); // Refresh cards to show L/R badges immediately
    UI.updateBreedButton();
}

/**
 * Add parrot to right breeding slot
 * @param {number} parrotId - Parrot ID
 */
export async function breedOnRight(parrotId) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const breedingPair = GameState.getBreedingPair();
    // Prevent selecting the same parrot in both slots
    if (breedingPair.left === parrotId) {
        return;
    }

    GameState.setBreedingPair({ ...breedingPair, right: parrotId });
    await UI.renderBreedingSlots();
    await UI.renderParrotGrid(); // Refresh cards to show L/R badges immediately
    UI.updateBreedButton();
}

/**
 * Remove parrot from breeding slot
 * @param {string} slot - 'left' or 'right'
 */
export async function removeFromSlot(slot) {
    const breedingPair = GameState.getBreedingPair();
    breedingPair[slot] = null;
    GameState.setBreedingPair(breedingPair);
    await UI.renderBreedingSlots();
    UI.updateBreedButton();
}

/**
 * Breed parrots and create offspring
 * @param {Function} saveGameFn - Save game function
 * @param {Function} checkAchievementsFn - Check achievements function
 */
export async function breedParrots(saveGameFn, checkAchievementsFn) {
    const breedingPair = GameState.getBreedingPair();
    if (breedingPair.left === null || breedingPair.right === null) return;

    const parrots = GameState.getParrots();
    const parent1 = parrots.find(p => p.id === breedingPair.left);
    const parent2 = parrots.find(p => p.id === breedingPair.right);

    if (!parent1 || !parent2) return;

    // Check if player has enough coins (breeding costs 50 coins)
    const BREEDING_COST = 50;
    let coins = GameState.getCoins();
    if (coins < BREEDING_COST) {
        showToast(
            `Not enough coins!`,
            `Breeding costs ${BREEDING_COST} coins. You have ${coins}.`,
            'error',
            3000
        );
        return;
    }

    // Disable breed button to prevent double-clicking
    const breedBtn = document.getElementById('breedButton');
    const breedBtnLarge = document.getElementById('breedButtonLarge');
    if (breedBtn) breedBtn.disabled = true;
    if (breedBtnLarge) breedBtnLarge.disabled = true;

    // Deduct breeding cost
    GameState.addCoins(-BREEDING_COST);
    coins = GameState.getCoins(); // Update coins after breeding cost

    // Generate 4 offspring
    const offspring = [];
    for (let i = 0; i < 4; i++) {
        const childGenes = breedParrotGenes(parent1.genes, parent2.genes);
        const childGen = Math.max(parent1.generation, parent2.generation) + 1;

        // Update generation tracker
        const currentGen = GameState.getGeneration();
        if (childGen > currentGen) {
            GameState.setGeneration(childGen);
        }

        const child = new Parrot(
            getRandomName(),
            childGenes,
            childGen,
            GameState.getAndIncrementParrotIdCounter()
        );
        offspring.push(child);
    }

    // Auto-examine offspring if enabled
    const autoExamineEnabled = GameState.getAutoExamineEnabled();
    const EXAM_COST = 100;
    let examineCount = 0;
    let examineMessage = '';

    if (autoExamineEnabled && offspring.length > 0) {
        const maxExaminations = Math.min(offspring.length, Math.floor(coins / EXAM_COST));

        for (let i = 0; i < maxExaminations; i++) {
            GameState.addCoins(-EXAM_COST);
            GameState.markParrotExamined(offspring[i].id);
            examineCount++;
        }

        if (examineCount > 0) {
            examineMessage = ` ${examineCount} examined (-${examineCount * EXAM_COST} coins).`;
        } else {
            examineMessage = ` Auto-exam: Need ${EXAM_COST} coins per chick.`;
        }
    }

    // Add offspring to recent offspring list (shown in breeding lab)
    GameState.setRecentOffspring(offspring);

    // Clear breeding pair
    GameState.setBreedingPair({ left: null, right: null });

    // Update UI
    await UI.updateUI();

    // Update breeding lab if we're on the breeding tab
    if (GameState.getCurrentTab() === 'breeding') {
        await UI.updateBreedingLab();
    }

    // Re-enable breed buttons
    if (breedBtn) breedBtn.disabled = false;
    if (breedBtnLarge) breedBtnLarge.disabled = false;

    if (saveGameFn) saveGameFn();
    if (checkAchievementsFn) checkAchievementsFn(saveGameFn);

    // Show success toast
    showToast(
        `Breeding successful!`,
        `4 new chicks born!${examineMessage} Check the Breeding Lab.`,
        'success',
        6000
    );

    console.log('Breeding complete:', offspring.length, 'offspring created, examined:', examineCount);
}

/**
 * Buy parrot from store
 * @param {number} parrotId - Parrot ID
 * @param {Function} saveGameFn - Save game function
 * @param {Function} checkAchievementsFn - Check achievements function
 */
export function buyParrot(parrotId, saveGameFn, checkAchievementsFn) {
    const storeParrots = GameState.getStoreParrots();
    const parrot = storeParrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const price = parrot.getValue();
    const coins = GameState.getCoins();
    if (coins < price) {
        return;
    }

    GameState.addCoins(-price);
    GameState.addParrot(parrot);
    GameState.removeStoreParrot(parrotId);

    // Generate new store parrot (replace with similar rarity)
    const oldRarity = parrot.calculateRarity();
    let newParrot = null;
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts && !newParrot) {
        attempts++;

        let genes;
        if (oldRarity === 'legendary') {
            genes = createParrotWithPurity('high');
            // Add gradients to 2-3 body parts
            const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
            const numGradients = 2 + Math.floor(Math.random() * 2);
            for (let j = 0; j < numGradients; j++) {
                const part = bodyParts[Math.floor(Math.random() * bodyParts.length)];
                genes[part].gradient = true;
            }
        } else if (oldRarity === 'epic') {
            genes = createParrotWithPurity('high');
        } else if (oldRarity === 'rare') {
            genes = createParrotWithPurity('medium');
        } else if (oldRarity === 'uncommon') {
            genes = createParrotWithPurity('low');
        } else {
            genes = createParrotWithPurity('random');
        }

        const testParrot = new Parrot(
            getRandomName(),
            genes,
            1,
            GameState.getAndIncrementParrotIdCounter()
        );
        const actualRarity = testParrot.calculateRarity();

        // Accept if rarity matches or we're on last attempt
        if (actualRarity === oldRarity || attempts >= maxAttempts) {
            newParrot = testParrot;
        }
    }

    if (newParrot) {
        GameState.addStoreParrot(newParrot);
    }

    GameState.setSelectedParrotId(null);
    UI.updateUI();
    if (saveGameFn) saveGameFn();
    if (checkAchievementsFn) checkAchievementsFn(saveGameFn);

    // Show success toast
    const rarity = parrot.calculateRarity();
    showToast(
        `${parrot.name} joined your collection!`,
        `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} • Gen ${parrot.generation} • -${price} coins`,
        'success'
    );
}

/**
 * Start hold-to-sell process
 * @param {number} parrotId - Parrot ID
 * @param {Event} event - Mouse/touch event
 * @param {Function} saveGameFn - Save game function
 */
export function startSellHold(parrotId, event, saveGameFn) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const button = event.target;
    const sellValue = Math.floor(parrot.getValue() * 0.7);
    const holdDuration = 1000; // 1 second
    const startTime = Date.now();

    // Create progress overlay
    const progressBar = document.createElement('div');
    progressBar.className = 'hold-progress';
    progressBar.style.cssText = 'position: absolute; bottom: 0; left: 0; height: 4px; background: #28a745; width: 0%; transition: width 0.05s linear;';
    button.style.position = 'relative';
    button.appendChild(progressBar);

    button.classList.add('holding');

    sellHoldTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / holdDuration) * 100, 100);
        progressBar.style.width = `${progress}%`;

        if (elapsed >= holdDuration) {
            clearInterval(sellHoldTimer);
            sellHoldTimer = null;

            // Execute sell
            GameState.addCoins(sellValue);
            GameState.removeParrot(parrotId);

            // Clear from breeding pair if present
            const breedingPair = GameState.getBreedingPair();
            if (breedingPair.left === parrotId) {
                GameState.setBreedingPair({ ...breedingPair, left: null });
            }
            if (breedingPair.right === parrotId) {
                GameState.setBreedingPair({ ...breedingPair, right: null });
            }
            GameState.setSelectedParrotId(null);

            UI.updateUI();
            if (saveGameFn) saveGameFn();

            // Show info toast
            showToast(
                `${parrot.name} sold`,
                `+${sellValue} coins`,
                'success'
            );
        }
    }, 50);
}

/**
 * Cancel hold-to-sell process
 */
export function cancelSellHold() {
    if (sellHoldTimer) {
        clearInterval(sellHoldTimer);
        sellHoldTimer = null;
    }

    // Remove progress bar and holding class from all sell buttons
    document.querySelectorAll('.btn-sell').forEach(btn => {
        btn.classList.remove('holding');
        const progressBar = btn.querySelector('.hold-progress');
        if (progressBar) {
            progressBar.remove();
        }
    });
}

/**
 * Free parrot (release to wild, no coins)
 * @param {number} parrotId - Parrot ID
 * @param {Function} saveGameFn - Save game function
 */
export function freeParrot(parrotId, saveGameFn) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    if (!confirm(`Release ${parrot.name} to the wild? You won't get any coins.`)) return;

    GameState.removeParrot(parrotId);

    // Clear from breeding pair if present
    const breedingPair = GameState.getBreedingPair();
    if (breedingPair.left === parrotId) {
        GameState.setBreedingPair({ ...breedingPair, left: null });
    }
    if (breedingPair.right === parrotId) {
        GameState.setBreedingPair({ ...breedingPair, right: null });
    }
    GameState.setSelectedParrotId(null);

    UI.updateUI();
    if (saveGameFn) saveGameFn();

    // Show info toast
    showToast(
        `${parrot.name} released`,
        `Set free to the wild`,
        'info'
    );
}

/**
 * Open laboratory modal for parrot examination
 * @param {number} parrotId - Parrot ID
 */
export async function openLaboratory(parrotId) {
    const parrots = GameState.getParrots();
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const modal = document.getElementById('laboratoryModal');
    const display = document.getElementById('laboratoryDisplay');

    // Check if parrot has been examined before
    const examinedParrots = GameState.getExaminedParrots();
    const hasBeenExamined = examinedParrots.has(parrotId);
    const examCost = 100;
    const coins = GameState.getCoins();

    if (!hasBeenExamined) {
        // Show payment screen
        const svg = await generateParrotSVG(parrot);
        display.innerHTML = `
            <h3>🔬 Laboratory Analysis: ${parrot.name}</h3>
            <p style="color: #666; margin-bottom: 20px;">Generation ${parrot.generation}</p>

            <div style="text-align: center; margin: 20px 0;">
                <button class="btn btn-lab" onclick="window.performExaminationHandler(${parrotId})" ${coins < examCost ? 'disabled' : ''} style="font-size: 1.1em; padding: 15px 30px; width: 100%; max-width: 400px;">
                    ${coins < examCost ? '❌ Not Enough Coins' : `💰 Pay ${examCost} Coins & Examine`}
                </button>
                ${coins < examCost ? `<p style="color: #dc3545; margin-top: 10px;">You need ${examCost - coins} more coins</p>` : ''}
            </div>

            <div style="text-align: center; margin: 20px 0;">
                <div style="width: 250px; height: 250px; margin: 0 auto; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    ${svg}
                </div>
            </div>

            <div style="background: #e7f3ff; border-left: 4px solid #2196f3; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1976d2;">🔬 Analysis Includes:</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>78 Gene Breakdown (6 body parts × 13 genes)</li>
                    <li>Rarity Analysis with detailed scoring</li>
                    <li>Beauty Assessment with color harmony</li>
                    <li>RGB values for each body part</li>
                </ul>
                <p style="margin: 10px 0 0 0; font-weight: bold; color: #1976d2;">💰 One-time cost: ${examCost} coins per parrot</p>
            </div>
        `;
        modal.classList.add('active');
        return;
    }

    // Show full analysis for examined parrot
    const bodyPartNames = {
        'wings': '🪽 Wings',
        'special_wing': '✨ Special Wing (wing-blue-1, 4)',
        'body': '🦜 Body',
        'head': '👑 Head',
        'tail': '🎨 Tail',
        'accents': '💎 Accents'
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
        'common': { color: '#9e9e9e', label: 'Common' },
        'uncommon': { color: '#4caf50', label: 'Uncommon' },
        'rare': { color: '#2196f3', label: 'Rare' },
        'epic': { color: '#9c27b0', label: 'Epic' },
        'legendary': { color: '#ff9800', label: 'Legendary' }
    };

    const rarityInfo = rarityConfig[rarity];

    let html = `<h3>🔬 Laboratory Analysis: ${parrot.name}</h3>`;
    html += `<p style="color: #666; margin-bottom: 20px;">Generation ${parrot.generation} • Total: 78 Genes (6 body parts × 13 genes each)</p>`;

    // Rarity Summary Section
    html += `<div class="body-part-genes" style="background: linear-gradient(135deg, ${rarityInfo.color}22, ${rarityInfo.color}11); border-color: ${rarityInfo.color};">`;
    html += `<h4>📊 Rarity Analysis <span class="rarity-badge" style="background: ${rarityInfo.color}; margin-left: 10px;">${rarityInfo.label}</span></h4>`;
    html += `<div class="gene-row">`;
    html += `<div class="gene-label">Rarity Score</div>`;
    html += `<div style="font-weight: bold; color: ${rarityInfo.color};">${totalRareTraits} / ${maxTraits} points (${(rarityRatio * 100).toFixed(1)}%)</div>`;
    html += `</div>`;

    // Breakdown by body part
    html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">Points by Body Part:</div>`;
    for (const part of rarityBreakdown) {
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">`;
        html += `<span>${part.name}</span>`;
        html += `<span style="color: ${rarityInfo.color};">${part.points}/${part.maxPoints} ${part.hasGradient ? '✨' : ''}</span>`;
        html += `</div>`;
    }
    html += `</div>`;

    html += `<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; font-size: 0.85em;">`;
    html += `<strong>Rarity Guide:</strong><br>`;
    html += `• Pure (0 or 4 dominant): 2 pts per color<br>`;
    html += `• Nearly Pure (1 or 3): 1 pt per color<br>`;
    html += `• Mixed (2 dominant): 0 pts<br>`;
    html += `• Gradient: +4 pts (very rare!)`;
    html += `</div>`;

    html += `</div>`;

    // Beauty Analysis Section
    const beautyData = parrot.calculateBeauty();
    const beautyPercent = (beautyData.score / beautyData.maxScore) * 100;
    let beautyColor = '#9e9e9e';
    let beautyLabel = 'Plain';
    if (beautyPercent >= 70) {
        beautyColor = '#ff69b4';
        beautyLabel = 'Stunning';
    } else if (beautyPercent >= 50) {
        beautyColor = '#ff1493';
        beautyLabel = 'Beautiful';
    } else if (beautyPercent >= 30) {
        beautyColor = '#dda0dd';
        beautyLabel = 'Pretty';
    } else if (beautyPercent >= 15) {
        beautyColor = '#d8bfd8';
        beautyLabel = 'Decent';
    }

    html += `<div class="body-part-genes" style="background: linear-gradient(135deg, ${beautyColor}22, ${beautyColor}11); border-color: ${beautyColor};">`;
    html += `<h4>🌸 Beauty Analysis <span class="rarity-badge" style="background: ${beautyColor}; margin-left: 10px;">${beautyLabel}</span></h4>`;
    html += `<div class="gene-row">`;
    html += `<div class="gene-label">Beauty Score</div>`;
    html += `<div style="font-weight: bold; color: ${beautyColor};">${beautyData.score} / ${beautyData.maxScore} points (${beautyPercent.toFixed(1)}%)</div>`;
    html += `</div>`;

    // Color classifications
    html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">Body Part Colors:</div>`;
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
    html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">Beauty Contribution by Part:</div>`;
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
        html += `<div style="font-weight: 600; margin-bottom: 5px; color: #666;">Beauty Traits:</div>`;
        for (const trait of beautyData.traits) {
            const isPositive = trait.includes('+');
            const isNegative = trait.includes('-');
            const icon = isPositive ? '✨' : (isNegative ? '❌' : '⚪');
            html += `<div style="margin-bottom: 3px;">${icon} ${trait}</div>`;
        }
        html += `</div>`;
    }

    html += `<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; font-size: 0.85em;">`;
    html += `<strong>Beauty Guide:</strong><br>`;
    html += `• Different color gradients: +10 pts<br>`;
    html += `• Each beautiful solid color: +3 pts<br>`;
    html += `• Color diversity (3+ colors): +15 pts<br>`;
    html += `• Complementary colors: +18 pts<br>`;
    html += `• Contrasting colors: +12 pts<br>`;
    html += `• Different colors: +5 pts<br>`;
    html += `• Similar colors: -3 pts penalty`;
    html += `</div>`;

    html += `</div>`;

    // DNA Sequence Section (Compact, Parseable Format)
    html += `<div class="body-part-genes" style="background: linear-gradient(135deg, #00695c22, #00695c11); border-color: #00695c;">`;
    html += `<h4>🧬 DNA Sequence <span style="font-size: 0.7em; color: #666; font-weight: normal;">(Compact Genotype)</span></h4>`;

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
    html += `<div style="color: #666; font-size: 0.85em; margin-top: 5px;">Raw: ${fullDnaString}</div>`;
    html += `</div>`;

    html += `<div style="margin-top: 10px; padding: 10px; background: #e0f2f1; border-radius: 8px; font-size: 0.85em;">`;
    html += `<strong>Format:</strong> [Part]:[R][G][B][Gradient]<br>`;
    html += `• Part: W=Wings, S=Special, B=Body, H=Head, T=Tail, A=Accents<br>`;
    html += `• RGB: 0-4 dominant alleles per color<br>`;
    html += `• Gradient: * if present<br>`;
    html += `• Raw format: RGBG-RGBG-... (G=0/1 for gradient)`;
    html += `</div>`;

    html += `</div>`;

    // Body part genes sections
    for (const bodyPart of ['wings', 'special_wing', 'body', 'head', 'tail', 'accents']) {
        const part = parrot.genes[bodyPart];
        const colorData = parrot.calculateBodyPartColor(bodyPart);

        html += `<div class="body-part-genes">`;
        html += `<h4>${bodyPartNames[bodyPart]}`;
        if (part.gradient) {
            html += ` <span class="gradient-badge">GRADIENT</span>`;
        }
        html += `</h4>`;

        // Red genes
        html += `<div class="gene-row">`;
        html += `<div class="gene-label">Red (4)</div>`;
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
        html += `<div class="gene-label">Green (4)</div>`;
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
        html += `<div class="gene-label">Blue (4)</div>`;
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
        html += `<div class="gene-label">Gradient (1)</div>`;
        html += `<div class="gene-alleles">`;
        html += `<span class="allele ${part.gradient ? 'dominant' : 'recessive'}">${part.gradient ? 'GRAD' : 'grad'}</span>`;
        html += `</div>`;
        html += `</div>`;

        // Color preview
        html += `<div class="gene-row" style="margin-top: 10px;">`;
        html += `<div class="gene-label">Result</div>`;
        html += `<div>`;
        if (colorData.isGradient) {
            html += `<span class="color-preview" style="background: linear-gradient(90deg, ${colorData.startColor}, ${colorData.endColor});"></span>`;
            html += ` Gradient: ${colorData.startColor} → ${colorData.endColor}`;
        } else {
            html += `<span class="color-preview" style="background: ${colorData.color};"></span>`;
            html += ` Solid: ${colorData.color}`;
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
    const parrot = parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    GameState.addCoins(-100);
    GameState.markParrotExamined(parrotId);
    await UI.updateStats();
    await UI.renderParrotGrid(); // Refresh cards to show examined badge immediately
    if (saveGameFn) saveGameFn();

    // Show info toast
    showToast(
        `Laboratory analysis complete`,
        `${parrot.name} examined • -100 coins`,
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

/**
 * Toggle mutations on/off
 * @param {Function} saveGameFn - Save game function
 */
export function toggleMutations(saveGameFn) {
    const mutationsEnabled = GameState.getMutationsEnabled();
    GameState.setMutationsEnabled(!mutationsEnabled);

    const newState = GameState.getMutationsEnabled();
    const statusEl = document.getElementById('mutationStatus');
    const iconEl = document.getElementById('mutationIcon');

    if (newState) {
        statusEl.textContent = 'ON';
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🧪';
        showToast('Mutations Enabled', 'Breeding can introduce new genes', 'success', 3000);
    } else {
        statusEl.textContent = 'OFF';
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
        showToast('Mutations Disabled', 'Breeding will preserve pure genes', 'info', 3000);
    }

    if (saveGameFn) saveGameFn();
}

/**
 * Toggle auto-examine setting
 * @param {Function} saveGameFn - Save game function
 */
export function toggleAutoExamine(saveGameFn) {
    const enabled = GameState.toggleAutoExamineEnabled();

    // Update UI
    const statusEl = document.getElementById('autoExamineStatus');
    const iconEl = document.getElementById('autoExamineIcon');

    if (enabled) {
        statusEl.textContent = 'ON';
        statusEl.style.color = '#4caf50';
        iconEl.textContent = '🔬';
        showToast('Auto-Examine Enabled', 'New offspring will be automatically examined if you have enough coins', 'success', 3000);
    } else {
        statusEl.textContent = 'OFF';
        statusEl.style.color = '#dc3545';
        iconEl.textContent = '🔒';
        showToast('Auto-Examine Disabled', 'You must manually examine offspring', 'info', 3000);
    }

    if (saveGameFn) saveGameFn();
}

/**
 * Move all recent offspring to collection
 */
export async function moveOffspringToCollection(saveGameFn) {
    const offspring = GameState.getRecentOffspring();
    if (offspring.length === 0) return;

    GameState.moveRecentOffspringToCollection();
    await UI.updateUI();
    await UI.updateBreedingLab();

    if (saveGameFn) saveGameFn();

    showToast(
        `Moved to collection!`,
        `${offspring.length} parrots added to your collection`,
        'success',
        3000
    );
}

/**
 * Dismiss all recent offspring
 */
export async function dismissOffspring(saveGameFn) {
    const offspring = GameState.getRecentOffspring();
    if (offspring.length === 0) return;

    const count = offspring.length;
    GameState.clearRecentOffspring();
    await UI.updateBreedingLab();

    if (saveGameFn) saveGameFn();

    showToast(
        `Offspring dismissed`,
        `${count} parrots released into the wild`,
        'info',
        3000
    );
}
