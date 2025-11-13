// ChromaWing - UI Event Handlers
// v3.0

import { state, setCurrentTab, toggleMutations as stateMutations } from '../game/gameState.js';
import { renderContestsTab } from '../game/contests.js';

// Switch tabs
export function switchTab(tab) {
    state.currentTab = tab;
    setCurrentTab(tab);

    // Update active tab button
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide appropriate content
    document.getElementById('collectionTab').style.display = tab === 'collection' ? 'grid' : 'none';
    document.getElementById('storeTab').style.display = tab === 'store' ? 'grid' : 'none';
    document.getElementById('contestsTab').style.display = tab === 'contests' ? 'block' : 'none';

    // Render contests tab content if switching to contests
    if (tab === 'contests') {
        renderContestsTab();
    }

    // Update panel title
    const titles = {
        'collection': 'Your Parrots',
        'store': 'Store',
        'contests': 'Contests'
    };
    document.getElementById('panelTitle').textContent = titles[tab] || 'Your Parrots';
}

// Toggle mutations
export function toggleMutations() {
    const enabled = stateMutations();

    // Update UI
    const icon = document.getElementById('mutationIcon');
    const status = document.getElementById('mutationStatus');

    if (icon && status) {
        icon.textContent = enabled ? '🧪' : '🔒';
        status.textContent = enabled ? 'ON' : 'OFF';
        status.style.color = enabled ? '#4caf50' : '#f44336';
    }

    // Show toast if available
    if (window.showToast) {
        window.showToast(
            `Mutations ${enabled ? 'enabled' : 'disabled'}`,
            enabled ? 'Offspring may have random gene mutations' : 'Offspring will have exact inherited genes',
            'info'
        );
    }
}

// Open laboratory modal
export function openLaboratory(parrotId) {
    const parrot = state.parrots.find(p => p.id === parrotId);
    if (!parrot) return;

    const modal = document.getElementById('laboratoryModal');
    const display = document.getElementById('laboratoryDisplay');

    if (!modal || !display) {
        console.warn('[Events] Laboratory modal not found');
        alert('Laboratory feature coming soon!');
        return;
    }

    // Get detailed analysis
    const rarity = parrot.calculateRarity();
    const beauty = parrot.calculateBeauty();
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
    const bodyPartLabels = {
        'wings': 'Wings',
        'special_wing': 'Special Wings',
        'body': 'Body',
        'head': 'Head',
        'tail': 'Tail',
        'accents': 'Accents'
    };

    // Generate genetics table
    let geneticsTable = '<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">';
    geneticsTable += '<thead><tr style="background: #2a2a3e; color: white;">';
    geneticsTable += '<th style="padding: 8px; border: 1px solid #444;">Part</th>';
    geneticsTable += '<th style="padding: 8px; border: 1px solid #444;">Red</th>';
    geneticsTable += '<th style="padding: 8px; border: 1px solid #444;">Green</th>';
    geneticsTable += '<th style="padding: 8px; border: 1px solid #444;">Blue</th>';
    geneticsTable += '<th style="padding: 8px; border: 1px solid #444;">Gradient</th>';
    geneticsTable += '<th style="padding: 8px; border: 1px solid #444;">Color</th>';
    geneticsTable += '</tr></thead><tbody>';

    for (const part of bodyParts) {
        const genes = parrot.genes[part];
        const redDom = parrot.countDominant(genes.red);
        const greenDom = parrot.countDominant(genes.green);
        const blueDom = parrot.countDominant(genes.blue);
        const colorInfo = parrot.calculateBodyPartColor(part);
        const colorDisplay = beauty.bodyPartColors[part]?.displayColor || 'N/A';

        geneticsTable += `<tr style="background: ${part === 'wings' || part === 'body' || part === 'tail' ? '#1a1a2e' : '#16213e'};">`;
        geneticsTable += `<td style="padding: 8px; border: 1px solid #444;"><strong>${bodyPartLabels[part]}</strong></td>`;
        geneticsTable += `<td style="padding: 8px; border: 1px solid #444;">${redDom}/4</td>`;
        geneticsTable += `<td style="padding: 8px; border: 1px solid #444;">${greenDom}/4</td>`;
        geneticsTable += `<td style="padding: 8px; border: 1px solid #444;">${blueDom}/4</td>`;
        geneticsTable += `<td style="padding: 8px; border: 1px solid #444;">${genes.gradient ? '✓' : '✗'}</td>`;
        geneticsTable += `<td style="padding: 8px; border: 1px solid #444;">${colorDisplay}</td>`;
        geneticsTable += '</tr>';
    }
    geneticsTable += '</tbody></table>';

    // Beauty score breakdown
    let beautyBreakdown = '<div style="margin: 15px 0;">';
    beautyBreakdown += `<h4>Beauty Score Breakdown: ${Math.round(beauty.score)}/200</h4>`;
    beautyBreakdown += '<ul style="list-style: none; padding-left: 0; max-height: 200px; overflow-y: auto;">';
    for (const trait of beauty.traits) {
        beautyBreakdown += `<li style="padding: 3px 0; font-size: 0.9em;">• ${trait}</li>`;
    }
    beautyBreakdown += '</ul></div>';

    // Part contributions
    let contributionsTable = '<table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 0.9em;">';
    contributionsTable += '<thead><tr style="background: #2a2a3e; color: white;">';
    contributionsTable += '<th style="padding: 6px; border: 1px solid #444;">Part</th>';
    contributionsTable += '<th style="padding: 6px; border: 1px solid #444;">Contribution</th>';
    contributionsTable += '</tr></thead><tbody>';

    for (const part of bodyParts) {
        const contrib = beauty.partContributions[part] || 0;
        contributionsTable += `<tr style="background: ${part === 'wings' || part === 'body' || part === 'tail' ? '#1a1a2e' : '#16213e'};">`;
        contributionsTable += `<td style="padding: 6px; border: 1px solid #444;">${bodyPartLabels[part]}</td>`;
        contributionsTable += `<td style="padding: 6px; border: 1px solid #444;">${contrib >= 0 ? '+' : ''}${contrib.toFixed(1)}</td>`;
        contributionsTable += '</tr>';
    }
    contributionsTable += '</tbody></table>';

    // DNA string
    const dnaString = window.getDNAString ? window.getDNAString(parrot, 'human') : 'N/A';

    // Build complete display
    display.innerHTML = `
        <div style="max-height: 80vh; overflow-y: auto;">
            <h2>🔬 Laboratory Analysis</h2>
            <h3>${parrot.name}</h3>

            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <h4>Basic Statistics</h4>
                <p><strong>Generation:</strong> ${parrot.generation}</p>
                <p><strong>Rarity:</strong> <span style="text-transform: capitalize;">${rarity}</span></p>
                <p><strong>Beauty Score:</strong> ${Math.round(beauty.score)} / 200</p>
                <p><strong>Value:</strong> ${parrot.getValue()} coins</p>
                <p><strong>Has Gradients:</strong> ${parrot.hasAnyGradients() ? 'Yes' : 'No'}</p>
            </div>

            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <h4>Genetic Makeup</h4>
                ${geneticsTable}
            </div>

            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin: 10px 0;">
                ${beautyBreakdown}
            </div>

            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <h4>Part Contributions to Beauty</h4>
                ${contributionsTable}
            </div>

            <div style="background: #1a1a2e; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <h4>DNA String</h4>
                <p style="font-family: monospace; word-break: break-all; font-size: 0.9em;">${dnaString}</p>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// Close modals
export function closeModal() {
    document.getElementById('laboratoryModal').style.display = 'none';
}

export function closeContestModal() {
    document.getElementById('contestModal').style.display = 'none';
}

// Notification history (placeholder)
export function toggleNotificationHistory() {
    const panel = document.getElementById('notificationHistoryPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    }
}

export function clearNotificationHistory() {
    const list = document.getElementById('notificationHistoryList');
    if (list) {
        list.innerHTML = '<p style="text-align: center; color: #999;">No notifications</p>';
    }
    document.getElementById('notificationCount').textContent = '0';
}
