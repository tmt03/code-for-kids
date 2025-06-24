export function validateOrderProd(payload: any): string {
  if (!payload) return "Thiếu dữ liệu đơn hàng.";
  if (!payload.buyer) return "Thiếu thông tin người mua.";
  if (!payload.buyer.name) return "Vui lòng nhập tên người mua.";
  if (!payload.buyer.phone) return "Vui lòng nhập số điện thoại.";
  if (!payload.buyer.email) return "Vui lòng nhập email.";
  if (!payload.buyer.address) return "Vui lòng nhập địa chỉ.";
  if (!Array.isArray(payload.products) || payload.products.length === 0)
    return "Đơn hàng phải có ít nhất 1 sản phẩm.";
  const prod = payload.products[0];
  if (!prod.pid) return "Thiếu mã sản phẩm.";
  if (!prod.pname) return "Thiếu tên sản phẩm.";
  if (typeof prod.pprice !== "number" || prod.pprice <= 0)
    return "Giá sản phẩm không hợp lệ.";
  if (typeof prod.quantity !== "number" || prod.quantity <= 0)
    return "Số lượng sản phẩm phải lớn hơn 0.";
  return "";
}
