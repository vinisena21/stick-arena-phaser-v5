import Phaser from "phaser";
import { CHARACTERS, MAPS, WEAPONS } from "../data/gameData.js";

export default class SelectScene extends Phaser.Scene {
  constructor() {
    super("SelectScene");
  }

  create() {
    this.selectedCharacter = CHARACTERS[0];
    this.selectedMap = MAPS[0];
    this.selectedWeapon = WEAPONS[0];

    this.renderUI();

    this.scale.on("resize", () => {
      this.renderUI();
    });
  }

  renderUI() {
    this.children.removeAll();

    const w = this.scale.width;
    const h = this.scale.height;
    const landscape = w > h;

    this.add.rectangle(w / 2, h / 2, w, h, 0x020617);

    this.add.text(w / 2, 30, "SELEÇÃO", {
      fontFamily: "Arial",
      fontSize: landscape ? 34 : 44,
      fontStyle: "900",
      color: "#67e8f9",
    }).setOrigin(0.5, 0);

    this.createSection(
      "PERSONAGEM",
      CHARACTERS,
      landscape ? 40 : 30,
      landscape ? 100 : 100,
      landscape ? 320 : w - 60,
      "character"
    );

    this.createSection(
      "MAPA",
      MAPS,
      landscape ? w / 2 - 80 : 30,
      landscape ? 100 : 360,
      landscape ? 320 : w - 60,
      "map"
    );

    this.createSection(
      "ARMA",
      WEAPONS,
      landscape ? w - 360 : 30,
      landscape ? 100 : 620,
      landscape ? 320 : w - 60,
      "weapon"
    );

    const playBtn = this.add.rectangle(
      w / 2,
      h - 60,
      landscape ? 220 : w * 0.7,
      60,
      0x22d3ee
    )
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(3, 0xffffff, 0.25);

    this.add.text(w / 2, h - 60, "INICIAR", {
      fontFamily: "Arial",
      fontSize: 26,
      fontStyle: "900",
      color: "#ffffff",
    }).setOrigin(0.5);

    playBtn.on("pointerdown", () => {
      this.scene.start("BattleScene", {
        character: this.selectedCharacter,
        map: this.selectedMap,
        weapon: this.selectedWeapon,
      });
    });
  }

  createSection(title, list, x, y, width, type) {
    this.add.text(x, y - 36, title, {
      fontFamily: "Arial",
      fontSize: 22,
      fontStyle: "700",
      color: "#ffffff",
    });

    list.forEach((item, index) => {
      const yy = y + index * 72;

      const selected =
        (type === "character" && this.selectedCharacter.id === item.id) ||
        (type === "map" && this.selectedMap.id === item.id) ||
        (type === "weapon" && this.selectedWeapon.id === item.id);

      const box = this.add.rectangle(
        x + width / 2,
        yy,
        width,
        56,
        0x0f172a,
        selected ? 0.95 : 0.7
      )
        .setOrigin(0.5)
        .setStrokeStyle(3, item.color || 0x22d3ee, selected ? 1 : 0.4)
        .setInteractive({ useHandCursor: true });

      this.add.circle(x + 24, yy, 14, item.color || 0x22d3ee);

      this.add.text(x + 50, yy, item.name, {
        fontFamily: "Arial",
        fontSize: 18,
        color: "#ffffff",
      }).setOrigin(0, 0.5);

      box.on("pointerdown", () => {
        if (type === "character") this.selectedCharacter = item;
        if (type === "map") this.selectedMap = item;
        if (type === "weapon") this.selectedWeapon = item;

        this.renderUI();
      });
    });
  }
}
