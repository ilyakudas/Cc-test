// ChromaWing - Toast Notification System
// v3.0

// Notification state
let notificationHistory = [];
let toastIdCounter = 0;
const MAX_HISTORY = 50;

// Toast type icons
const TOAST_ICONS = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌'
};

/**
 * Show a toast notification
 * @param {string} message - Main message
 * @param {string} details - Additional details (optional)
 * @param {string} type - Type: success, info, warning, error
 * @param {number} duration - Duration in ms (default 4000, 0 for permanent)
 */
export function showToast(message, details = '', type = 'info', duration = 4000) {
    const toastId = toastIdCounter++;
    const container = document.getElementById('toastContainer');

    if (!container) {
        console.warn('[Toast] Container not found, falling back to alert');
        alert(`${message}${details ? '\n' + details : ''}`);
        return;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${toastId}`;

    const icon = TOAST_ICONS[type] || 'ℹ️';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
            ${details ? `<div class="toast-details">${details}</div>` : ''}
        </div>
        <button class="toast-close" onclick="dismissToast(${toastId})">&times;</button>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);

    // Auto dismiss if duration > 0
    if (duration > 0) {
        setTimeout(() => {
            dismissToast(toastId);
        }, duration);
    }

    // Add to history
    addToHistory(message, details, type);
}

/**
 * Dismiss a toast notification
 * @param {number} toastId - ID of toast to dismiss
 */
export function dismissToast(toastId) {
    const toast = document.getElementById(`toast-${toastId}`);
    if (!toast) return;

    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Add notification to history
 * @param {string} message
 * @param {string} details
 * @param {string} type
 */
function addToHistory(message, details, type) {
    const notification = {
        message,
        details,
        type,
        timestamp: Date.now()
    };

    notificationHistory.unshift(notification);

    // Keep only last MAX_HISTORY notifications
    if (notificationHistory.length > MAX_HISTORY) {
        notificationHistory = notificationHistory.slice(0, MAX_HISTORY);
    }

    updateNotificationCount();
    updateNotificationHistoryDisplay();
}

/**
 * Update notification count badge
 */
function updateNotificationCount() {
    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.textContent = notificationHistory.length;
    }
}

/**
 * Toggle notification history panel
 */
export function toggleNotificationHistory() {
    const panel = document.getElementById('notificationHistoryPanel');
    if (!panel) return;

    const isVisible = panel.style.display === 'flex';
    panel.style.display = isVisible ? 'none' : 'flex';

    if (!isVisible) {
        updateNotificationHistoryDisplay();
    }
}

/**
 * Clear all notification history
 */
export function clearNotificationHistory() {
    notificationHistory = [];
    updateNotificationCount();
    updateNotificationHistoryDisplay();
}

/**
 * Update notification history display
 */
function updateNotificationHistoryDisplay() {
    const list = document.getElementById('notificationHistoryList');
    if (!list) return;

    if (notificationHistory.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No notifications</p>';
        return;
    }

    list.innerHTML = '';

    notificationHistory.forEach(notification => {
        const item = document.createElement('div');
        item.className = `notification-item notification-${notification.type}`;

        const icon = TOAST_ICONS[notification.type] || 'ℹ️';
        const timeAgo = formatTimeAgo(notification.timestamp);

        item.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-message">${notification.message}</div>
                ${notification.details ? `<div class="notification-details">${notification.details}</div>` : ''}
                <div class="notification-time">${timeAgo}</div>
            </div>
        `;

        list.appendChild(item);
    });
}

/**
 * Format timestamp as time ago
 * @param {number} timestamp
 * @returns {string}
 */
function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Export for window
export { notificationHistory };
