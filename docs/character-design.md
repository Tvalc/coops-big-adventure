# Character Design Document

## Description
Character profiles, abilities, and backstories

## Content
CHARACTER DESIGN DOCUMENT  
Game: **Coop: Defender of the Frozen Realm**  
Platform: Snib AI Game Platform (Web, HTML5/JavaScript)  
Version: 1.0  
Date: 2024-06-11

---

# 1. INTRODUCTION

This document defines the core character designs for "Coop: Defender of the Frozen Realm." It focuses on main character Coop, his companions, and the enemy "Fud Monsters." It outlines visual design, stats, skills, progression, personality, gameplay role, and story function, ensuring all aspects are compatible with the Snib technical and asset constraints and the adventure RPG systems already present in the project.

---

# 2. MAIN CHARACTER: COOP

## 2.1 OVERVIEW

- **Name:** Coop  
- **Role:** Player Character, Defender of the Frozen Realm  
- **Visual Theme:** Heroic, whimsical penguin in winter gear  
- **Personality:** Brave, witty, determined, a bit clumsy  
- **Narrative Function:** Central protagonist, catalyst for story advancement, party leader

## 2.2 VISUAL DESIGN

- **Format:** Sprite sheet (PNG/WebP, <512x512px), 8-directional, 6 frames per direction  
- **Palette:** Cool tones (blues, whites, teals), accented with orange/yellow  
- **Key Features:**  
  - Stocky penguin, round body  
  - Blue winter cloak, snow goggles, satchel  
  - Expressive face: big eyes, beak visible  
  - Weapon: Magic staff with glowing tip (ice crystal)

- **Animation Examples:**  
  - Idle (soft breathing, blinking)  
  - Run (waddling with cloak flutter)  
  - Attack (staff swing, frost effect)  
  - Hurt (flinch, stars)  
  - Victory (joyful jump)

## 2.3 STATS

| Stat            | Base Value | Progression Mechanic         |
|-----------------|------------|-----------------------------|
| Health (HP)     | 100        | +10 per level               |
| Energy (MP)     | 50         | +5 per level                |
| Attack          | 10         | +2 per level/upgrade        |
| Defense         | 8          | +1 per level/upgrade        |
| Speed           | 4          | +0.1 per level/upgrade      |
| Luck            | 3          | +0.5 per level              |

- **Stat Growth:** On level up, player chooses +1 to Attack/Defense/Speed, other stats auto-increase.

## 2.4 ABILITIES

- **Frost Bolt (Basic Attack):**  
  - Fires a short-range ice projectile  
  - Deals Attack damage with 10% chance to freeze (immobilize) for 1s  
  - Tap/Click or Keyboard (Space/Enter) to use

- **Snow Shield (Skill, Unlocks at Level 3):**  
  - Temporary shield absorbs damage for 3s  
  - Cooldown: 10s  
  - Visual: Glowing blue bubble

- **Penguin Slide (Skill, Unlocks at Level 5):**  
  - Dash quickly in facing direction, passing through enemies, dealing minor damage  
  - Cooldown: 7s  
  - Visual: Motion blur, ice trail

- **Ultimate: Blizzard Burst (Unlocks at Level 10):**  
  - Area-of-effect attack, heavy damage, freezes all nearby enemies  
  - Consumes full energy bar  
  - Triggered by double-tap or special button

- **Passive: Cold Resistance**  
  - Reduced damage from ice-based enemies and hazards

## 2.5 PROGRESSION

- **Experience (XP):** Gained from defeating enemies, solving puzzles, completing quests  
- **Level Up:** Increases stats, unlocks new skills  
- **Skill Tree:** Branches for Offense (damage, crit chance), Defense (block, regen), Utility (speed, luck)  
- **Inventory:** Collect/upgrade items (e.g., Frost Amulet, Boots of Speed) via the inventory system  
- **Equipment:** Equippable items alter appearance and stats (cloak colors, staff types)

## 2.6 INTERACTION & INPUT

- **Movement:**  
  - Keyboard: WASD/Arrow keys  
  - Mouse: Click-to-move  
  - Touch: Virtual joystick or tap-to-move

- **Actions:**  
  - Attack: Space/Mouse Tap/Touch Button  
  - Use Skill: Number keys/UI buttons/touch icons  
  - Inventory: Accessible via on-screen button or "I" key

---

# 3. COMPANION CHARACTERS (BAND OF MISFITS)

## 3.1 GENERAL DESIGN PRINCIPLES

- **Recruitment:** Join Coop during scripted events or after side quests  
- **Role:** Each has a unique skill, enhances combat/puzzle solving, can be controlled by player or AI

### Companion 1: Glimmer the Arctic Fox

- **Visual:** Sleek white fox with blue scarf, bushy tail  
- **Personality:** Sly, clever, loves shiny objects  
- **Ability:**  
  - **Quick Dash:** Can cross traps quickly, trigger levers  
  - **Passive:** Finds hidden loot (increases inventory finds)

### Companion 2: Barkley the Yeti Pup

- **Visual:** Small, fluffy yeti with oversized mittens  
- **Personality:** Loyal, easily startled, loves to eat  
- **Ability:**  
  - **Boulder Toss:** Throws rocks to break obstacles or hit distant enemies  
  - **Passive:** Can carry extra items (expands inventory size)

### Companion 3: Tink the Clockwork Puffin

- **Visual:** Mechanical puffin with brass wings and gears  
- **Personality:** Inquisitive, logical, speaks in beeps  
- **Ability:**  
  - **Gadget Deploy:** Places temporary turrets or gadgets for puzzles  
  - **Passive:** Reduces cooldowns for Coop's skills

## 3.2 COMPANION SYSTEM

- **Switching:**  
  - Player can swap active companion via UI/buttons  
  - Non-selected companions follow and act via simple AI

- **Progression:**  
  - Each companion levels up with Coop  
  - New abilities unlock at certain Coop levels  
  - Can equip certain items for stat boosts

- **Input:**  
  - Touch/mouse tap to activate companion skill  
  - Keyboard shortcut (e.g., 1/2/3) to switch  
  - Companions auto-use passive skills

---

# 4. ENEMY DESIGN: FUD MONSTERS

## 4.1 OVERVIEW

- **Role:** Antagonists, obstacles, and XP sources  
- **Visual Theme:** Amorphous, gooey creatures, each themed after a negative emotion (Fear, Uncertainty, Doubt = FUD)

## 4.2 TYPES & EXAMPLES

- **Fear Blob:**  
  - Color: Deep violet, trembling animation  
  - Attack: Lunges at player, causes slow  
  - Weakness: Light-based attacks

- **Uncertainty Slime:**  
  - Color: Shifting blue-green  
  - Attack: Splits into two smaller slimes when hit  
  - Weakness: Area attacks

- **Doubt Golem:**  
  - Color: Gray with swirling mist  
  - Attack: Heavy stomp, causes confusion (reverse controls)  
  - Weakness: Stunned by gadgets

## 4.3 STATS (BY STAGE)

| Enemy         | HP   | Attack | Speed | Reward (XP) |
|---------------|------|--------|-------|-------------|
| Fear Blob     | 30   | 8      | 3     | 10          |
| Uncertainty   | 20   | 5      | 2     | 8           |
| Doubt Golem   | 50   | 12     | 1     | 20          |

## 4.4 BEHAVIOR

- Simple AI: Patrol, chase player, use unique attack  
- Visual feedback: Flash when hit, dissolve on defeat  
- Animations: Squash/stretch, particle effects

---

# 5. STORY & PERSONALITY

## 5.1 CHARACTER ARC (Coop)

- **Beginning:** Reluctant hero, outcast from his village  
- **Middle:** Grows in confidence, bonds with companions, uncovers FUD plot  
- **End:** Becomes true defender, unites the realm, defeats the FUD Queen

## 5.2 COMPANIONS

- Each has personal side quest  
- Participate in banter during exploration  
- Provide comic relief and hints

---

# 6. IMPLEMENTATION NOTES

- **Sprite Sheets:**  
  - PNG/WebP, 8-directional, max 2MB per character, <512x512px  
  - Use CSS3 for UI overlays (health bars, skill icons)
- **Sound FX:**  
  - MP3/OGG, <10s per character (jump, attack, hurt, victory)
- **Touch/Mobile:**  
  - Large tappable UI for skill/item use  
  - Swipe gestures for dashing/skills (optional)
- **Performance:**  
  - Limit simultaneous on-screen characters to <8  
  - Optimize sprites for WebGL/Canvas 2D
- **Accessibility:**  
  - High-contrast visual options  
  - Keyboard navigation for all menus

---

# 7. CONSISTENCY CHECKS

- Referenced mechanics: **run, collect, enemies, enemy, health, inventory, quest, upgrade**  
- This document defines player/companion/enemy characters, their stats, skills, and progression.  
- "Collect" mechanic is supported via loot, upgrades, and inventory; all referenced systems are included.  
- No conflicts detected with existing level_design or game_design_document.

---

# 8. ASSET SUMMARY (FOR ART & AUDIO TEAM)

| Asset                     | Format | Max Size | Description                                      |
|---------------------------|--------|----------|--------------------------------------------------|
| Coop Sprite Sheet         | PNG    | 2MB      | 8-dir, 6 frames per dir, includes skills         |
| Glimmer Sprite Sheet      | PNG    | 1.5MB    | 8-dir, 4 frames per dir, dash animation          |
| Barkley Sprite Sheet      | PNG    | 1.5MB    | 8-dir, 4 frames per dir, toss animation          |
| Tink Sprite Sheet         | PNG    | 1.5MB    | 8-dir, 4 frames per dir, gadget animation        |
| Enemy Sprite Sheets (x3)  | PNG    | 1MB ea   | 4-dir, 3 frames per dir, unique effects          |
| Skill/Item Icons          | SVG/PNG| 256KB    | 32x32px, 48x48px                                 |
| SFX Per Character         | MP3/OGG| 100KB ea | Jump, attack, hurt, victory                      |

---

# 9. REVISION LOG

- **v1.0 (2024-06-11):** Initial character design document created for implementation.

---

**End of Document**


---
*Generated on 7/28/2025*
