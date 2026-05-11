export default class MobileControls {
  constructor(scene) {
    this.scene = scene;

    this.state = {
      left: false,
      right: false,
      down: false,
      jump: false,
      light: false,
      heavy: false,
      skill: false,
      dash: false,
      block: false,
    };

    this.buttons = [];
    this.create();

    this.scene.scale.on("resize", this.rebuild, this);
    this.scene.events.once("shutdown", this.destroy, this);
  }

  rebuild() {
    this.buttons.forEach((item) => item.destroy());
    this.buttons = [];
    this.create();
  }

  isLandscape() {
    return this.scene.scale.width > this.scene.scale.height;
  }

  createButton(x, y, label, key, size = 64) {
    const circle = this.scene.add
      .circle(x, y, size / 2, 0xffffff, 0.12)
      .setScrollFactor(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    circle.setStrokeStyle(2, 0xffffff, 0.24);

    const text = this.scene.add
      .text(x, y, label, {
        fontFamily: "Arial",
        fontSize: Math.max(12, size * 0.22),
        fontStyle: "900",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    const press = () => {
      this.state[key] = true;
      circle.setFillStyle(0x22d3ee, 0.36);
      circle.setScale(0.94);
    };

    const release = () => {
      this.state[key] = false;
      circle.setFillStyle(0xffffff, 0.12);
      circle.setScale(1);
    };

    circle.on("pointerdown", press);
    circle.on("pointerup", release);
    circle.on("pointerout", release);
    circle.on("pointerupoutside", release);

    this.buttons.push(circle, text);
  }

  create() {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    const landscape = this.isLandscape();

    const safeBottom = landscape ? 38 : 76;
    const size = landscape ? 58 : 68;
    const gap = landscape ? 62 : 74;

    const leftBaseX = landscape ? 64 : 54;
    const leftBaseY = h - safeBottom;

    this.createButton(leftBaseX, leftBaseY, "◀", "left", size);
    this.createButton(leftBaseX + gap, leftBaseY, "▼", "down", size);
    this.createButton(leftBaseX + gap * 2, leftBaseY, "▶", "right", size);

    const actionSize = landscape ? 56 : 62;
    const actionGap = landscape ? 62 : 72;

    const rightX = w - (landscape ? 210 : 226);
    const row1 = h - (landscape ? 98 : 124);
    const row2 = h - (landscape ? 38 : 54);

    this.createButton(rightX, row1, "PULO", "jump", actionSize);
    this.createButton(rightX + actionGap, row1, "LEVE", "light", actionSize);
    this.createButton(rightX + actionGap * 2, row1, "FORTE", "heavy", actionSize);

    this.createButton(rightX, row2, "DASH", "dash", actionSize);
    this.createButton(rightX + actionGap, row2, "SKILL", "skill", actionSize);
    this.createButton(rightX + actionGap * 2, row2, "DEF", "block", actionSize);
  }

  destroy() {
    this.scene.scale.off("resize", this.rebuild, this);
    this.buttons.forEach((item) => item.destroy());
    this.buttons = [];
  }
}