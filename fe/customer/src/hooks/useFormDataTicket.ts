import { useEffect, useState } from "react";
import { User } from "../types/user";
import { TripBookedInfo } from "../types/trip";
import { FormDataTicket } from "../pages/BookedPage";

export const useFormDataTicket = (user: User | null, tripData: TripBookedInfo | undefined) => {
  const [formDataTicket, setFormDataTicket] = useState<FormDataTicket>();

  // Khi có tripData thì gán tripId
  useEffect(() => {
    if (!tripData) return;

    setFormDataTicket((prev) =>
      prev
        ? { ...prev, tripId: tripData.id }
        : {
            ticketId: 0,
            tripId: tripData.id,
            seats: [],
            price: 0,
            user: { id: 0, email: "", fullName: "", phone: "" },
          }
    );
  }, [tripData]);

  // Khi có user thì gán user.id
  useEffect(() => {
    if (!user?.id) return;

    setFormDataTicket((prev) => (prev ? { ...prev, user: { ...prev.user, id: user.id } } : prev));
  }, [user]);

  return {
    formDataTicket,
    setFormDataTicket,
  };
};
