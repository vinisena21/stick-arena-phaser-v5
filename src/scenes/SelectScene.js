import { CHARACTERS, MAPS, WEAPONS } from "../data/gameData.js";
import Phaser from "phaser";
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
    const isLandscape = w > h;

    const titleSize = isLandscape ? 34 : 42;
    const smallText = isLandscape ? 16 : 22;
    const itemHeight = isLandscape ? 44 : 58;
    const gap = isLandscape ? 8 : 14;

    this.add.rectangle(w / 2, h / 2, w, h, 0x020617);

    this.add.text(w / 2, 28, "SELEÇÃO", {
      fontFamily: "Arial",
      fontSize: titleSize,
      fontStyle: "900",
      color: "#67e8f9",
      stroke: "#0e7490",
      strokeThickness: 5,
    }).setOrigin(0.5, 0);

    const colW = isLandscape ? w * 0.31 : w * 0.86;
    const startY = isLandscape ? 90 : 110;

    if (isLandscape) {
      this.createColumn("Personagem", CHARACTERS, 24, startY, colW, itemHeight, gap, smallText, "character");
      this.createColumn("Mapa", MAPS, w * 0.35, startY, colW, itemHeight, gap, smallText, "map");
      this.createColumn("Arma", WEAPONS, w * 0.68, startY, colW, itemHeight, gap, smallText, "weapon");
    } else {
      this.createColumn("Personagem", CHARACTERS, w * 0.07, startY, colW, itemHeight, gap, smallText, "character");
      this.createColumn("Mapa", MAPS, w * 0.07, startY + 245, colW, itemHeight, gap, smallText, "map");
      this.createColumn("Arma", WEAPONS, w * 0.07, startY + 475, colW, itemHeight, gap, smallText, "weapon");
    }

    const btnW = isLandscape ? 180 : w * 0.72;
    const btnH = isLandscape ? 48 : 58;
    const btnY = h - (isLandscape ? 62 : 90);

    const playBtn = this.add.rectangle(w / 2, btnY, btnW, btnH, 0x22d3ee, 0.95)
      .setStrokeStyle(3, 0xffffff, 0.35)
      .setInteractive({ useHandCursor: true });

    this.add.text(w / 2, btnY, "JOGAR", {
      fontFamily: "Arial",
      fontSize: isLandscape ? 22 : 28,
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

    const back = this.add.text(20, h - 34, "← Voltar", {
      fontFamily: "Arial",
      fontSize: isLandscape ? 16 : 22,
      color: "#ffffff",
    }).setInteractive({ useHandCursor: true });

    back.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }

  createColumn(title, items, x, y, width, itemHeight, gap, fontSize, type) {
    this.add.text(x, y - 32, title, {
      fontFamily: "Arial",
      fontSize: fontSize + 6,
      color: "#ffffff",
    });

    items.forEach((item, index) => {
      const yy = y + index * (itemHeight + gap);
      const color = item.color || 0x22d3ee;

      const selected =
        (type === "character" && this.selectedCharacter.id === item.id) ||
        (type === "map" && this.selectedMap.id === item.id) ||
        (type === "weapon" && this.selectedWeapon.id === item.id);

      const box = this.add.rectangle(
        x + width / 2,
        yy + itemHeight / 2,
        width,
        itemHeight,
        0x0f172a,
        selected ? 0.95 : 0.62
      )
        .setStrokeStyle(selected ? 4 : 2, color, selected ? 1 : 0.6)
        .setInteractive({ useHandCursor: true });

      this.add.circle(x + 22, yy + itemHeight / 2, itemHeight * 0.28, color, 1);

      const label = item.name || item.id;

      this.add.text(x + 48, yy + itemHeight / 2, label, {
        fontFamily: "Arial",
        fontSize,
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