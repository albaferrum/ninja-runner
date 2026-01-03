// ===== NAVIGATION MODULE =====
// Ekran navigasyonu

// Screen references (DOM'dan alınacak)
let screens = null;

// Initialize navigation with DOM screens
export function initNavigation(screenElements) {
  screens = screenElements;
}

// Show a specific screen
export function showScreen(name) {
  if (!screens) {
    console.error('Navigation not initialized');
    return;
  }
  Object.values(screens).forEach(s => s.classList.remove('active'));
  if (screens[name]) {
    screens[name].classList.add('active');
  }
}

// Get current active screen
export function getActiveScreen() {
  if (!screens) return null;
  for (const [name, el] of Object.entries(screens)) {
    if (el.classList.contains('active')) {
      return name;
    }
  }
  return null;
}
