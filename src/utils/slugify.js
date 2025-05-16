/**
 * Converts a string into a URL-friendly slug.
 * 
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The generated slug
 */
export function generateSlug(text) {
  return text
    .toString()                   // Convert to string
    .toLowerCase()                // Convert to lowercase
    .trim()                       // Remove whitespace from both ends
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')     // Remove all non-word characters (except hyphens)
    .replace(/\-\-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')           // Remove leading hyphens
    .replace(/-+$/, '');          // Remove trailing hyphens
}
