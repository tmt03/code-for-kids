export interface Chapter {
  chapterId: number;
  title: string;
  story: string;
  baseCode: string;
  taskCode: string;
  instructions: string;
  challenge: string;
  assets: {
    background: {
      sky: string;
      floor: string;
      castle: string;
      tree: string;
      shrub: string;
      rock: string;
    };
    player: {
      idle: string;
      run: string;
      sword: string;
    };
  };
}

export const chapters: Record<number, Chapter> = {
  1: {
    chapterId: 1,
    title: "Chapter 1: Bắt đầu cuộc phiêu lưu",
    story: "Chào mừng đến với thế giới lập trình!",
    baseCode: "",
    taskCode: "",
    instructions: "Hãy bắt đầu với những bước đầu tiên",
    challenge: "Hoàn thành nhiệm vụ đầu tiên",
    assets: {
      background: {
        sky: "sky/sky_7.png",
        floor: "ground/ground_2.png",
        castle: "castle/castle.png",
        tree: "tree/tree_4.png",
        shrub: "tree/shrub_3.png",
        rock: "rock/rock_4.png"
      },
      player: {
        idle: "player_idle.png",
        run: "player_run.png",
        sword: "sword.png"
      }
    }
  },
  2: {
    chapterId: 2,
    title: "Chapter 2: Khám phá thế giới mới",
    story: "Tiếp tục cuộc phiêu lưu của bạn!",
    baseCode: "",
    taskCode: "",
    instructions: "Hãy khám phá thế giới mới",
    challenge: "Hoàn thành nhiệm vụ thứ hai",
    assets: {
      background: {
        sky: "sky/sky_8.png",
        floor: "ground/ground_3.png",
        castle: "castle/castle_2.png",
        tree: "tree/tree_5.png",
        shrub: "tree/shrub_4.png",
        rock: "rock/rock_5.png"
      },
      player: {
        idle: "player_idle_2.png",
        run: "player_run_2.png",
        sword: "sword_2.png"
      }
    }
  }
};