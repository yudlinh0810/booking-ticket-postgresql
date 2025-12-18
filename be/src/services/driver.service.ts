import prisma from "@/config/prisma";
import { CreateDriverDto } from "@/users/dto/create/create-driver.dto";
import { UpdateDriverDto } from "@/users/dto/update/update-driver.dto";

export class DriverService {
  create = async (newData: CreateDriverDto) => {
    try {
    } catch (error) {}
  };

  updateDriverDetails = async (newData: CreateDriverDto) => {
    try {
    } catch (error) {
      throw error;
    }
  };

  updateByAdmin = async (updateData: UpdateDriverDto) => {
    try {
    } catch (error) {
      throw error;
    }
  };

  delete = async (newData: CreateDriverDto) => {
    try {
    } catch (error) {
      throw error;
    }
  };
}
