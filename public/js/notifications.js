/**
 * ChromaWing Breeding Simulator - Notifications Module
 * Toast notification system and notification history
 */

import { TOAST_ICONS } from './constants.js';
import { getNextToastId, getNotificationHistory, addNotification, setNotificationHistory } from './gameState.js';

/**
 * Show a toast notification
 * @param {string} message - Main message
 * @param {string} details - Additional details (optional)
 * @param {string} type - Notification type (success, info, warning, error)
 * @param {number} duration - Duration in ms (0 = no auto-dismiss)
 * @returns {number} Toast ID
 */
export function showToast(message, details = '', type = 'info', duration = 4000) {
    const toastId = getNextToastId();
    const container = document.getElementById('toastContainer');
    const icon = TOAST_ICONS[type] || 'ℹ️';

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${toastId}`;

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
            ${details ? `<div class="toast-details">${details}</div>` : ''}
        </div>
        <button class="toast-close" onclick="window.dismissToast('toast-${toastId}')">&times;</button>
    `;

    container.appendChild(toast);

    // Add to history
    addToHistoryInternal(message, details, type);

    // Auto-dismiss after duration
    if (duration > 0) {
        setTimeout(() => {
            dismissToast(`toast-${toastId}`);
        }, duration);
    }

    return toastId;
}

/**
 * Dismiss a toast notification
 * @param {string} toastId - Toast element ID
 */
export function dismissToast(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;

    toast.classList.add('toast-exit');

    setTimeout(() => {
        toast.remove();
    }, 300); // Match animation duration
}

/**
 * Add notification to history
 * @private
 */
function addToHistoryInternal(message, details, type) {
    const timestamp = new Date();
    addNotification({
        message,
        details,
        type,
        timestamp
    });

    // Limit history to 50 items
    const history = getNotificationHistory();
    if (history.length > 50) {
        history.pop();
        setNotificationHistory(history);
    }

    updateNotificationCount();
    updateNotificationHistoryDisplay();
}

/**
 * Update notification count badge
 */
export function updateNotificationCount() {
    const countElement = document.getElementById('notificationCount');
    if (countElement) {
        countElement.textContent = getNotificationHistory().length;
    }
}

/**
 * Toggle notification history panel
 */
export function toggleNotificationHistory() {
    const panel = document.getElementById('notificationHistoryPanel');
    panel.classList.toggle('active');
}

/**
 * Clear all notifications from history
 */
export function clearNotificationHistory() {
    if (!confirm('Clear all notifications?')) return;

    setNotificationHistory([]);
    updateNotificationCount();
    updateNotificationHistoryDisplay();
}

/**
 * Update notification history display
 */
export function updateNotificationHistoryDisplay() {
    const listElement = document.getElementById('notificationHistoryList');
    const history = getNotificationHistory();

    if (!listElement) return;

    if (history.length === 0) {
        listElement.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">No notifications yet</div>';
        return;
    }

    listElement.innerHTML = history.map(notif => {
        const icon = TOAST_ICONS[notif.type] || 'ℹ️';
        const timeStr = formatTimeAgo(notif.timestamp);

        return `
            <div class="notification-history-item ${notif.type}">
                <div class="notification-history-item-header">
                    <span class="notification-history-item-icon">${icon}</span>
                    <span class="notification-history-item-message">${notif.message}</span>
                    <span class="notification-history-item-time">${timeStr}</span>
                </div>
                ${notif.details ? `<div class="notification-history-item-details">${notif.details}</div>` : ''}
            </div>
        `;
    }).join('');
}

/**
 * Format timestamp as relative time
 * @param {Date} timestamp - Timestamp to format
 * @returns {string} Formatted time string
 */
function formatTimeAgo(timestamp) {
    const seconds = Math.floor((new Date() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Expose functions to window for onclick handlers
if (typeof window !== 'undefined') {
    window.dismissToast = dismissToast;
    window.toggleNotificationHistory = toggleNotificationHistory;
    window.clearNotificationHistory = clearNotificationHistory;
}
