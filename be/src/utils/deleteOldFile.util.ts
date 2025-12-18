import cloudinary from "../config/cloudinary";

type DeleteOldFile = "image" | "video";

export const deleteOldFile = async (publicId: string, resourceType: DeleteOldFile = "image") => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};
