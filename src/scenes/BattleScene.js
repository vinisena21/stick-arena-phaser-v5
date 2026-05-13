import Phaser from "phaser";
import MobileControls from "../systems/MobileControls.js";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("BattleScene");
  }

  init(data) {
    this.character = data.character;
    this.map = data.map;
    this.weapon = data.weapon;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, this.map.background || 0x020617);

    this.add.text(w / 2, 30, this.map.name, {
      fontFamily: "Arial",
      fontSize: 28,
      color: "#ffffff",
    }).setOrigin(0.5);

    this.player = this.add.rectangle(180, h - 180, 60, 120, this.character.color);
    this.enemy = this.add.rectangle(w - 180, h - 180, 60, 120, 0xef4444);

    this.physics.add.existing(this.player);
    this.physics.add.existing(this.enemy);

    this.player.body.setCollideWorldBounds(true);
    this.enemy.body.setCollideWorldBounds(true);

    this.controls = new MobileControls(this);

    this.cameras.main.fadeIn(400);
  }

  update() {
    const state = this.controls.state;

    this.player.body.setVelocityX(0);

    if (state.left) {
      this.player.body.setVelocityX(-320);
    }

    if (state.right) {
      this.player.body.setVelocityX(320);
    }

    if (state.jump && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-600);
    }
  }
}
