// Build a page URL with a common prefix
export function createPageUrl(path) {
  return `/app/${path}`;
}

// Format a date (wrapper around date-fns if needed)
export function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

// Capitalize the first letter of a string
export function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Generate a random ID (useful for keys)
export function generateId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

// Check if an object is empty
export function isEmpty(obj) {
  return obj && Object.keys(obj).length === 0;
}
