import { questModel } from "../models/questModel";

const getQuestDetails = async (questId: string) => {
  try {
    const quest = await questModel.getQuestDetails(questId);
    // if (!quest) {
    //   throw new ApiError(StatusCodes.NOT_FOUND, "Quest not found!");
    // }

    //Làm thêm các xử lý khác với các Collection khác tùy đặc thù dự án...vv
    //Bắn email, thông báo ve cho admin khi có 1 cái board mới được tạo...vv

    //Trả kết quả về (Trong service luôn luôn phải có return)
    return quest;
  } catch (error) {
    throw error;
  }
};

export const questService = {
  getQuestDetails,
};
