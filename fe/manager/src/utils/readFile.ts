export type ReadType = "dataURL" | "text" | "arrayBuffer";

export const readFile = (file: File, type: ReadType = "dataURL"): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string | ArrayBuffer);

    switch (type) {
      case "dataURL":
        reader.readAsDataURL(file); // Trả về base64 string
        break;
      case "text":
        reader.readAsText(file); // Trả về text (dùng cho .txt, .csv, .json, ...)
        break;
      case "arrayBuffer":
        reader.readAsArrayBuffer(file); // Trả về ArrayBuffer (binary)
        break;
      default:
        reject(new Error(`Unsupported read type: ${type}`));
    }
  });
};
