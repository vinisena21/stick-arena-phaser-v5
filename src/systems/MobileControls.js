export default class MobileControls {
  constructor(scene) {
    this.scene = scene;
    this.state = { left: false, right: false, down: false, jump: false, light: false, heavy: false, skill: false, dash: false, block: false };
    this.buttons = [];
    this.create();
  }

  createButton(x, y, label, key, size = 64) {
    const c = this.scene.add.circle(x, y, size / 2, 0xffffff, 0.13).setScrollFactor(0).setDepth(1000).setInteractive();
    c.setStrokeStyle(2, 0xffffff, 0.22);
    const t = this.scene.add.text(x, y, label, { fontFamily: "Arial", fontSize: 15, fontStyle: "900", color: "#fff" }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    c.on("pointerdown", () => { this.state[key] = true; c.setFillStyle(0x22d3ee, 0.35); });
    c.on("pointerup", () => { this.state[key] = false; c.setFillStyle(0xffffff, 0.13); });
    c.on("pointerout", () => { this.state[key] = false; c.setFillStyle(0xffffff, 0.13); });
    this.buttons.push(c, t);
  }

  create() {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    this.createButton(54, h - 74, "◀", "left", 68);
    this.createButton(128, h - 74, "▼", "down", 68);
    this.createButton(202, h - 74, "▶", "right", 68);

    this.createButton(w - 226, h - 124, "PULO", "jump", 62);
    this.createButton(w - 154, h - 124, "LEVE", "light", 62);
    this.createButton(w - 82, h - 124, "FORTE", "heavy", 62);
    this.createButton(w - 226, h - 54, "DASH", "dash", 62);
    this.createButton(w - 154, h - 54, "SKILL", "skill", 62);
    this.createButton(w - 82, h - 54, "DEF", "block", 62);
  }

  destroy() {
    this.buttons.forEach(b => b.destroy());
  }
}
