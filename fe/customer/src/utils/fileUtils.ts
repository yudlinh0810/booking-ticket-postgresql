/**
 * Đọc File và trả về Data URL (Base64 string), Text, hoặc ArrayBuffer.
 * @param file Đối tượng File cần đọc.
 * @param type Loại đọc file: 'dataURL', 'text', hoặc 'arrayBuffer'.
 * @returns Promise<string | ArrayBuffer> - Chuỗi Base64, chuỗi document, hoặc ArrayBuffer của file.
 */

export type ReadType = "dataURL" | "text" | "arrayBuffer";

export const readFile = (file: File, type: ReadType): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      // FileReader.result có thể là string hoặc ArrayBuffer
      if (reader.result !== null) {
        // Kiểm tra null thay vì chỉ kiểm tra truthiness
        resolve(reader.result);
      } else {
        reject(new Error("File đọc không có nội dung (reader.result là null)."));
      }
    };

    reader.onerror = () => {
      reject(reader.error || new Error("Lỗi khi đọc file."));
    };

    switch (type) {
      case "dataURL":
        reader.readAsDataURL(file);
        break;
      case "text":
        reader.readAsText(file);
        break;
      case "arrayBuffer":
        reader.readAsArrayBuffer(file);
        break;
      default:
        reject(new Error("Loại đọc file không hợp lệ."));
    }
  });
};
