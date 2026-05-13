import Phaser from "phaser";
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x020617);

    this.add.text(w / 2, h * 0.22, "STICK ARENA", {
      fontFamily: "Arial",
      fontSize: 52,
      fontStyle: "900",
      color: "#67e8f9",
      stroke: "#0f172a",
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.32, "V5 PHASER EDITION", {
      fontFamily: "Arial",
      fontSize: 24,
      color: "#ffffff",
    }).setOrigin(0.5);

    const playBtn = this.add.rectangle(w / 2, h * 0.56, 240, 70, 0x22d3ee)
      .setInteractive({ useHandCursor: true });

    playBtn.setStrokeStyle(3, 0xffffff, 0.3);

    this.add.text(w / 2, h * 0.56, "JOGAR", {
      fontFamily: "Arial",
      fontSize: 30,
      fontStyle: "900",
      color: "#ffffff",
    }).setOrigin(0.5);

    playBtn.on("pointerdown", () => {
      this.scene.start("SelectScene");
    });
  }
}
