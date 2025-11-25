import { UploadApiOptions } from "cloudinary";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

type TypeFile = "image" | "video";

export const uploadToCloudinary = async (
  file: Buffer,
  folder: string,
  allowedFormats: string[],
  typeFile: TypeFile = "image",
  options: Partial<UploadApiOptions> = {}
) => {
  return new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: `book-bus-tickets/${folder}`,
        allowed_formats: allowedFormats,
        resource_type: typeFile,
        transformation:
          typeFile === "image"
            ? [
                { quality: "auto:low" }, // Tự động giảm chất lượng tối ưu
                { fetch_format: "auto" }, // Tự động chọn định dạng (WebP, AVIF,...)
              ]
            : [],
        ...options,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    streamifier.createReadStream(file).pipe(stream);
  });
};
