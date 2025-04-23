export interface Chapter {
  chapterId: number;
  title: string;
  story: string;
  baseCode: string;
  taskCode: string;
  instructions: string;
  challenge: string;
  assets: string[];
}

export const chapters: Chapter[] = [
  {
    chapterId: 1,
    title: "Khám phá vương quốc",
    story: "Hiệp sĩ nhí bước vào vương quốc, thấy cỏ và lâu đài mất màu...",
    baseCode: "",
    taskCode: 'console.log("Tô màu cỏ và lâu đài!");',
    instructions: 'Điền màu: "0x00FF00" cho cỏ, "0x808080" cho lâu đài.',
    challenge: 'Thêm console.log("Tôi đã đến vương quốc!");',
    assets: ["background", "grass", "castle"],
  },
  // Thêm các chapter 2-6 tương tự
];
