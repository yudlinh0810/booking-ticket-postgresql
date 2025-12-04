import { ResultSetHeader } from "mysql2";
import GeocodingService from "./geocoding.service";
import { PrismaClient } from "@prisma/client";
import { redisClient } from "@/config/redis";

const geocodingService = new GeocodingService();
export class LocationService {
  private db;
  private prisma = new PrismaClient();
  constructor(db: any) {
    this.db = db;
  }
  add = async (newLocation: string): Promise<{ status: string; message: string }> => {
    try {
      if (!newLocation) throw { message: "Name location null!" };
      const { latitude, longitude } = await geocodingService.getCoordinates(newLocation);
      const addLocation = await this.prisma.location.create({
        data: {
          name: newLocation,
          latitude: latitude,
          longitude: longitude,
        },
      });

      if (addLocation.id) {
        const locationKey = `location_${addLocation.id}`;
        return {
          status: "OK",
          message: "Add new location success.",
        };
      } else {
      }

      return {
        status: "OK",
        message: "Add new location success.",
      };
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  delete = async (deleteId: number): Promise<{ status: string; message: string }> => {
    try {
      const [rows] = (await this.db.execute("call deleteLocation(?)", [deleteId])) as [
        ResultSetHeader
      ];

      if (rows.affectedRows > 0) {
        return {
          status: "OK",
          message: "Delete location success.",
        };
      }
      return {
        status: "ERR",
        message: "Delete location is not success.",
      };
    } catch (error) {
      throw error;
    }
  };

  // Prisma

  getLocations = async () => {
    try {
      return await this.prisma.location.findMany({
        select: {
          id: true,
          name: true,
          latitude: true,
          longitude: true,
        },
      });
    } catch (error) {
      console.log("error", error);
      throw "Error get locations from prisma";
    }
  };

  getAll = async () => {
    try {
      const [rows] = await this.db.execute("select id, name from location");
      const locationList = await this.getLocations();

      if (locationList) {
        return {
          status: "OK",
          data: rows,
        };
      } else {
        return {
          status: "ERR",
          message: "Location not found.",
        };
      }
    } catch (error) {
      console.log("err", error);
      return {};
    }
  };
}
