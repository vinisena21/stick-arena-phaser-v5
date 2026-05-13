import Phaser from "phaser";
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
