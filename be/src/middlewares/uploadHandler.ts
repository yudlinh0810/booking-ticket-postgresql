// File Middleware đã đồng bộ

import { Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.util";
import { uploadImages, uploadVideo } from "./multerConfig";
import deleteOldFile from "../utils/deleteOldFile.util";
import { validateFile } from "../utils/validateFile.util";
import { UploadApiResponse } from "cloudinary";
import {
  CloudinaryAsset,
  RequestWithFileMetadata,
  RequestWithProcessedFiles,
  RequestWithUploadedImage,
} from "../@types/interface";

const uploadVideoToCloudinary = async (
  req: RequestWithFileMetadata,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
    }

    let bodyData;
    try {
      bodyData = JSON.parse(req.body?.data || "{}");
    } catch (error) {
      res.status(400).json({ message: "Invalid JSON data format" });
    }

    const { id, public_video_id } = bodyData;
    if (!id) res.status(400).json({ message: "Missing Trip id" });

    const folder = `booking-ticket/bus/trip/${id}`;

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      folder,
      ["mp4", "avi", "mov", "mkv"],
      "video"
    );

    // Delete old video if exists
    if (public_video_id) {
      await deleteOldFile(public_video_id, "video");
    }

    req.file.cloudinaryFile = {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
    } as CloudinaryAsset; // Ép kiểu tường minh

    next();
  } catch (error) {
    console.error("Upload video error:", error);
    res.status(500).json({ message: "Error uploading video to Cloudinary" });
  }
};

const uploadImagesToCloudinary = async (
  req: RequestWithProcessedFiles,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const files = req.files as Express.Multer.File[];
    const data = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
    const indexIsMain = Number(data?.indexIsMain ?? -1);
    const folder = "book-bus-ticket/images/car";
    const allowedFormats = ["png", "jpg", "jpeg"];

    const validFiles = files.filter((file) => validateFile(file.originalname, "image"));

    if (validFiles.length !== files.length) {
      console.warn("Some files were ignored due to invalid format.");
      res.status(400).json({ message: "Some files have invalid format" });
      return;
    }

    if (validFiles.length === 0) {
      console.warn("Some files were ignored due to invalid format.");
    }

    const uploadImages = await Promise.all(
      validFiles.map(async (file, index) => {
        const result = await uploadToCloudinary(file.buffer, folder, allowedFormats, "image");

        return {
          ...result,
          originIndex: index,
        } as CloudinaryAsset; // Ép kiểu tường minh
      })
    );

    req.processedFiles = uploadImages.map((image) => ({
      ...image,
      isMain: image.originIndex === indexIsMain ? 1 : 0,
    })) as CloudinaryAsset[];

    return next();
  } catch (error) {
    console.error("Upload Images error:", error);
    res.status(500).json({ message: "Error uploading images to Cloudinary" });
  }
};

const uploadImageToCloudinary = async (
  req: RequestWithUploadedImage,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next();
    }
    let file = req.file as Express.Multer.File;
    const { id, role } = req.user;

    const folder = `images/${role}s/avatar/${id}`;

    const allowedFormats = ["png", "jpg", "jpeg"];

    // Upload image
    if (!validateFile(file.originalname, "image")) {
      throw new Error(
        `Invalid file format: ${file.originalname}, Only jpg, png, jpeg are allowed.`
      );
    }
    const result: UploadApiResponse = await uploadToCloudinary(
      file.buffer,
      folder,
      allowedFormats,
      "image"
    );

    // Gán kết quả upload (đã là UploadApiResponse, kế thừa CloudinaryAsset)
    req.uploadedImage = result as CloudinaryAsset;

    return next();
  } catch (error) {
    console.error("Upload Images error:", error);
    res.status(500).json({ message: "Error uploading images to Cloudinary" });
  }
};

export {
  uploadImages,
  uploadImageToCloudinary,
  uploadImagesToCloudinary,
  uploadVideo,
  uploadVideoToCloudinary,
};
