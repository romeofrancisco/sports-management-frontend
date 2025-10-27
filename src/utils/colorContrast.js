/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex) => {
  if (!hex) return { r: 0, g: 0, b: 0 };
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return { r, g, b };
};

/**
 * Calculate relative luminance of a color
 */
export const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Determine if a color is light or dark
 */
export const isLightColor = (hexColor) => {
  const { r, g, b } = hexToRgb(hexColor);
  const luminance = getLuminance(r, g, b);
  return luminance > 0.5;
};

/**
 * Get the best text color (white or black) for a given background
 */
export const getBestTextColor = (backgroundColor) => {
  if (!backgroundColor) return '#000000';
  
  const bgRgb = hexToRgb(backgroundColor);
  const whiteRgb = { r: 255, g: 255, b: 255 };
  const blackRgb = { r: 0, g: 0, b: 0 };
  
  const whiteContrast = getContrastRatio(bgRgb, whiteRgb);
  const blackContrast = getContrastRatio(bgRgb, blackRgb);
  
  // Return white if it has better contrast, otherwise black
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
};

/**
 * Get contrasting text style with shadow for better visibility
 */
export const getContrastingTextStyle = (backgroundColor) => {
  const textColor = getBestTextColor(backgroundColor);
  const shadowColor = textColor === '#FFFFFF' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
  
  return {
    color: textColor,
    textShadow: `2px 2px 4px ${shadowColor}`,
  };
};