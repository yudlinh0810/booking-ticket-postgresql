import QRCode from "qrcode";

const generateQRCodeBase64 = async (text: string): Promise<string> => {
  try {
    const base64 = await QRCode.toDataURL(text, {
      width: 150,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    console.log("QR content:", text);
    console.log("QR base64 length:", base64.length);
    console.log("QR base64 starts with:", base64.slice(0, 30));

    // Kiểm tra xem có phải là data URL hợp lệ không
    if (!base64.startsWith("data:image/png;base64,")) {
      throw new Error("Invalid data URL format");
    }

    return base64;
  } catch (err) {
    console.error("Lỗi tạo QR:", err);
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="; // 1x1 transparent fallback
  }
};

export default generateQRCodeBase64;
