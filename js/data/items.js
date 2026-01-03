// ===== ITEM DEFINITIONS =====
// Oyun içi özel eşyalar ve Dojo kalıcı bonusları

// ===== DOJO ITEMS (Kalıcı Bonuslar) =====
export const DOJO_ITEMS = {
  doubleJump: {
    id: 'doubleJump',
    name: 'Çift Zıplama',
    icon: '🦘',
    description: 'Havadayken tekrar zıplayabilirsin!',
    price: 3000,
    maxCount: 1 // Bir kez alınabilir
  },
  extraLife: {
    id: 'extraLife',
    name: 'Ekstra Can',
    icon: '❤️',
    description: 'Her oyuna +1 can ile başla!',
    price: 3000,
    maxCount: Infinity // Sınırsız alınabilir
  },
  airDash: {
    id: 'airDash',
    name: 'İtici Güç',
    icon: '💨',
    description: 'Havada E tuşu ile ileri atıl!',
    price: 3000,
    maxCount: 1 // Bir kez alınabilir
  }
};

// ===== SPECIAL ITEMS (Oyun içi satın alınan eşyalar) =====
export const SPECIAL_ITEMS = [
  {
    id: 'lightning_armor',
    name: 'Yıldırım Zırhı',
    icon: '⚡',
    description: '15 saniye boyunca tüm rakiplerin içinden geç! Dokunulmaz ol.',
    price: 100,
    duration: 15,
    cooldown: 30,
    effect: 'invincible'
  },
  {
    id: 'ishigakure_necklace',
    name: 'Ishigakure Kolyesi',
    icon: '📿',
    description: '10 saniye boyunca X yeteneği cooldown süresi 0.5 saniyeye düşer!',
    price: 75,
    duration: 10,
    cooldown: 45,
    effect: 'rapidFire'
  },
  {
    id: 'ancient_elixir',
    name: 'Kadim Şurup',
    icon: '🧪',
    description: '+1 can ekler. Kalıcıdır. Maximum can sınırını aşabilir!',
    price: 50,
    duration: 0,
    cooldown: 10,
    effect: 'extraLife'
  },
  {
    id: 'rasengan',
    name: 'Rasengan',
    icon: '🌀',
    description: 'Mavi ışıklı küre fırlatırsın! Tüm rakipleri temizler, boss\'a çok hasar! Dattebayo!',
    price: 125,
    duration: 0,
    cooldown: 20,
    effect: 'rasengan'
  },
  {
    id: 'viagra',
    name: 'Viagra',
    icon: '💊',
    description: '30 saniye boyunca düşmanlar yavaşlar! Başka etkileri de var!',
    price: 100,
    duration: 30,
    cooldown: 40,
    effect: 'slowEnemies'
  },
  {
    id: 'puppet_parchment',
    name: 'Kuklacının Parşömeni',
    icon: '📜',
    description: 'Rastgele bir karakteri kölen olarak çağır! Önünde yürür ve sana kalkan olur!',
    price: 150,
    duration: 0,
    cooldown: 0,
    effect: 'summonPuppet'
  },
  {
    id: 'iori_katana',
    name: "Iori'nin Katanası",
    icon: '⚔️',
    description: '10 saniye boyunca gökten metal parçalar yağdır! Tüm düşmanlar ölür!',
    price: 100,
    duration: 10,
    cooldown: 0,
    effect: 'metalRain'
  }
];

// Eşya bilgisi al
export function getSpecialItem(id) {
  return SPECIAL_ITEMS.find(item => item.id === id) || null;
}

// Dojo item bilgisi al
export function getDojoItem(id) {
  return DOJO_ITEMS[id] || null;
}
