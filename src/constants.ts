export const CHARACTERS = [
  {
    id: 'gojo',
    name: 'Infinity Sorcerer',
    color: '#3b82f6', // blue
    description: 'Master of space and infinity.',
    stats: { hp: 100, speed: 5, damage: 15 },
    abilities: [
      { name: 'Energy Blast', cooldown: 3, type: 'projectile', color: '#60a5fa' },
      { name: 'Infinity Shield', cooldown: 10, type: 'shield', duration: 5 },
      { name: 'Hollow Purple', cooldown: 20, type: 'ultimate', damage: 100 },
    ]
  },
  {
    id: 'sukuna',
    name: 'Demon King',
    color: '#ef4444', // red
    description: 'Ruthless slashes and dark energy.',
    stats: { hp: 120, speed: 6, damage: 20 },
    abilities: [
      { name: 'Dismantle', cooldown: 2, type: 'melee_aoe', color: '#fca5a5' },
      { name: 'Cleave', cooldown: 8, type: 'dash_attack', damage: 40 },
      { name: 'Malevolent Shrine', cooldown: 30, type: 'ultimate', damage: 150 },
    ]
  },
  {
    id: 'madara',
    name: 'Ghost Warrior',
    color: '#f97316', // orange
    description: 'Fire techniques and spirit summons.',
    stats: { hp: 150, speed: 4, damage: 25 },
    abilities: [
      { name: 'Fireball', cooldown: 4, type: 'projectile', color: '#fdba74' },
      { name: 'Susanoo', cooldown: 15, type: 'buff', duration: 8 },
      { name: 'Meteor Strike', cooldown: 35, type: 'ultimate', damage: 200 },
    ]
  },
  {
    id: 'itachi',
    name: 'Shadow Ninja',
    color: '#a855f7', // purple
    description: 'Illusions and fast teleports.',
    stats: { hp: 90, speed: 7, damage: 18 },
    abilities: [
      { name: 'Crow Clone', cooldown: 6, type: 'decoy', duration: 4 },
      { name: 'Amaterasu', cooldown: 12, type: 'dot', damage: 50 },
      { name: 'Tsukuyomi', cooldown: 25, type: 'ultimate', damage: 120 },
    ]
  },
  {
    id: 'lightning',
    name: 'Lightning Assassin',
    color: '#eab308', // yellow
    description: 'Super speed and electric attacks.',
    stats: { hp: 80, speed: 9, damage: 12 },
    abilities: [
      { name: 'Thunder Dash', cooldown: 3, type: 'dash', damage: 20 },
      { name: 'Chain Lightning', cooldown: 8, type: 'chain', damage: 30 },
      { name: 'Kirin', cooldown: 20, type: 'ultimate', damage: 140 },
    ]
  }
];
