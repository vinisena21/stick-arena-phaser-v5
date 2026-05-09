import Phaser from "phaser";
import { CHARACTERS } from "../data/characters.js";
import { WEAPONS } from "../data/weapons.js";
import { MAPS } from "../data/maps.js";

export default class SelectScene extends Phaser.Scene {
  constructor() {
    super("SelectScene");
  }

  create() {
    this.selectedCharacter = CHARACTERS[0].id;
    this.selectedWeapon = WEAPONS[0].id;
    this.selectedMap = MAPS[0].id;

    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#020617");
    this.add.text(width / 2, 42, "SELEÇÃO", { fontFamily: "Arial", fontSize: 36, fontStyle: "900", color: "#fff", stroke: "#22d3ee", strokeThickness: 4 }).setOrigin(0.5);

    this.add.text(60, 92, "Personagem", { fontFamily: "Arial", fontSize: 22, color: "#e2e8f0" });
    CHARACTERS.forEach((c, i) => this.option(60, 135 + i * 62, c.name + " — " + c.outfit, c.color, () => this.selectedCharacter = c.id));

    this.add.text(60, 335, "Arma", { fontFamily: "Arial", fontSize: 22, color: "#e2e8f0" });
    WEAPONS.forEach((w, i) => this.option(60, 378 + i * 55, w.name, w.glow, () => this.selectedWeapon = w.id));

    this.add.text(width * 0.58, 92, "Mapa", { fontFamily: "Arial", fontSize: 22, color: "#e2e8f0" });
    MAPS.forEach((m, i) => this.option(width * 0.58, 135 + i * 62, m.name, m.accent, () => this.selectedMap = m.id));

    this.button(width / 2, height - 80, "COMEÇAR BATALHA", () => {
      this.scene.start("BattleScene", { characterId: this.selectedCharacter, weaponId: this.selectedWeapon, mapId: this.selectedMap });
    });

    this.button(86, height - 40, "VOLTAR", () => this.scene.start("MenuScene"), 150, 42);
  }

  option(x, y, label, color, callback) {
    const box = this.add.rectangle(x + 170, y, 330, 44, 0x0f172a, 0.92).setInteractive({ useHandCursor: true });
    box.setStrokeStyle(2, color, 0.75);
    this.add.circle(x + 18, y, 13, color, 0.9);
    this.add.text(x + 42, y, label, { fontFamily: "Arial", fontSize: 15, color: "#fff" }).setOrigin(0, 0.5);
    box.on("pointerdown", () => {
      callback();
      box.setFillStyle(color, 0.42);
      this.time.delayedCall(180, () => box.setFillStyle(0x0f172a, 0.92));
    });
  }

  button(x, y, label, cb, w = 280, h = 54) {
    const b = this.add.rectangle(x, y, w, h, 0x2563eb, 0.95).setInteractive({ useHandCursor: true });
    b.setStrokeStyle(2, 0x67e8f9, 0.85);
    this.add.text(x, y, label, { fontFamily: "Arial", fontSize: 18, fontStyle: "900", color: "#fff" }).setOrigin(0.5);
    b.on("pointerdown", cb);
  }
}
