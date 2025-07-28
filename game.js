// Coop: Defender of the Frozen Realm - Vanilla JS/Canvas + React UI Shell (no external assets)

// Polyfill for requestAnimationFrame for older browsers
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

// --- GAME INITIALIZATION ---
window.addEventListener('DOMContentLoaded', initGame);

// --- UTILITY FUNCTIONS ---
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function lerp(a, b, t) { return a + (b - a) * t; }

// --- INITIAL LEVEL DATA (can be expanded with JSON) ---
window.GAME_LEVELS = {
    tutorial: {
        name: "The Awakening",
        objectives: [
            "Use the controls to move Coop.",
            "Cast Frost Bolt at a Fud Monster.",
            "Collect the Healing Berry.",
            "Defeat all Fud Monsters to awaken!"
        ],
        enemies: [
            { type: "FearBlob", x: 320, y: 180 },
            { type: "UncertaintySlime", x: 150, y: 80 },
            { type: "DoubtGolem", x: 420, y: 90 }
        ],
        items: [
            { type: "HealingBerry", x: 400, y: 240 }
        ]
    }
};

// --- PLAYER CLASS ---
window.Player = class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 18;
        this.speed = 2.5;
        this.dirX = 0;
        this.dirY = 0;
        this.stats = {
            level: 1,
            health: 100,
            maxHealth: 100,
            energy: 50,
            maxEnergy: 50,
            attack: 10,
            defense: 3,
            speed: 2.5,
            luck: 2
        };
        this.isAlive = true;
        this.invulnTimer = 0;
        this.facing = 0; // angle radians
    }

    move(dx, dy) {
        this.dirX = dx;
        this.dirY = dy;
    }

    update(level, input) {
        // Movement
        let moveX = this.dirX * this.stats.speed;
        let moveY = this.dirY * this.stats.speed;
        this.x = clamp(this.x + moveX, this.radius, 480 - this.radius);
        this.y = clamp(this.y + moveY, this.radius, 320 - this.radius);

        // Facing (if firing or moving)
        if (input.mouse.active) {
            let mx = input.mouse.x, my = input.mouse.y;
            this.facing = Math.atan2(my - this.y, mx - this.x);
        } else if (moveX !== 0 || moveY !== 0) {
            this.facing = Math.atan2(moveY, moveX);
        }

        // Invulnerability timer after hit
        if (this.invulnTimer > 0) this.invulnTimer -= 1;

        // Clamp health and energy
        this.stats.health = clamp(this.stats.health, 0, this.stats.maxHealth);
        this.stats.energy = clamp(this.stats.energy, 0, this.stats.maxEnergy);
        this.isAlive = this.stats.health > 0;
    }

    takeDamage(amount) {
        if (this.invulnTimer > 0) return false;
        const dmg = clamp(amount - this.stats.defense, 1, 999);
        this.stats.health -= dmg;
        this.invulnTimer = 40; // 40 frames of invuln
        return true;
    }

    heal(amount) {
        this.stats.health = clamp(this.stats.health + amount, 0, this.stats.maxHealth);
    }

    levelUp() {
        this.stats.level += 1;
        this.stats.maxHealth += 20;
        this.stats.maxEnergy += 10;
        this.stats.attack += 2;
        this.stats.defense += 1;
        this.stats.speed += 0.2;
        this.stats.luck += 1;
        this.stats.health = this.stats.maxHealth;
        this.stats.energy = this.stats.maxEnergy;
    }

    render(ctx) {
        // Glowing effect when invulnerable
        if (this.invulnTimer > 0) {
            ctx.save();
            ctx.globalAlpha = 0.7 + 0.3 * Math.sin(this.invulnTimer/2);
            ctx.shadowColor = "#c2f7ff";
            ctx.shadowBlur = 18;
        }

        // Main body (gradient ice blue)
        let grad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, this.radius);
        grad.addColorStop(0, "#e3f6ff");
        grad.addColorStop(0.6, "#7fdcff");
        grad.addColorStop(1, "#238ec9");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();

        // Face
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.facing);
        ctx.beginPath(); // Eyes
        ctx.arc(7, -7, 3, 0, 2 * Math.PI);
        ctx.arc(7, 7, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#11384c";
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        // Smile
        ctx.beginPath();
        ctx.arc(9, 0, 5, Math.PI * 0.15, Math.PI * 0.85, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#2176a0";
        ctx.stroke();
        ctx.restore();

        // Outline
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = "#e8f9ff";
        ctx.stroke();

        if (this.invulnTimer > 0) ctx.restore();
    }
};

// --- ENEMY CLASSES ---
window.EnemyTypes = {
    FearBlob: {
        radius: 16,
        color: "#d45e5e",
        maxHealth: 32,
        speed: 1.0,
        attack: 7,
        defense: 1,
        ai: function(self, player) {
            // Chases player; stops if close
            let dx = player.x - self.x, dy = player.y - self.y;
            let dist = Math.hypot(dx, dy);
            if (dist > 28) {
                let nx = dx / dist, ny = dy / dist;
                self.vx = nx * self.speed;
                self.vy = ny * self.speed;
            } else {
                self.vx = 0; self.vy = 0;
            }
        }
    },
    UncertaintySlime: {
        radius: 13,
        color: "#a1b958",
        maxHealth: 22,
        speed: 1.6,
        attack: 5,
        defense: 0,
        ai: function(self, player) {
            // Randomly jitters toward player
            if (Math.random() < 0.04) {
                let dx = player.x - self.x, dy = player.y - self.y;
                let dist = Math.hypot(dx, dy) + 0.1;
                let nx = dx / dist, ny = dy / dist;
                let angle = Math.atan2(ny, nx) + (Math.random()-0.5)*0.7;
                self.vx = Math.cos(angle) * self.speed;
                self.vy = Math.sin(angle) * self.speed;
            }
        }
    },
    DoubtGolem: {
        radius: 20,
        color: "#7e8fa0",
        maxHealth: 44,
        speed: 0.7,
        attack: 11,
        defense: 3,
        ai: function(self, player) {
            // Slowly approaches then pauses
            let dx = player.x - self.x, dy = player.y - self.y;
            let dist = Math.hypot(dx, dy);
            if (dist > 50) {
                let nx = dx / dist, ny = dy / dist;
                self.vx = nx * self.speed;
                self.vy = ny * self.speed;
            } else {
                self.vx = 0; self.vy = 0;
            }
        }
    }
};

window.Enemy = class Enemy {
    constructor(type, x, y) {
        const t = window.EnemyTypes[type] || window.EnemyTypes.FearBlob;
        this.type = type;
        this.x = x;
        this.y = y;
        this.radius = t.radius;
        this.color = t.color;
        this.maxHealth = t.maxHealth;
        this.health = t.maxHealth;
        this.speed = t.speed;
        this.attack = t.attack;
        this.defense = t.defense;
        this.ai = t.ai;
        this.vx = 0; this.vy = 0;
        this.isAlive = true;
        this.freezeTimer = 0;
        this.dmgTimer = 0;
    }

    update(player) {
        if (!this.isAlive) return;
        if (this.freezeTimer > 0) {
            this.freezeTimer -= 1;
            this.vx = 0; this.vy = 0;
        } else {
            this.ai(this, player);
        }
        this.x += this.vx;
        this.y += this.vy;
        // Clamp to bounds
        this.x = clamp(this.x, this.radius, 480 - this.radius);
        this.y = clamp(this.y, this.radius, 320 - this.radius);

        if (this.dmgTimer > 0) this.dmgTimer -= 1;
        if (this.health <= 0) this.isAlive = false;
    }

    takeDamage(amount, freezeChance) {
        const dmg = clamp(amount - this.defense, 1, 999);
        this.health -= dmg;
        this.dmgTimer = 18;
        // Freeze effect
        if (freezeChance && Math.random() < freezeChance) {
            this.freezeTimer = 38;
        }
    }

    render(ctx) {
        if (!this.isAlive) return;
        ctx.save();
        // Damage flash
        if (this.dmgTimer > 0)
            ctx.globalAlpha = 0.5 + 0.5 * Math.sin(this.dmgTimer/2);
        // Freeze tint
        if (this.freezeTimer > 0) {
            ctx.shadowColor = "#aef6ff";
            ctx.shadowBlur = 12;
        }
        // Main body (gradient)
        let grad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, this.radius);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(0.7, this.color);
        grad.addColorStop(1, "#2e3d4c");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();
        // Outline
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = "#eff6fd";
        ctx.stroke();
        ctx.restore();

        // Health bar
        let pct = this.health / this.maxHealth;
        if (pct < 1) {
            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.fillRect(this.x - this.radius, this.y - this.radius - 14, this.radius*2, 7);
            ctx.fillStyle = "#ff7181";
            ctx.fillRect(this.x - this.radius, this.y - this.radius - 14, this.radius*2*pct, 7);
            ctx.restore();
        }
    }
};

// --- FROST BOLT (PROJECTILE) ---
window.FrostBolt = class FrostBolt {
    constructor(x, y, angle, power) {
        this.x = x;
        this.y = y;
        this.radius = 7;
        this.speed = 6.5;
        this.angle = angle;
        this.power = power;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.lifetime = 50;
        this.active = true;
        this.freezeChance = 0.33; // 33% freeze
    }

    update() {
        if (!this.active) return;
        this.x += this.vx;
        this.y += this.vy;
        this.lifetime--;
        if (this.x < -10 || this.x > 490 || this.y < -10 || this.y > 330) this.active = false;
        if (this.lifetime <= 0) this.active = false;
    }

    render(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.globalAlpha = 0.93;
        ctx.shadowColor = "#c3f3ff";
        ctx.shadowBlur = 14;
        let grad = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.radius);
        grad.addColorStop(0, "#e0f9ff");
        grad.addColorStop(0.7, "#6ddcff");
        grad.addColorStop(1, "#1895cb");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }
};

// --- ITEM CLASSES ---
window.ItemTypes = {
    HealingBerry: {
        color: "#d6f2a6",
        radius: 10,
        effect: function(player) { player.heal(30); },
        label: "Healing Berry"
    }
};

window.Item = class Item {
    constructor(type, x, y) {
        const t = window.ItemTypes[type];
        this.type = type;
        this.x = x;
        this.y = y;
        this.radius = t.radius;
        this.color = t.color;
        this.pickedUp = false;
        this.label = t.label;
    }

    render(ctx) {
        if (this.pickedUp) return;
        ctx.save();
        ctx.shadowColor = "#eafdcc";
        ctx.shadowBlur = 8;
        // Berry shape
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#bde991";
        ctx.fill();

        // Little stem
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.radius);
        ctx.lineTo(this.x, this.y - this.radius - 7);
        ctx.strokeStyle = "#627e36";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
};

// --- INPUT HANDLING SYSTEM ---
window.InputController = class InputController {
    constructor(canvas) {
        this.keys = {};
        this.mouse = { x: 0, y: 0, active: false };
        this.touch = { dx: 0, dy: 0, active: false };
        this.attackPressed = false;
        this.canvas = canvas;

        // Keyboard
        window.addEventListener('keydown', e => this.onKeyDown(e));
        window.addEventListener('keyup', e => this.onKeyUp(e));
        // Mouse
        canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        canvas.addEventListener('mouseup', e => this.onMouseUp(e));
        canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        // Touch
        this.initTouchControls();
    }
    onKeyDown(e) {
        this.keys[e.code] = true;
        if (e.code === "Space" || e.code === "KeyZ") this.attackPressed = true;
    }
    onKeyUp(e) {
        this.keys[e.code] = false;
        if (e.code === "Space" || e.code === "KeyZ") this.attackPressed = false;
    }
    onMouseDown(e) {
        this.mouse.active = true;
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        // Left click = attack
        if (e.button === 0) this.attackPressed = true;
    }
    onMouseUp(e) {
        this.mouse.active = false;
        this.attackPressed = false;
    }
    onMouseMove(e) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
    }
    // Touch joystick and attack button
    initTouchControls() {
        const container = document.getElementById('touch-controls');
        // Joystick base
        let base = document.createElement('div');
        base.className = "touch-joystick";
        let baseCircle = document.createElement('div');
        baseCircle.className = "touch-joystick-base";
        let thumb = document.createElement('div');
        thumb.className = "touch-joystick-thumb";
        base.appendChild(baseCircle);
        base.appendChild(thumb);
        container.appendChild(base);

        // Attack button
        let atkBtn = document.createElement('div');
        atkBtn.className = "touch-attack-btn";
        atkBtn.innerHTML = "❄️";
        container.appendChild(atkBtn);

        // Joystick logic
        let dragging = false, startX = 0, startY = 0;
        base.addEventListener('touchstart', e => {
            e.preventDefault();
            dragging = true;
            let touch = e.touches[0];
            let rect = base.getBoundingClientRect();
            startX = touch.clientX - rect.left;
            startY = touch.clientY - rect.top;
            this.touch.active = true;
        }, { passive: false });
        base.addEventListener('touchmove', e => {
            if (!dragging) return;
            let touch = e.touches[0];
            let rect = base.getBoundingClientRect();
            let dx = touch.clientX - rect.left - 40;
            let dy = touch.clientY - rect.top - 40;
            let dist = Math.min(Math.hypot(dx, dy), 32);
            let angle = Math.atan2(dy, dx);
            // Thumb visual
            thumb.style.left = (22 + Math.cos(angle)*dist) + "px";
            thumb.style.top = (22 + Math.sin(angle)*dist) + "px";
            // Normalized movement
            this.touch.dx = Math.cos(angle) * (dist/32);
            this.touch.dy = Math.sin(angle) * (dist/32);
            this.touch.active = true;
        }, { passive: false });
        base.addEventListener('touchend', e => {
            dragging = false;
            this.touch.dx = 0;
            this.touch.dy = 0;
            this.touch.active = false;
            thumb.style.left = "22px";
            thumb.style.top = "22px";
        });

        // Attack button logic
        atkBtn.addEventListener('touchstart', e => {
            e.preventDefault();
            this.attackPressed = true;
        }, { passive: false });
        atkBtn.addEventListener('touchend', e => {
            this.attackPressed = false;
        });
    }
    // Returns normalized movement vector
    getMoveVector() {
        // Keyboard
        let dx = 0, dy = 0;
        if (this.keys["ArrowUp"] || this.keys["KeyW"]) dy -= 1;
        if (this.keys["ArrowDown"] || this.keys["KeyS"]) dy += 1;
        if (this.keys["ArrowLeft"] || this.keys["KeyA"]) dx -= 1;
        if (this.keys["ArrowRight"] || this.keys["KeyD"]) dx += 1;
        // Touch
        if (this.touch.active) {
            dx += this.touch.dx;
            dy += this.touch.dy;
        }
        // Normalize
        let len = Math.hypot(dx, dy);
        return len > 0 ? { x: dx/len, y: dy/len } : { x: 0, y: 0 };
    }
};

// --- INVENTORY SYSTEM ---
window.Inventory = class Inventory {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    use(type, player) {
        let idx = this.items.findIndex(i => i.type === type && !i.used);
        if (idx >= 0) {
            let item = this.items[idx];
            window.ItemTypes[type].effect(player);
            item.used = true;
            return true;
        }
        return false;
    }
    getUsable() {
        return this.items.filter(i => !i.used);
    }
};

// --- GAME MANAGER ---
window.GameManager = class GameManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.level = JSON.parse(JSON.stringify(window.GAME_LEVELS.tutorial)); // Deep copy
        this.player = new window.Player(80, 160);
        this.input = new window.InputController(canvas);
        this.enemies = [];
        this.projectiles = [];
        this.items = [];
        this.inventory = new window.Inventory();
        this.objectives = this.level.objectives.slice();
        this.currentObjective = 0;
        this.levelComplete = false;
        this.showInventory = false;
        this.frameCount = 0;

        // Build enemies and items from level data
        for (let enemy of this.level.enemies) {
            this.enemies.push(new window.Enemy(enemy.type, enemy.x, enemy.y));
        }
        for (let item of this.level.items) {
            this.items.push(new window.Item(item.type, item.x, item.y));
        }

        // For UI React
        this.boundHudUpdate = () => this.updateHUD();
        this.lastHudState = {};
        this.render(); // Initial render
    }
    // --- MAIN GAME LOOP ---
    render() {
        this.frameCount++;
        // Update
        this.update();

        // Draw
        this.draw();

        // UI HUD update
        if (this.frameCount % 2 === 0) this.updateHUD();

        // Continue loop
        window.requestAnimFrame(() => this.render());
    }
    // --- GAME LOGIC UPDATE ---
    update() {
        if (!this.player.isAlive) return;
        // Movement
        let mv = this.input.getMoveVector();
        this.player.move(mv.x, mv.y);

        // Update player
        this.player.update(this.level, this.input);

        // Fire attack if pressed & enough energy
        if (this.input.attackPressed && this.player.stats.energy >= 10) {
            this.shootFrostBolt();
            this.input.attackPressed = false; // Prevent auto-fire
        }

        // Update projectiles
        for (let bolt of this.projectiles) bolt.update();
        this.projectiles = this.projectiles.filter(b => b.active);

        // Update enemies
        for (let enemy of this.enemies) {
            enemy.update(this.player);
            // Enemy collision with player
            if (enemy.isAlive && this.player.isAlive && this.collides(this.player, enemy)) {
                if (this.player.takeDamage(enemy.attack)) {
                    // Feedback shake, flash, etc.
                }
            }
        }
        // Remove defeated
        this.enemies = this.enemies.filter(e => e.isAlive);

        // Check projectiles hit enemies
        for (let bolt of this.projectiles) {
            if (!bolt.active) continue;
            for (let enemy of this.enemies) {
                if (!enemy.isAlive) continue;
                if (this.collides(bolt, enemy)) {
                    enemy.takeDamage(this.player.stats.attack, bolt.freezeChance);
                    bolt.active = false;
                    break;
                }
            }
        }
        // Collect items
        for (let item of this.items) {
            if (!item.pickedUp && this.collides(this.player, item)) {
                item.pickedUp = true;
                this.inventory.add(item);
            }
        }
        // Remove picked up
        this.items = this.items.filter(i => !i.pickedUp);

        // Check objectives
        this.checkObjectives();
    }
    // --- DRAW SCENE ---
    draw() {
        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Background: light snow/ice field
        let grad = ctx.createLinearGradient(0, 0, 0, 320);
        grad.addColorStop(0, "#e3f6ff");
        grad.addColorStop(1, "#b9e3f5");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 480, 320);

        // Decorative: procedural snow
        for (let i = 0; i < 22; i++) {
            let x = (i*23 + this.frameCount*0.4*i)%480;
            let y = ((i*47 + this.frameCount*2.5)%320);
            ctx.beginPath();
            ctx.arc(x, y, 1.1 + Math.sin(this.frameCount*0.01+i)*1.2, 0, 2*Math.PI);
            ctx.fillStyle = "#fff8";
            ctx.fill();
        }

        // Items
        for (let item of this.items) item.render(ctx);

        // Enemies
        for (let enemy of this.enemies) enemy.render(ctx);

        // Projectiles
        for (let bolt of this.projectiles) bolt.render(ctx);

        // Player
        if (this.player.isAlive) this.player.render(ctx);

        // Level objective text
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.font = "16px Segoe UI, Arial";
        ctx.fillStyle = "#224c68";
        ctx.fillText(this.level.name, 18, 22);
        ctx.font = "13px Segoe UI, Arial";
        ctx.fillStyle = "#315680";
        let obj = this.objectives[this.currentObjective] || "";
        ctx.fillText(obj, 18, 40);
        ctx.restore();

        // Death/game over
        if (!this.player.isAlive) {
            ctx.save();
            ctx.globalAlpha = 0.92;
            ctx.fillStyle = "#222e";
            ctx.fillRect(0, 0, 480, 320);
            ctx.font = "32px Segoe UI, Arial";
            ctx.fillStyle = "#d92f3b";
            ctx.textAlign = "center";
            ctx.fillText("Coop has fallen...", 240, 140);
            ctx.font = "18px Segoe UI, Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText("Press R to restart", 240, 180);
            ctx.restore();
        }

        // Inventory modal
        if (this.showInventory) this.drawInventoryModal(ctx);
        // Level complete
        if (this.levelComplete) {
            ctx.save();
            ctx.globalAlpha = 0.95;
            ctx.fillStyle = "#1b2748dc";
            ctx.fillRect(0, 0, 480, 320);
            ctx.font = "28px Segoe UI, Arial";
            ctx.fillStyle = "#d4f2fa";
            ctx.textAlign = "center";
            ctx.fillText("You Awakened!", 240, 140);
            ctx.font = "16px Segoe UI, Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText("Tutorial Complete! Press R to play again.", 240, 180);
            ctx.restore();
        }
    }
    // --- COLLISION CHECK (circle-circle) ---
    collides(a, b) {
        let dx = (a.x - b.x), dy = (a.y - b.y);
        let dist = Math.hypot(dx, dy);
        return dist <= (a.radius + b.radius);
    }
    // --- SHOOT FROST BOLT ---
    shootFrostBolt() {
        let angle = this.player.facing;
        let x = this.player.x + Math.cos(angle)*this.player.radius;
        let y = this.player.y + Math.sin(angle)*this.player.radius;
        this.projectiles.push(new window.FrostBolt(x, y, angle, this.player.stats.attack));
        this.player.stats.energy -= 10;
    }
    // --- OBJECTIVE PROGRESS ---
    checkObjectives() {
        // 0: Move
        if (this.currentObjective === 0) {
            let mv = this.input.getMoveVector();
            if (Math.abs(mv.x) > 0 || Math.abs(mv.y) > 0)
                this.currentObjective++;
        }
        // 1: Cast Frost Bolt at a Fud Monster
        if (this.currentObjective === 1) {
            let anyHit = this.enemies.some(e => e.dmgTimer > 0);
            if (anyHit)
                this.currentObjective++;
        }
        // 2: Collect Healing Berry
        if (this.currentObjective === 2) {
            let hasBerry = this.inventory.getUsable().some(i => i.type === "HealingBerry");
            if (hasBerry)
                this.currentObjective++;
        }
        // 3: Defeat all Fud Monsters
        if (this.currentObjective === 3) {
            if (this.enemies.length === 0) {
                this.currentObjective++;
                this.levelComplete = true;
            }
        }
    }
    // --- INVENTORY MODAL DRAW (fallback for screen-reader/keyboard) ---
    drawInventoryModal(ctx) {
        // Also rendered in React HUD, but fallback here for pure canvas
        ctx.save();
        ctx.globalAlpha = 0.96;
        ctx.fillStyle = "#f3faff";
        ctx.fillRect(120, 50, 240, 160);
        ctx.strokeStyle = "#9fd9f4";
        ctx.lineWidth = 3;
        ctx.strokeRect(120, 50, 240, 160);
        ctx.fillStyle = "#22608c";
        ctx.font = "18px Segoe UI, Arial";
        ctx.textAlign = "center";
        ctx.fillText("Inventory", 240, 80);
        let items = this.inventory.getUsable();
        if (items.length === 0) {
            ctx.font = "14px Segoe UI, Arial";
            ctx.fillStyle = "#145086";
            ctx.fillText("Empty!", 240, 130);
        } else {
            ctx.font = "15px Segoe UI, Arial";
            ctx.fillStyle = "#22608c";
            let y = 120;
            for (let item of items) {
                ctx.fillText(item.label, 240, y);
                y += 26;
            }
            ctx.font = "13px Segoe UI, Arial";
            ctx.fillStyle = "#2a5d8c";
            ctx.fillText("Press 1 to use Healing Berry", 240, 190);
        }
        ctx.restore();
    }
    // --- UI HUD STATE SYNC (for React) ---
    updateHUD() {
        // Communicate state to React HUD
        if (typeof window.setHudState === "function") {
            window.setHudState({
                health: this.player.stats.health,
                maxHealth: this.player.stats.maxHealth,
                energy: this.player.stats.energy,
                maxEnergy: this.player.stats.maxEnergy,
                level: this.player.stats.level,
                inventory: this.inventory.getUsable(),
                objective: this.objectives[this.currentObjective] || "",
                isAlive: this.player.isAlive,
                showInventory: this.showInventory,
                levelComplete: this.levelComplete
            });
        }
    }
    // --- INVENTORY HANDLERS ---
    openInventory() { this.showInventory = true; }
    closeInventory() { this.showInventory = false; }
    useHealingBerry() {
        if (this.inventory.use("HealingBerry", this.player))
            this.closeInventory();
    }
    // --- GAME RESET ---
    resetGame() {
        // Full reload
        let c = this.canvas;
        let gm = new window.GameManager(c);
        window.gameManager = gm;
        setTimeout(() => gm.updateHUD(), 100);
    }
};

// --- REACT HUD UI ---
function createReactHud() {
    // Only mount once
    if (window.reactHudMounted) return;
    window.reactHudMounted = true;

    // Minimal React runtime for HUD
    const e = React.createElement;
    function HudView(props) {
        // Responsive bar percent
        let hpPct = Math.round((props.health/props.maxHealth)*100);
        let enPct = Math.round((props.energy/props.maxEnergy)*100);
        return e('div', { className: "w-full flex flex-col", style: {maxWidth:480, margin:"0 auto"} },
            // Health
            e('div', { className: "hud-bar", style:{background:"#d0e7fa"} },
                e('div', { className: "hud-bar-inner", style: {
                    width: hpPct+"%",
                    background: "linear-gradient(90deg, #d4ffef, #4fc1e8)",
                    transition: "width 0.16s"
                }}),
                e('span', { className: "hud-bar-label" }, `Health: ${props.health}/${props.maxHealth}`)
            ),
            // Energy
            e('div', { className: "hud-bar", style:{background:"#e0f2fa", marginBottom:10} },
                e('div', { className: "hud-bar-inner", style: {
                    width: enPct+"%",
                    background: "linear-gradient(90deg, #d2e9f7, #8bdcfb)",
                    transition: "width 0.16s"
                }}),
                e('span', { className: "hud-bar-label" }, `Energy: ${props.energy}/${props.maxEnergy}`)
            ),
            // Buttons
            e('div', { className: "flex flex-row items-center mb-1" }, [
                e('button', {
                    className: "hud-btn",
                    onClick: ()=>window.gameManager.shootFrostBolt(),
                    tabIndex:0,
                    disabled: props.energy<10 || !props.isAlive
                }, "❄️ Frost Bolt"),
                e('button', {
                    className: "hud-btn",
                    onClick: ()=>window.gameManager.openInventory(),
                    tabIndex:0,
                }, "🎒 Inventory")
            ]),
            // Inventory modal
            props.showInventory ? e('div', { className:"inventory-modal", role:"dialog", "aria-modal":"true" },
                [
                    e('h3', {}, "Inventory"),
                    props.inventory.length === 0 ?
                        e('div', { className:"inventory-item" }, "Empty!") :
                        props.inventory.map((item, i) =>
                            e('div', { className:"inventory-item", key:i },
                                [
                                    item.label,
                                    item.type==="HealingBerry" ?
                                        e('button', {
                                            className:"hud-btn ml-2",
                                            onClick:()=>window.gameManager.useHealingBerry(),
                                            tabIndex:0,
                                        }, "Use") : null
                                ]
                            )
                        ),
                    e('button', {
                        className:"hud-btn mt-2",
                        onClick:()=>window.gameManager.closeInventory(),
                        tabIndex:0,
                    }, "Close")
                ]
            ) : null,
            // Objective
            e('div', { className: "mt-2 text-blue-900 text-sm font-medium" }, props.objective)
        );
    }

    // State
    let hudDiv = document.getElementById('hud-root');
    let lastProps = {};
    window.setHudState = function(props) {
        // Only update if state changes
        let changed = false;
        for (let k in props) if (props[k] !== lastProps[k]) changed = true;
        if (!changed) return;
        lastProps = props;
        ReactDOM.render(e(HudView, props), hudDiv);
    };
}

// --- MAIN GAME INIT ---
function initGame() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) { alert("Game canvas not found."); return; }

    // Init React HUD
    createReactHud();

    // Game Manager
    window.gameManager = new window.GameManager(canvas);

    // HUD initial state
    setTimeout(() => window.gameManager.updateHUD(), 60);

    // Keyboard shortcuts
    window.addEventListener('keydown', function(e) {
        // Inventory modal
        if (e.code === "KeyI" || e.code === "Tab") {
            e.preventDefault();
            if (!window.gameManager.showInventory)
                window.gameManager.openInventory();
            else
                window.gameManager.closeInventory();
        }
        // Use Healing Berry (if modal open)
        if (window.gameManager.showInventory && e.code === "Digit1") {
            window.gameManager.useHealingBerry();
        }
        // Restart
        if (!window.gameManager.player.isAlive || window.gameManager.levelComplete) {
            if (e.code === "KeyR") window.gameManager.resetGame();
        }
    });

    // Accessibility: focus canvas for keyboard input
    canvas.setAttribute('tabindex', "0");
    canvas.focus();
}

// --- REACT + REACTDOM (Minimal) ---
// CDN load for React (as UI shell), if not loaded
(function loadReactIfNeeded() {
    if (!window.React || !window.ReactDOM) {
        let reactScript = document.createElement('script');
        reactScript.src = "https://unpkg.com/react@17/umd/react.development.js";
        reactScript.onload = () => {
            let domScript = document.createElement('script');
            domScript.src = "https://unpkg.com/react-dom@17/umd/react-dom.development.js";
            domScript.onload = () => {
                if (typeof createReactHud === "function") createReactHud();
            };
            document.body.appendChild(domScript);
        };
        document.body.appendChild(reactScript);
    } else {
        if (typeof createReactHud === "function") createReactHud();
    }
})();