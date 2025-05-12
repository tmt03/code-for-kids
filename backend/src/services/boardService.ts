import { slugify } from "../utils/formatters";

const createNew = async (reqBody: any) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới tằng model để xử lý logic bản ghi trong newBoard vào trang Database

    //Làm thêm các xử lý khác với các Collection khác tùy đặc thù dự án...vv
    //Bắn email, thông báo ve cho admin khi có 1 cái board mới được tạo...vv

    //Trả kết quả về (Trong service luôn luôn phải có return)
    return newBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};
