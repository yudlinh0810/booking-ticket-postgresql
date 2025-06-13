import { FormDataTicket } from "../pages/BookedPage";

export const validateFormData = (
  userEmail: string | undefined,
  formDataTicket?: FormDataTicket
): { valid: boolean; message?: string } => {
  if (!userEmail) {
    return { valid: false, message: "Bạn cần đăng nhập để tiếp tục" };
  }

  if (!formDataTicket) {
    return { valid: false, message: "Bạn chưa có đầy đủ thông tin" };
  }

  if (formDataTicket.seats.length === 0) {
    return { valid: false, message: "Bạn chưa chọn bất kỳ ghế nào" };
  }

  const { id, email, fullName, phone } = formDataTicket.user;
  if (!id || !email || !fullName || !phone) {
    return { valid: false, message: "Bạn chưa nhập thông tin người sẽ nhận vé" };
  }

  return { valid: true };
};
