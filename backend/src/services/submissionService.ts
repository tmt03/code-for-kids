import { codeCheckService } from "./codeCheckService";

const submitCode = async (userCode: string) => {
  // Gọi codeCheckService cử lí kiểm tra code user nhập vào và trả về kết qua
  const result = await codeCheckService.logicCheck(userCode);
  // Thực hiện bất đồng bọ tăng điểm cho user hoàn thành check code và cập nhật đánh giá xếp hạng
  // Thực hiện bất đồng bộ cập nhật trạng thái tiến trình học cho user
  // Thực hiện bất đồng bộ trao huy hiệu cho user khi đạt yêu cầu
};

export const submissionServiceService = {
  submitCode,
};
