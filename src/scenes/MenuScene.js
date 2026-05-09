import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#020617");
    this.add.rectangle(width / 2, height / 2, width, height, 0x020617);

    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const star = this.add.circle(x, y, Phaser.Math.FloatBetween(0.6, 2), 0x67e8f9, Phaser.Math.FloatBetween(0.15, 0.7));
      this.tweens.add({ targets: star, alpha: 0.1, duration: Phaser.Math.Between(900, 1800), yoyo: true, repeat: -1 });
    }

    this.add.text(width / 2, height * 0.26, "NINJA ARENA V5", {
      fontFamily: "Arial",
      fontSize: Math.min(54, width * 0.1),
      fontStyle: "900",
      color: "#ffffff",
      stroke: "#22d3ee",
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.36, "Phaser Edition • Mapas • Música • Personagens • Combos", {
      fontFamily: "Arial",
      fontSize: 18,
      color: "#cbd5e1",
    }).setOrigin(0.5);

    this.createButton(width / 2, height * 0.52, "JOGAR", () => this.scene.start("SelectScene"));
    this.createButton(width / 2, height * 0.63, "TREINO RÁPIDO", () => this.scene.start("BattleScene", { characterId: "ryu-neon", weaponId: "katana", mapId: "neon" }));

    this.add.text(width / 2, height * 0.84, "PC: A/D, W, S, J, K, L, Shift, B • Mobile: botões flutuantes", {
      fontFamily: "Arial",
      fontSize: 14,
      color: "#94a3b8",
    }).setOrigin(0.5);
  }

  createButton(x, y, label, callback) {
    const box = this.add.rectangle(x, y, 280, 58, 0x2563eb, 0.9).setInteractive({ useHandCursor: true });
    box.setStrokeStyle(2, 0x67e8f9, 0.8);
    const text = this.add.text(x, y, label, { fontFamily: "Arial", fontSize: 22, fontStyle: "900", color: "#ffffff" }).setOrigin(0.5);
    box.on("pointerover", () => box.setFillStyle(0x22d3ee, 0.95));
    box.on("pointerout", () => box.setFillStyle(0x2563eb, 0.9));
    box.on("pointerdown", callback);
    return { box, text };
  }
}
