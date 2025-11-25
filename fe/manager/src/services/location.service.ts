import { toast } from "react-toastify";
import { bookTicketAPI } from "./customize.service";
import { LocationType } from "../types/location";

export const addLocation = async (newLocation: { newValue: string }) => {
  try {
    const response = await bookTicketAPI.post(`/locations`, newLocation);
    if (response.data.status === "OK") {
      toast.success("Thêm địa điểm mới thành công");
    } else {
      toast.error("Thêm địa điểm mới thất bại"); // Đổi sang error toast
    }
    return response.data;
  } catch (error) {
    toast.error("Lỗi khi thêm địa điểm");
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm địa điểm");
  }
};

export const deleteLocation = async (id: number) => {
  try {
    const response = await bookTicketAPI.delete(`/locations/${id}`);
    if (response.data.status === "OK") {
      toast.success("Xóa địa điểm thành công");
    } else {
      toast.error("Xóa địa điểm thất bại"); // Đổi sang error toast
    }
    return response.data;
  } catch (error) {
    toast.error("Lỗi khi xóa địa điểm");
    throw new Error(error instanceof Error ? error.message : "Lỗi khi xóa địa điểm");
  }
};

export const getAllLocation = async () => {
  try {
    const response = await bookTicketAPI.get<LocationType[]>(`/locations`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách địa điểm");
  }
};
