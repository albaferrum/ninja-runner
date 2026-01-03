// ===== LOCATION DEFINITIONS =====
// Tüm oyun lokasyonlarının tanımları

export const LOCATIONS = {
  dark: {
    name: 'Karanlık Gece',
    bgGradient: ['#0b0d12', '#12162a', '#1a1a2e'],
    groundColor: 'rgba(255,255,255,0.2)',
    dashColor: 'rgba(255,255,255,0.08)',
    cloudColor: '#fff',
    cloudAlpha: 0.12,
    skyObjects: 'moon',
    canvasBg: 'radial-gradient(900px 700px at 50% 0%, #12162a 0%, #0b0d12 60%, #070910 100%)'
  },
  forest: {
    name: 'Orman',
    bgGradient: ['#87ceeb', '#98d8c8', '#2d5016'],
    groundColor: 'rgba(34,139,34,0.8)',
    dashColor: 'rgba(139,69,19,0.4)',
    cloudColor: '#fff',
    cloudAlpha: 0.5,
    skyObjects: 'sun',
    trees: true,
    canvasBg: 'linear-gradient(180deg, #87ceeb 0%, #98d8c8 40%, #2d5016 100%)'
  },
  mountain: {
    name: 'Dağ',
    bgGradient: ['#f9a825', '#ffcc80', '#5d4037'],
    groundColor: 'rgba(93,64,55,0.8)',
    dashColor: 'rgba(121,85,72,0.5)',
    cloudColor: '#ffecb3',
    cloudAlpha: 0.4,
    skyObjects: 'sunset',
    mountains: true,
    canvasBg: 'linear-gradient(180deg, #f9a825 0%, #ffcc80 40%, #8d6e63 70%, #5d4037 100%)'
  }
};

// Lokasyon listesini al
export function getLocationList() {
  return Object.keys(LOCATIONS);
}

// Lokasyon bilgisi al
export function getLocation(id) {
  return LOCATIONS[id] || null;
}
