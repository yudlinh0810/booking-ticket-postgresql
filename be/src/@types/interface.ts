import { Request } from "express";
import { UploadApiResponse } from "cloudinary";

export interface CloudinaryAsset extends UploadApiResponse {
  originIndex?: number;
  isMain?: 1 | 0;
}

/**
 * Dùng cho middleware upload một file
 */
export interface RequestWithUploadedImage extends Request {
  uploadedImage: CloudinaryAsset;
}

/**
 * Dùng cho middleware upload một file đơn lẻ
 * - file: là thuộc tính gốc của Multer.
 * - cloudinaryFile: thuộc tính tùy chỉnh để gán kết quả upload.
 */
export interface RequestWithFileMetadata extends Request {
  file?: Express.Multer.File & { cloudinaryFile?: CloudinaryAsset };
}

/**
 * Dùng cho middleware upload nhiều file
 */
export interface RequestWithProcessedFiles extends Request {
  processedFiles: CloudinaryAsset[];
  processedFile?: CloudinaryAsset;
}

export interface UploadedFile extends Express.Multer.File {
  cloudinaryImages?: CloudinaryAsset;
}
