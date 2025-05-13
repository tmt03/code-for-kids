import { BoardModel } from "../models/boardModel";
import { slugify } from "../utils/formatters";

const createNew = async (reqBody: any) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới tằng model để xử lý logic bản ghi trong newBoard vào trang Database
    const createBoard = await BoardModel.createNew(newBoard);

    //Lấy bản ghi sau khi gọi (tùy mục đích)
    const getNewBoard = await BoardModel.findOneById(
      createBoard.insertedId.toString()
    );

    //Làm thêm các xử lý khác với các Collection khác tùy đặc thù dự án...vv
    //Bắn email, thông báo ve cho admin khi có 1 cái board mới được tạo...vv

    //Trả kết quả về (Trong service luôn luôn phải có return)
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};
