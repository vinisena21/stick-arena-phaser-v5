import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.setPath("./");
  }

  create() {
    this.cameras.main.setBackgroundColor("#020617");

    this.add.text(this.scale.width / 2, this.scale.height / 2, "STICK ARENA V5", {
      fontFamily: "Arial",
      fontSize: 42,
      fontStyle: "900",
      color: "#67e8f9",
    }).setOrigin(0.5);

    this.time.delayedCall(1000, () => {
      this.scene.start("MenuScene");
    });
  }
}
