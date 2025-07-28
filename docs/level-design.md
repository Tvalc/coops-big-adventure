# Level Design Document

## Description
Individual level layouts, progression, and mechanics

## Content
LEVEL DESIGN DOCUMENT  
Game: **Coop: Defender of the Frozen Realm**  
Platform: Snib AI Game Platform (Web, HTML5/JavaScript)  
Version: 1.0  
Date: 2024-06-11

---

## 1. LEVEL STRUCTURE OVERVIEW

"Coop: Defender of the Frozen Realm" is a top-down adventure RPG featuring multiple stages ("zones") filled with enemies ("fud monsters"), environmental puzzles, and narrative events. Players control **Coop**, progressing through a series of interconnected levels while recruiting allies, gaining experience, unlocking items, and advancing the story.

### Zones & Levels

- **Zone 1: The Frosted Outskirts**
- **Zone 2: The Glimmering Forest**
- **Zone 3: The Shattered Lake**
- **Zone 4: The Ancient Citadel**
- **Zone 5: The Heart of Winter (Finale)**

Each zone contains 3-5 individual levels, culminating in a unique boss or story event.

---

## 2. GENERAL LEVEL LAYOUT PRINCIPLES

- **Top-Down Perspective**: All levels are designed for clear, top-down navigation.
- **Grid-Based Layout**: Tiles are used for both collision and visual consistency.
- **Responsive Design**: Levels must scale and adapt for both desktop and mobile screens (touch/mouse).
- **Fast Loading**: Each level uses a compact set of tiled assets, with streaming for boss encounters or large setpieces.
- **Interactive Elements**: Switches, levers, pushable blocks, destructible objects, chests, and environmental lore nodes.

---

## 3. LEVEL PROGRESSION & DIFFICULTY CURVE

### Pacing
- **Early Levels**: Simple layouts, minimal enemies, basic environmental puzzles. Introduce mechanics (run, inventory, health, quest).
- **Mid Game**: Increased enemy density, puzzle complexity, multi-step objectives, more frequent use of run/upgrade/inventory mechanics.
- **Late Game**: Complex, multi-room levels, environmental storytelling, mixed enemy types, advanced skills/items required.

### Difficulty
- **Zone 1**: Tutorialization, forgiving enemy patterns, clear guidance.
- **Zone 2-3**: Gradual increase in enemy variety and puzzle integration. Introduce environmental hazards.
- **Zone 4-5**: Require tactical use of abilities, allies, and inventory management. Bosses have unique patterns requiring learned skills.

---

## 4. LEVEL FLOW & PLAYER GUIDANCE

- **Visual Landmarks**: Use color, lighting, and unique assets for orientation.
- **Breadcrumbing**: Place interactive objects (e.g., glowing mushrooms, ice torches) to suggest key paths.
- **Narrative Pop-ups**: Short dialogue or hint overlays on first encounter with new mechanics or puzzles.
- **Quest System Integration**: On-level quest markers, minimap hints, and inventory updates.

---

## 5. ENVIRONMENTAL STORYTELLING

Each level contains environmental cues:
- **Frozen Statues**: hint at previous defenders.
- **Ruined Camps**: journals or notes for lore.
- **Fud Residue**: visual storytelling around recent battles.
- **Dynamic Weather**: Progression from gentle snow to blizzards as narrative tension rises.

---

## 6. ZONE & LEVEL EXAMPLES

### Zone 1: The Frosted Outskirts

#### Level 1-1: "The Awakening"
- **Objective**: Reach the village gate, defeat basic fud monsters.
- **Layout**: Linear, short, clear path. Minimal branching.
- **Tutorials**: Movement, run mechanic, basic attack, health system.
- **Guidance**: Footprints in snow, glowing lamp posts.
- **Interactive**: Health pickup, first inventory item (healing berry).
- **Enemy Types**: Fudling (slow, low damage).

#### Level 1-2: "Frozen Paths"
- **Objective**: Find and activate 2 ice switches to open the gate.
- **Layout**: Two branching paths, converging at the gate.
- **Puzzles**: Push block onto pressure plate, timed lever.
- **Guidance**: Icicle drops to indicate hazards, visual cues for switches.
- **Upgrade**: First skill point awarded at completion.

#### Level 1-3: "Village Under Siege"
- **Objective**: Defend the village with the help of recruited misfit (Sparks the Pyrofox).
- **Layout**: Central area with enemy waves.
- **Coop Mechanic**: Recruit Sparks (ally joins, unlocks fire-based attacks).
- **Guidance**: Arrows marking enemy entry points.
- **Inventory**: Item chest (unlock with key dropped by elite fud monster).

### Zone 2 Example: The Glimmering Forest

#### Level 2-2: "Puzzle of the Lightroots"
- **Objective**: Solve light reflection puzzles to clear paths.
- **Layout**: Open area with segmented sections.
- **Puzzle**: Rotate mirrors to direct beams and open magical barriers.
- **Guidance**: Rune hints on stones, glimmering particle trails.
- **Enemy**: Camouflaged Fud Sprites (ambush when puzzle is solved).
- **Quest Integration**: "Restore the Light" quest updates.

---

## 7. INTERACTIVE ELEMENTS & PERFORMANCE CONSIDERATIONS

- **Asset Count**: Limit to 10-15 unique tile sprites per level; reuse and recolor for variety.
- **Streaming**: Boss arenas and large setpieces load additional assets after a short in-game cutscene.
- **UI**: Large, touch-friendly buttons for inventory and skill use; hover/click support for desktop.
- **Cutscenes**: Short, skippable, using in-game sprites and dialogue pop-ups.

---

## 8. BOSS/SETPIECE LEVELS

- **Unique Layouts**: Circular or multi-phase arenas.
- **Environmental Hazards**: Falling icicles, shifting ice, destructible cover.
- **Narrative Integration**: Bosses taunt Coop, hint at greater threats.
- **Rewards**: Significant quest advancement, new ally joins, major inventory unlocks.

---

## 9. LEVEL COMPLETION & REWARD STRUCTURE

- **End-of-Level Summary**: XP gained, items found, misfits recruited, quest progress.
- **Unlocks**: New skills, upgrades, inventory slots, and fast-travel points.
- **Replayability**: Optional side objectives in each level (hidden chests, lore collectibles).

---

## 10. TECHNICAL REQUIREMENTS

- **Level Data**: JSON format for fast loading and asset referencing.
- **Tilemaps**: 32x32px or 48x48px tiles, optimized for browser rendering.
- **Screen Adaptation**: Auto-zoom and pan for small screens; fixed HUD for all orientations.
- **Touch Optimization**: Interactive elements ≥48px for easy touch.

---

## 11. CONSISTENCY CHECK

- **Mechanics Used**: All referenced mechanics (run, enemy, health, inventory, quest, upgrade) are integrated as core progression elements and tutorialized early.
- **Characters**: Coop and recruited misfits appear as playable/allied units with unique skills.
- **No Conflicts**: All elements align with the vision and mechanics outlined in the existing game design document.

---

## 12. IMPLEMENTATION NOTES

- Begin with Zone 1, implement core mechanics and test on multiple devices.
- Use modular level chunks for rapid design and loading.
- Prioritize minimal asset sets per level; test streaming for larger encounters.
- Schedule regular playtests to adjust difficulty pacing and puzzle clarity.

---

**Appendix: Sample Level Layout Sketch**  
_(Not to scale, for implementation reference)_

```
[Spawn] ---[Bridge]---[Gate]
      |             |
   [Chest]     [Ice Switch]
```

---

**End of Level Design Document**


---
*Generated on 7/28/2025*
