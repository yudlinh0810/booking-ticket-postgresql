import QRCode from "qrcode";

const generateQRCodeBase64 = async (text: string): Promise<string> => {
  try {
    const base64 = await QRCode.toDataURL(text);
    console.log("QR content:", text);
    console.log("QR base64:", base64.slice(0, 50)); // in 50 ký tự đầu
    return base64;
  } catch (err) {
    console.error("Lỗi tạo QR:", err);
    return "";
  }
};

export default generateQRCodeBase64;
