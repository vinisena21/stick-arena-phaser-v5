import Phaser from "phaser";
import { CHARACTERS } from "../data/characters.js";
import { WEAPONS } from "../data/weapons.js";
import { MAPS } from "../data/maps.js";
import { applyHit } from "../systems/CombatSystem.js";
import MobileControls from "../systems/MobileControls.js";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("BattleScene");
  }

  init(data) {
    this.character = CHARACTERS.find(c => c.id === data.characterId) || CHARACTERS[0];
    this.weapon = WEAPONS.find(w => w.id === data.weaponId) || WEAPONS[0];
    this.map = MAPS.find(m => m.id === data.mapId) || MAPS[0];
    this.level = 1;
  }

  create() {
    this.keys = this.input.keyboard.addKeys({
      left: "A", right: "D", up: "W", down: "S", light: "J", heavy: "K", skill: "L", dash: "SHIFT", block: "B",
    });
    this.mobile = new MobileControls(this);
    this.createMap();
    this.createFighters();
    this.createHUD();
    this.createAudio();
  }

  createAudio() {
    // Música sintética sem arquivo externo: evita erro no Render e dá clima de batalha.
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.musicGain = this.audioCtx.createGain();
      this.musicGain.gain.value = 0.025;
      this.musicGain.connect(this.audioCtx.destination);
      this.musicTimer = this.time.addEvent({ delay: 380, loop: true, callback: () => this.playTone() });
      this.input.once("pointerdown", () => this.audioCtx.resume());
    } catch {}
  }

  playTone() {
    if (!this.audioCtx) return;
    const notes = [110, 146.83, 164.81, 196, 220, 246.94];
    const osc = this.audioCtx.createOscillator();
    const g = this.audioCtx.createGain();
    osc.frequency.value = Phaser.Utils.Array.GetRandom(notes);
    osc.type = "sawtooth";
    g.gain.value = 0.035;
    osc.connect(g);
    g.connect(this.musicGain);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.12);
  }

  createMap() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(this.map.sky);
    this.add.rectangle(width / 2, height / 2, width, height, this.map.sky);

    const moon = this.add.circle(width * 0.82, height * 0.18, 58, this.map.moon, 0.95);
    moon.setStrokeStyle(8, this.map.accent, 0.18);

    for (let i = 0; i < 12; i++) {
      const x = i * 170;
      const h = Phaser.Math.Between(160, 340);
      this.add.rectangle(x, height - 150 - h / 2, 90, h, 0x020617, 0.55);
      for (let j = 0; j < 8; j++) this.add.rectangle(x - 20, height - 260 - j * 24, 10, 10, this.map.accent, 0.22);
    }

    this.groundY = height * 0.78;
    this.ground = this.add.rectangle(width / 2, this.groundY + 80, width, 180, this.map.ground).setDepth(1);
    this.add.rectangle(width / 2, this.groundY, width, 5, this.map.accent, 0.75).setDepth(2);
  }

  createFighters() {
    const h = this.scale.height;
    this.player = this.makeFighter(190, h * 0.72, this.character, true);
    this.enemy = this.makeFighter(this.scale.width - 190, h * 0.72, CHARACTERS[1], false);
    this.enemy.hp = 95;
    this.enemy.maxHp = 95;
  }

  makeFighter(x, y, char, isPlayer) {
    const container = this.add.container(x, y).setDepth(10);
    const aura = this.add.circle(0, -72, 44, char.glow, 0.13);
    const head = this.add.circle(0, -112, 18, char.color, 1).setStrokeStyle(4, 0xffffff, 0.55);
    const scarf = this.add.rectangle(18, -96, 42, 8, char.glow, 0.85).setAngle(10);
    const body = this.add.rectangle(0, -70, 34, 62, char.color, 0.95).setStrokeStyle(3, 0xffffff, 0.18);
    const belt = this.add.rectangle(0, -48, 42, 8, 0x020617, 0.8);
    const lArm = this.add.rectangle(-26, -72, 12, 54, char.color, 0.95).setAngle(32);
    const rArm = this.add.rectangle(26, -72, 12, 54, char.color, 0.95).setAngle(-32);
    const lLeg = this.add.rectangle(-12, -18, 13, 58, char.color, 0.95).setAngle(12);
    const rLeg = this.add.rectangle(12, -18, 13, 58, char.color, 0.95).setAngle(-12);
    const sword = this.add.rectangle(48, -68, this.weapon.range, 6, this.weapon.color, 1).setOrigin(0, 0.5).setStrokeStyle(4, this.weapon.glow, 0.5);
    container.add([aura, head, scarf, body, belt, lArm, rArm, lLeg, rLeg, sword]);

    this.physics.add.existing(container);
    container.body.setSize(46, 130);
    container.body.setOffset(-23, -132);
    container.body.setCollideWorldBounds(true);
    container.body.setGravityY(980);

    return { sprite: container, x, y, hp: char.hp, maxHp: char.hp, face: isPlayer ? 1 : -1, char, isPlayer, combo: 0, comboTimer: 0, stun: 0, sword, rArm, lArm, aura, state: "idle", attackCd: 0, skillCd: 0, block: false };
  }

  createHUD() {
    const w = this.scale.width;
    this.playerBarBg = this.add.rectangle(180, 30, 300, 24, 0xffffff, 0.12).setScrollFactor(0).setDepth(100);
    this.enemyBarBg = this.add.rectangle(w - 180, 30, 300, 24, 0xffffff, 0.12).setScrollFactor(0).setDepth(100);
    this.playerBar = this.add.rectangle(30, 30, 300, 24, 0x22c55e, 0.95).setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);
    this.enemyBar = this.add.rectangle(w - 330, 30, 300, 24, 0xef4444, 0.95).setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);
    this.levelText = this.add.text(w / 2, 20, "FASE 1", { fontFamily: "Arial", fontSize: 24, fontStyle: "900", color: "#fff", stroke: "#22d3ee", strokeThickness: 3 }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    this.comboText = this.add.text(w / 2, 58, "", { fontFamily: "Arial", fontSize: 26, fontStyle: "900", color: "#fde68a", stroke: "#f59e0b", strokeThickness: 3 }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    this.back = this.add.text(18, 58, "SAIR", { fontFamily: "Arial", fontSize: 18, fontStyle: "900", color: "#fff", backgroundColor: "rgba(255,255,255,.12)", padding: { x: 14, y: 8 } }).setInteractive().setScrollFactor(0).setDepth(101);
    this.back.on("pointerdown", () => this.scene.start("MenuScene"));
  }

  update(_, delta) {
    this.updateFighterRefs();
    this.updatePlayer(delta);
    this.updateEnemy(delta);
    this.updateAnimations(delta);
    this.updateHUD();
  }

  updateFighterRefs() {
    this.player.x = this.player.sprite.x; this.player.y = this.player.sprite.y;
    this.enemy.x = this.enemy.sprite.x; this.enemy.y = this.enemy.sprite.y;
  }

  updatePlayer(delta) {
    const p = this.player;
    const m = this.mobile.state;
    p.attackCd = Math.max(0, p.attackCd - delta);
    p.skillCd = Math.max(0, p.skillCd - delta);
    p.comboTimer = Math.max(0, p.comboTimer - delta);
    if (p.comboTimer <= 0) p.combo = 0;

    const left = this.keys.left.isDown || m.left;
    const right = this.keys.right.isDown || m.right;
    const down = this.keys.down.isDown || m.down;
    p.block = this.keys.block.isDown || m.block;

    if (left) { p.sprite.setVelocityX(-p.char.speed); p.face = -1; }
    else if (right) { p.sprite.setVelocityX(p.char.speed); p.face = 1; }
    else p.sprite.setVelocityX(p.sprite.body.velocity.x * 0.78);

    if ((this.keys.up.isDown || m.jump) && p.sprite.body.blocked.down) p.sprite.setVelocityY(-p.char.jump);
    if ((this.keys.dash.isDown || m.dash) && p.attackCd <= 0) { p.sprite.setVelocityX(p.face * 720); p.attackCd = 260; this.afterImage(p); }
    if ((this.keys.light.isDown || m.light) && p.attackCd <= 0) this.doAttack(p, 12, 170, 92, 260);
    if ((this.keys.heavy.isDown || m.heavy) && p.attackCd <= 0) this.doAttack(p, 26, 430, 115, 420);
    if ((this.keys.skill.isDown || m.skill) && p.skillCd <= 0) this.doSkill(p);

    p.sprite.setScale(p.face, down ? 0.86 : 1);
  }

  doAttack(p, power, cooldown, range, knock) {
    p.attackCd = cooldown / this.weapon.speed;
    this.tweens.add({ targets: p.sword, angle: p.face > 0 ? 28 : -28, duration: 70, yoyo: true });
    this.tweens.add({ targets: p.rArm, angle: p.face > 0 ? -78 : 78, duration: 70, yoyo: true });
    applyHit(this, p, this.enemy, this.weapon, power, range, knock);
  }

  doSkill(p) {
    p.skillCd = 2400;
    p.attackCd = 550;
    for (let i = 0; i < 7; i++) {
      this.time.delayedCall(i * 65, () => {
        this.afterImage(p);
        applyHit(this, p, this.enemy, this.weapon, 9, 135, 160 + i * 30);
      });
    }
  }

  updateEnemy(delta) {
    const e = this.enemy;
    const p = this.player;
    e.attackCd = Math.max(0, e.attackCd - delta);
    e.stun = Math.max(0, e.stun - delta);
    if (e.hp <= 0) return this.nextLevel();

    const dx = p.sprite.x - e.sprite.x;
    const dist = Math.abs(dx);
    e.face = dx > 0 ? 1 : -1;
    e.sprite.setScale(e.face, 1);

    if (e.stun > 0) return;
    if (dist > 88) e.sprite.setVelocityX(e.face * 185);
    else e.sprite.setVelocityX(0);
    if (dist < 105 && e.attackCd <= 0) {
      e.attackCd = 850;
      const dmg = p.block ? 4 : 12;
      p.hp = Math.max(0, p.hp - dmg);
      this.flashHit((p.x + e.x) / 2, p.y - 78, 0xef4444);
      this.cameras.main.shake(70, 0.0035);
      if (p.hp <= 0) this.gameOver();
    }
  }

  nextLevel() {
    this.level += 1;
    this.enemy.hp = 90 + this.level * 20;
    this.enemy.maxHp = this.enemy.hp;
    this.enemy.sprite.setPosition(this.scale.width - 190, this.scale.height * 0.72);
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 35);
    this.levelText.setText(`FASE ${this.level}`);
  }

  gameOver() {
    this.add.text(this.scale.width / 2, this.scale.height / 2, "DERROTA", { fontFamily: "Arial", fontSize: 56, fontStyle: "900", color: "#fff", stroke: "#ef4444", strokeThickness: 6 }).setOrigin(0.5).setDepth(200);
    this.time.delayedCall(1300, () => this.scene.start("MenuScene"));
  }

  afterImage(f) {
    const ghost = this.add.container(f.sprite.x, f.sprite.y).setDepth(5).setAlpha(0.28).setScale(f.face, 1);
    ghost.add(this.add.rectangle(0, -70, 48, 118, f.char.glow, 0.6));
    this.tweens.add({ targets: ghost, alpha: 0, duration: 220, onComplete: () => ghost.destroy() });
  }

  flashHit(x, y, color) {
    const burst = this.add.circle(x, y, 10, color, 0.9).setDepth(50);
    this.tweens.add({ targets: burst, scale: 4, alpha: 0, duration: 180, onComplete: () => burst.destroy() });
    for (let i = 0; i < 10; i++) {
      const p = this.add.circle(x, y, Phaser.Math.Between(2, 5), color, 0.85).setDepth(50);
      this.tweens.add({ targets: p, x: x + Phaser.Math.Between(-70, 70), y: y + Phaser.Math.Between(-45, 45), alpha: 0, duration: 260, onComplete: () => p.destroy() });
    }
  }

  updateAnimations(delta) {
    [this.player, this.enemy].forEach(f => {
      f.aura.rotation += delta * 0.0015;
      f.aura.setScale(1 + Math.sin(this.time.now * 0.006) * 0.08);
      f.sword.x = 28 * f.face;
      f.sword.scaleX = Math.abs(f.sword.scaleX);
    });
  }

  updateHUD() {
    this.playerBar.width = 300 * (this.player.hp / this.player.maxHp);
    this.enemyBar.width = 300 * (this.enemy.hp / this.enemy.maxHp);
    this.comboText.setText(this.player.combo > 1 ? `COMBO x${this.player.combo}` : "");
  }

  shutdown() {
    if (this.mobile) this.mobile.destroy();
    if (this.musicTimer) this.musicTimer.destroy();
    if (this.audioCtx) this.audioCtx.close();
  }
}
