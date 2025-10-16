/*
  Warnings:

  - A unique constraint covering the columns `[ticket_id,seat_id]` on the table `ticket_seat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ticket_seat_ticket_id_seat_id_key" ON "ticket_seat"("ticket_id", "seat_id");
