// src/lib/utils.js

/**
 * Merge multiple class names into a single string.
 * Ignores falsy values (undefined, null, false, "").
 * Useful for conditional Tailwind CSS classes.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Generate a random ID string
 */
export function generateId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an object is empty
 */
export function isEmpty(obj) {
  return obj && Object.keys(obj).length === 0;
}

/**
 * Simple page URL creator
 */
export function createPageUrl(path) {
  return `/${path.toLowerCase()}`;
}
