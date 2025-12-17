import dotenv from "dotenv";
import nodemailer, { SentMessageInfo, Transporter } from "nodemailer";
import { DataPaymentSuccess } from "@/@types/payment";
import generateQRCodeBase64 from "@/utils/generateQRCodeBase64";
import { formatDate } from "@/utils/formatDate";
import formatCurrency from "@/utils/formatCurrency";

dotenv.config();

interface SendOtpEmailParams {
  email: string;
  otp: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for others
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendOtpEmail({ email, otp }: SendOtpEmailParams): Promise<SentMessageInfo> {
    try {
      const info = await this.transporter.sendMail({
        to: email,
        subject: "Thông tin xác thực email",
        html: this.getBodyHTMLEmail(otp),
      });

      return info;
    } catch (error) {
      throw error;
    }
  }

  getBodyHTMLEmail(otp: string): string {
    return `
      <h3>Mã xác thực email: Có thời hạn 5 phút!</h3>
      <p>Vui lòng nhập mã sau để xác minh:</p>
      <div><b>${otp}</b></div>
      <div>Xin chân thành cảm ơn!</div>
    `;
  }

  async sendTicketEmail(data: DataPaymentSuccess[]): Promise<SentMessageInfo> {
    try {
      // Tạo danh sách attachments từ QR code
      const attachments = await Promise.all(
        data.map(async (ticket, index) => {
          const qrBase64 = await generateQRCodeBase64(ticket.id + ticket.seatPosition);
          return {
            filename: `qrcode-${ticket.id}-${ticket.seatPosition}.png`,
            content: qrBase64.replace(/^data:image\/png;base64,/, ""),
            encoding: "base64",
            cid: `qr-code-${index}`,
          };
        })
      );

      const htmlContent = await this.getBodyHTMLTicketEmail(data);

      // Gửi mail kèm attachments
      const info = await this.transporter.sendMail({
        to: data[0].email,
        subject: "Thông tin vé xe",
        html: htmlContent,
        attachments: attachments,
      });

      return info;
    } catch (error) {
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
        <h2 style="font-size: 1.8rem; font-weight: 600; color: #003366;">
          Mua vé xe thành công
        </h2>
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
          <tr>
            <td colspan="2" style="text-align: center; padding: 1rem;">
              <a href="#" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 16px; text-decoration: none; margin-right: 10px; border-radius: 4px;">Chia sẻ</a>
              <a href="#" style="display: inline-block; background-color: #28a745; color: white; padding: 10px 16px; text-decoration: none; border-radius: 4px;">Tải xuống</a>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  async generateTicketItemHTML(t: DataPaymentSuccess, index: number): Promise<string> {
    try {
      return `
        <table cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #007bff; border-radius: 6px; margin: 1rem 0; font-size: 14px;">
          <tr>
            <td colspan="2" style="padding: 0.5rem;">
              <h3 style="margin: 0; color: #003366;">Mã vé ${t.id}${t.seatPosition}</h3>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center; padding: 1rem;">
              <img src="cid:qr-code-${index}" alt="QR Code" style="width: 150px; height: 150px; display: block; margin: 0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 0.5rem;">Tuyến xe:</td>
            <td style="padding: 0.5rem; color: #003366;">${t.departure} - ${t.arrival}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem;">Thời gian:</td>
            <td style="padding: 0.5rem; color: #003366;">${formatDate(
              t.startTime,
              "DD-MM-YYYY-HH:mm"
            )}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem;">Số ghế:</td>
            <td style="padding: 0.5rem; color: #003366;">${t.seatPosition}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem;">Điểm lên xe:</td>
            <td style="padding: 0.5rem; color: #003366;">Bến xe ${t.departure}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem;">Giá vé:</td>
            <td style="padding: 0.5rem; color: #003366;">${formatCurrency(t.price)}</td>
          </tr>
        </table>
      `;
    } catch (error) {
      console.error("Error generating ticket HTML:", error);
      return "<p>Lỗi tạo vé</p>";
    }
  }

  async sendLinkResetPassword(email: string, token: string): Promise<SentMessageInfo> {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      const info = await this.transporter.sendMail({
        to: email,
        subject: "Yêu cầu đặt lại mật khẩu",
        html: `
          <div styles="font-family: sans-serif; padding: 1rem; border: 1px solid #2eb4fc; display: flex; flex-direction: column; gap: 1rem;">
            <h3>Yêu cầu đặt lại mật khẩu</h3>
            <p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
            <a href="${resetLink}">Đặt lại mật khẩu</a>
            <p>Liên kết này sẽ hết hạn trong 15 phút.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <div>Xin chân thành cảm ơn!</div>
          </div>

        `,
      });
      return info;
    } catch (error) {
      throw error;
    }
  }
}
