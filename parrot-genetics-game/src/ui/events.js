// ChromaWing - UI Event Handlers
// v3.0

import { state, setCurrentTab, toggleMutations as stateMutations } from '../game/gameState.js';

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

    // For now, show a simple placeholder
    display.innerHTML = `
        <h2>🔬 Laboratory Analysis</h2>
        <h3>${parrot.name}</h3>
        <p><strong>Generation:</strong> ${parrot.generation}</p>
        <p><strong>Rarity:</strong> ${parrot.calculateRarity()}</p>
        <p><strong>Beauty Score:</strong> ${Math.round(parrot.calculateBeauty().score)}</p>
        <p><strong>Value:</strong> ${parrot.getValue()} coins</p>
        <hr>
        <p style="color: #999; font-style: italic;">Full genetic analysis coming in future update...</p>
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
