// src/hooks/useFilePreview.ts
import { useState, useEffect } from "react";

/**
 * Custom Hook để tạo URL tạm thời cho file (dùng createObjectURL) và tự động dọn dẹp (revokeObjectURL).
 * @param file Đối tượng File để tạo preview.
 * @returns Chuỗi URL tạm thời hoặc undefined.
 */
export const useFilePreview = (file: File | undefined | null): string | undefined => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  useEffect(() => {
    // Kiểm tra nếu không có file hoặc file là null
    if (!file) {
      setPreviewUrl(undefined);
      return;
    }

    // Tạo URL object
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Hàm cleanup: Giải phóng bộ nhớ khi component unmount
    // hoặc khi 'file' thay đổi (người dùng chọn file mới)
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]); // Dependency là 'file'

  return previewUrl;
};
