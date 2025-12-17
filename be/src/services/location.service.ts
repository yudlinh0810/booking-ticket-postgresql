import { ResultSetHeader } from "mysql2";
import GeocodingService from "./geocoding.service";
import prisma from "@/config/prisma";

const geocodingService = new GeocodingService();
export class LocationService {
  add = async (newLocation: string): Promise<{ status: string; message: string }> => {
    try {
      if (!newLocation) throw { message: "Name location null!" };
      const { latitude, longitude } = await geocodingService.getCoordinates(newLocation);
      const addLocation = await prisma.location.create({
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
}
