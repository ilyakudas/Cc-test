// ChromaWing - Color Utilities
// v3.0

// Fixed colors for non-genetic elements
export const FIXED_COLORS = {
    GROUND: '#8B7355',
    SKY: '#87CEEB',
    EYE_BLACK: '#000000',
    EYE_WHITE: '#FFFFFF',
    CLAW: '#4A4A4A',
    FACE: '#FFFFFF',
    CONTOUR: '#000000',
    BEAK: '#696969'
};

// Parse RGB string to array
export function parseRGB(rgbString) {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return null;
}

// Convert RGB array to string
export function rgbToString(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}

// Convert hex to RGB
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Convert RGB to hex
export function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
