import { FormDataType, TripData, TripInfo } from "../types/trip";
import { ArrangeType } from "../types/type";
import { bookTicketAPI } from "./customize.service";

export const getFormData = async () => {
  try {
    const response = await bookTicketAPI.get<FormDataType>("/trips/form-data");
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy dữ liệu form chuyến đi");
  }
};

export const addTrip = async (data: object) => {
  try {
    const response = await bookTicketAPI.post("/trips", data);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi thêm chuyến đi");
  }
};

export const getAllTrip = async ({
  offset,
  limit,
  arrangeType,
  licensePlateSearch,
}: {
  offset: number;
  limit: number;
  arrangeType: ArrangeType;
  licensePlateSearch: string;
}) => {
  try {
    const response = await bookTicketAPI.get<{ data: TripData[]; total: number }>(
      `/trips?license_plate=${licensePlateSearch}&offset=${offset}&limit=${limit}&arrangeType=${arrangeType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy danh sách chuyến đi");
  }
};

export const fetchTrip = async (id: string) => {
  try {
    const response = await bookTicketAPI.get<TripInfo>(`/trips/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Lỗi khi lấy chi tiết chuyến đi");
  }
};
