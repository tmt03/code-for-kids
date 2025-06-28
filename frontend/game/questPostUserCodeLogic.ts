export function setupPostUserCodeInteractions(questId: string, sandbox: any) {
  if (questId === "C04_Q04") {
    if (sandbox.kiemsi) {
      sandbox.onKey("RIGHT", { animation: "run" }, "kiemsi", 200, 0);
      sandbox.onKey("LEFT", { animation: "run" }, "kiemsi", -200, 0);
      sandbox.onKey("UP", { animation: "jump" }, "kiemsi", 0, 500);
    }
    if (sandbox.kiemsi && sandbox.quaivat1) {
      sandbox.interact("kiemsi", "quaivat1", "lose", "hp", 100);
    }
    if (sandbox.kiemsi && sandbox.quaivat2) {
      sandbox.interact("kiemsi", "quaivat2", "lose", "hp", 100);
    }
    sandbox.setTimer(30);
    sandbox.when("hp:kiemsi <=0", "end", "lose");
    sandbox.when("time <=0", "end", "win");
  }

  if (questId === "C05_Q03") {
    if (sandbox.kiemsi) {
      sandbox.onKey("RIGHT", { animation: "run" }, "kiemsi", 200, 0);
      sandbox.onKey("LEFT", { animation: "run" }, "kiemsi", -200, 0);
      sandbox.onKey("UP", { animation: "jump" }, "kiemsi", 0, 500);
    }
  }
  if (questId === "C05_Q05") {
    sandbox.onKey("RIGHT", { animation: "run" }, "kiemsinhi", 200, 0);
    sandbox.onKey("LEFT", { animation: "run" }, "kiemsinhi", -200, 0);
    sandbox.onKey("UP", { animation: "jump" }, "kiemsinhi", 0, 500);
    if (sandbox.kiemsinhi && sandbox.quaivat) {
      sandbox.interact("kiemsinhi", "quaivat", "lose", "hp", 50);
    }
  }

  if (questId === "C06_Q04") {
    sandbox.onKey("RIGHT", { animation: "run" }, "kiemsinhi", 200, 0);
    sandbox.onKey("LEFT", { animation: "run" }, "kiemsinhi", -200, 0);
    sandbox.onKey("UP", { animation: "jump" }, "kiemsinhi", 0, 500);
  }

  if (questId === "C07_Q06") {
    sandbox.onKey("RIGHT", { animation: "run" }, "hero", 200, 0);
    sandbox.onKey("LEFT", { animation: "run" }, "hero", -200, 0);
    sandbox.onKey("UP", { animation: "jump" }, "hero", 0, 500);
    sandbox.onAttack("A", { animation: "attack" }, "thuong", "hero");
    if (sandbox.hero && sandbox.boss) {
      sandbox.interact("hero", "boss", "lose", "hp", 100);
    }
  }
}
