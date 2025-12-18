import { Resend } from "resend";
import { DataPaymentSuccess } from "@/@types/payment";
import generateQRCodeBase64 from "@/utils/generateQRCodeBase64";
import { formatDate } from "@/utils/formatDate";
import formatCurrency from "@/utils/formatCurrency";

// Khởi tạo Resend với API Key từ file .env
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOtpEmailParams {
  email: string;
  otp: string;
}

export class EmailService {
  /**
   * Gửi OTP xác thực email
   */
  async sendOtpEmail({ email, otp }: SendOtpEmailParams) {
    try {
      const { data, error } = await resend.emails.send({
        from: "Vexetienich <support@yudlinh.com>",
        to: email,
        replyTo: "nhdl0810@gmail.com",
        subject: "Thông tin xác thực email",
        html: this.getBodyHTMLEmail(otp),
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Resend OTP Error:", error);
      throw error;
    }
  }

  getBodyHTMLEmail(otp: string): string {
    return `
      <div style="font-family: sans-serif;">
        <h3>Mã xác thực email: Có thời hạn 5 phút!</h3>
        <p>Vui lòng nhập mã sau để xác minh:</p>
        <div style="font-size: 1.5rem; color: #007bff;"><b>${otp}</b></div>
        <p>Xin chân thành cảm ơn!</p>
      </div>
    `;
  }

  /**
   * Gửi vé xe kèm mã QR (Attachment)
   */
  async sendTicketEmail(data: DataPaymentSuccess[]) {
    try {
      // Tạo danh sách attachments cho Resend
      const attachments = await Promise.all(
        data.map(async (ticket, index) => {
          const qrBase64 = await generateQRCodeBase64(ticket.id + ticket.seatPosition);
          // Resend yêu cầu base64 không có tiền tố "data:image/png;base64,"
          const base64Content = qrBase64.replace(/^data:image\/png;base64,/, "");

          return {
            filename: `qrcode-${ticket.id}-${ticket.seatPosition}.png`,
            content: base64Content,
            content_id: `qr-code-${index}`, // Tương đương với CID để hiển thị trong <img>
          };
        })
      );

      const htmlContent = await this.getBodyHTMLTicketEmail(data);

      const { data: resData, error } = await resend.emails.send({
        from: "Vexetienich <support@yudlinh.com>",
        to: data[0].email,
        replyTo: "nhdl0810@gmail.com",
        subject: "Thông tin vé xe",
        html: htmlContent,
        attachments: attachments,
      });

      if (error) throw error;
      return resData;
    } catch (error) {
      console.error("Resend Ticket Error:", error);
      throw error;
    }
  }

  async getBodyHTMLTicketEmail(data: DataPaymentSuccess[]): Promise<string> {
    const totalPrice = formatCurrency(data.reduce((sum, tk) => sum + Number(tk.price), 0));
    const ticketItems = await Promise.all(
      data.map((ticket, index) => this.generateTicketItemHTML(ticket, index))
    );

    return `
      <div style="width: 100%; text-align: left; padding: 1rem 0; font-family: sans-serif;">
        <h2 style="font-size: 1.8rem; font-weight: 600; color: #003366;">Mua vé xe thành công</h2>
        <p>Thông tin vé xe từ Vexetienich</p>
        <table cellpadding="0" cellspacing="0" width="600" align="center" style="border: 1px solid #ccc; margin-top: 1rem;">
          <tr>
            <td style="background-color: #e6f0ff; padding: 1rem;" colspan="2">
              <h3 style="font-size: 1.2rem; font-weight: 600;">Thông tin vé</h3>
            </td>
          </tr>
          <tr>
            <td style="padding: 1rem; vertical-align: top; width: 50%;">
              <p><strong>Họ và tên:</strong> ${data[0].fullName}</p>
              <p><strong>Số điện thoại:</strong> ${data[0].phone}</p>
              <p><strong>Email:</strong> ${data[0].email}</p>
            </td>
            <td style="padding: 1rem; vertical-align: top; width: 50%;">
              <p><strong>Tổng giá vé:</strong> ${totalPrice}</p>
              <p><strong>PTTT:</strong> Banking</p>
              <p><strong>Trạng thái:</strong> Thanh toán thành công</p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 1rem; text-align: center;">
              ${ticketItems.join("")}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  async generateTicketItemHTML(t: DataPaymentSuccess, index: number): Promise<string> {
    return `
      <table cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #007bff; border-radius: 6px; margin: 1rem 0; font-size: 14px;">
        <tr>
          <td colspan="2" style="padding: 0.5rem;"><h3 style="margin: 0; color: #003366;">Mã vé ${
            t.id
          }${t.seatPosition}</h3></td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; padding: 1rem;">
            <img src="cid:qr-code-${index}" alt="QR Code" style="width: 150px; height: 150px; display: block; margin: 0 auto;" />
          </td>
        </tr>
        <tr><td style="padding: 0.5rem;">Tuyến xe:</td><td style="padding: 0.5rem; color: #003366;">${
          t.departure
        } - ${t.arrival}</td></tr>
        <tr><td style="padding: 0.5rem;">Thời gian:</td><td style="padding: 0.5rem; color: #003366;">${formatDate(
          t.startTime,
          "DD-MM-YYYY-HH:mm"
        )}</td></tr>
        <tr><td style="padding: 0.5rem;">Số ghế:</td><td style="padding: 0.5rem; color: #003366;">${
          t.seatPosition
        }</td></tr>
      </table>
    `;
  }

  /**
   * Gửi link đặt lại mật khẩu
   */
  async sendLinkResetPassword(email: string, token: string) {
    try {
      const resetLink = `${process.env.URL_FRONTEND_CLIENT}/reset-password?token=${token}`;
      const { data, error } = await resend.emails.send({
        from: "Vexetienich <support@yudlinh.com>",
        to: email,
        replyTo: "nhdl0810@gmail.com",
        subject: "Yêu cầu đặt lại mật khẩu",
        html: `
          <div style="font-family: sans-serif; padding: 1rem; border: 1px solid #2eb4fc; display: flex; flex-direction: column; gap: 1rem;">
            <h3>Yêu cầu đặt lại mật khẩu</h3>
            <p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
            <div style="display: flex; justify-content: center; background: #007bff; padding: 10px; border-radius: 1rem; width: fit-content;">
              <a href="${resetLink}" style=" color: white;  text-decoration: none;  display: inline-block;">Đặt lại mật khẩu</a>
            </div>
            <p>Liên kết này sẽ hết hạn trong 15 phút.</p>
            <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
          </div>
        `,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Resend Reset Password Error:", error);
      throw error;
    }
  }
}
