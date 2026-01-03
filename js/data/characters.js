// ===== CHARACTER DEFINITIONS =====
// Tüm oynanabilir karakterlerin tanımları

export const CHARACTERS = {
  haru: {
    name: 'Haru',
    color: '#e0e0e0',
    hairColor: '#fff',
    gender: 'female',
    weapon: 'spear',
    skillX: {
      name: 'Mızrak Uzat',
      icon: '🗡️',
      cooldown: 3,
      action: 'spearExtend'
    },
    skillF: {
      name: 'Ay Işığı',
      icon: '🌙',
      cooldown: 20,
      duration: 4,
      action: 'moonlight'
    }
  },
  ringo: {
    name: 'Ringo',
    color: '#42a5f5',
    hairColor: '#1e88e5',
    gender: 'male',
    weapon: 'shuriken',
    skillX: {
      name: 'Shuriken',
      icon: '⭐',
      cooldown: 2,
      action: 'shuriken'
    },
    skillF: {
      name: 'Kartal Uçuşu',
      icon: '🦅',
      cooldown: 20,
      duration: 5,
      action: 'eagleFlight'
    }
  },
  usagi: {
    name: 'Usagi',
    color: '#ffeb3b',
    hairColor: '#ffd54f',
    gender: 'female',
    weapon: 'water',
    skillX: {
      name: 'Su Topu',
      icon: '💧',
      cooldown: 3,
      action: 'waterBall'
    },
    skillF: {
      name: 'Buz Fırtınası',
      icon: '🌨️',
      cooldown: 20,
      duration: 4,
      action: 'iceStorm'
    }
  },
  chisa: {
    name: 'Chisa',
    color: '#9b59b6',
    hairColor: '#f1c40f',
    skinColor: '#9b59b6',
    gender: 'female',
    weapon: 'katana',
    isSmall: true,
    skillX: {
      name: 'Katana Darbesi',
      icon: '⚔️',
      cooldown: 1.5,
      action: 'katanaSlash'
    },
    skillF: {
      name: 'Kılıç Fırtınası',
      icon: '🌀',
      cooldown: 20,
      duration: 4,
      action: 'swordStorm'
    }
  },
  butsuo: {
    name: 'Butsuo',
    color: '#ecf0f1',
    hairColor: '#fff',
    gender: 'male',
    weapon: 'fist',
    isBig: true,
    skillX: {
      name: 'Yumruk',
      icon: '👊',
      cooldown: 1.5,
      action: 'punch'
    },
    skillF: {
      name: 'Uçan Kafa',
      icon: '💥',
      cooldown: 20,
      duration: 6,
      action: 'headbutt'
    }
  },
  teki: {
    name: 'Teki',
    color: '#27ae60',
    hairColor: '#fff',
    gender: 'male',
    weapon: 'katana',
    isThin: true,
    skillX: {
      name: 'Zehir Mermisi',
      icon: '☠️',
      cooldown: 4,
      action: 'poisonShot'
    },
    skillF: {
      name: 'Maymun Dostum',
      icon: '🐵',
      cooldown: 20,
      duration: 5,
      action: 'monkeyFriend'
    }
  },
  susumu: {
    name: 'Susumu',
    color: '#e74c3c',
    hairColor: '#ddd',
    gender: 'male',
    weapon: 'needle',
    skillX: {
      name: 'İğne Yağmuru',
      icon: '💉',
      cooldown: 3,
      action: 'needleThrow'
    },
    skillF: {
      name: 'Hayvan Dostları',
      icon: '🐾',
      cooldown: 20,
      duration: 5,
      action: 'animalFriends'
    }
  },
  shinji: {
    name: 'Shinji',
    color: '#9b59b6',
    hairColor: '#333',
    gender: 'male',
    weapon: 'illusion',
    isTall: true,
    skillX: {
      name: 'Göz Işını',
      icon: '👁️',
      cooldown: 3,
      action: 'eyeBeam'
    },
    skillF: {
      name: 'İlüzyon Fırtınası',
      icon: '🌀',
      cooldown: 20,
      duration: 4,
      action: 'illusionStorm'
    }
  },
  kazuya: {
    name: 'Kazuya',
    color: '#8e44ad',
    hairColor: '#9b59b6',
    gender: 'male',
    weapon: 'wind',
    skillX: {
      name: 'Hava Dalgası',
      icon: '💨',
      cooldown: 3,
      action: 'windWave'
    },
    skillF: {
      name: 'Rüzgar Kılıcı',
      icon: '🌪️',
      cooldown: 20,
      duration: 4,
      action: 'windSword'
    }
  },
  togami: {
    name: 'Togami',
    color: '#555',
    hairColor: '#3498db',
    gender: 'male',
    weapon: 'feather',
    skillX: {
      name: 'Karga Tüyü',
      icon: '🪶',
      cooldown: 4,
      action: 'crowFeather'
    },
    skillF: {
      name: 'Karanlık Güç',
      icon: '🦆',
      cooldown: 20,
      duration: 4,
      action: 'darkAura'
    }
  },
  kagi: {
    name: 'Kagi',
    color: '#ecf0f1',
    hairColor: '#000',
    gender: 'female',
    weapon: 'paper',
    hasLongHair: true,
    skillX: {
      name: 'Kağıt Fırlatma',
      icon: '📄',
      cooldown: 3,
      action: 'paperThrow'
    },
    skillF: {
      name: 'Kağıt Kanatlar',
      icon: '🕊️',
      cooldown: 20,
      duration: 5,
      action: 'paperWings'
    }
  },
  akemi: {
    name: 'Akemi',
    color: '#ff69b4',
    hairColor: '#f1c40f',
    gender: 'female',
    weapon: 'kiss',
    hasLongHair: true,
    skillX: {
      name: 'Öpücük',
      icon: '💋',
      cooldown: 3,
      action: 'kissThrow'
    },
    skillF: {
      name: 'Alev Ejderi',
      icon: '🐲',
      cooldown: 20,
      duration: 4,
      action: 'fireDragon'
    }
  },
  ryoken: {
    name: 'Ryoken',
    color: '#9b59b6',
    hairColor: '#f1c40f',
    gender: 'male',
    weapon: 'illusion',
    skillX: {
      name: 'İlüzyon',
      icon: '👁️',
      cooldown: 3,
      action: 'illusionKill'
    },
    skillF: {
      name: 'Mistik Şimşek',
      icon: '⚡',
      cooldown: 20,
      duration: 4,
      action: 'mysticLightning'
    }
  },
  riku: {
    name: 'Riku',
    color: '#3498db',
    hairColor: '#fff',
    gender: 'male',
    weapon: 'bow',
    isSmall: true,
    skillX: {
      name: 'Ok Atışı',
      icon: '🏹',
      cooldown: 2.5,
      action: 'arrowShot'
    },
    skillF: {
      name: 'Ok Yağmuru',
      icon: '🎯',
      cooldown: 20,
      duration: 4,
      action: 'arrowRain'
    }
  },
  joaryu: {
    name: 'Joaryu',
    color: '#8e44ad',
    hairColor: '#9b59b6',
    gender: 'male',
    weapon: 'kunai',
    isTall: true,
    skillX: {
      name: 'Kunai',
      icon: '🗡️',
      cooldown: 2,
      action: 'kunaiThrow'
    },
    skillF: {
      name: 'Gölge Klon',
      icon: '👥',
      cooldown: 20,
      duration: 4,
      action: 'shadowClone'
    }
  }
};

// Karakter listesini al
export function getCharacterList() {
  return Object.keys(CHARACTERS);
}

// Karakter bilgisi al
export function getCharacter(id) {
  return CHARACTERS[id] || null;
}
