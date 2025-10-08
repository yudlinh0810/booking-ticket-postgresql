import { ResultSetHeader } from "mysql2";
import { FormDataTicket } from "../models/ticket";
import { DataUpdateTicket, searchTicket } from "../@types/ticket";
import { ArrangeType } from "../@types/type";
import { PaymentStatus, PaymentType } from "../@types/payment";

interface TicketSearchParams {
  arrangeType: ArrangeType;
  transactionId?: string;
  phone?: string;
  paymentStatus?: PaymentStatus;
  paymentType?: PaymentType;
}

export class TicketService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  add = async (newTicket: FormDataTicket) => {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();

      const { tripId, price, seats, user } = newTicket;
      const valuesTicket = [
        tripId,
        seats.map((s) => s.position).join("-"),
        user.id,
        user.email,
        user.fullName,
        user.phone || "",
        price,
      ];
      const [resultTrip] = (await conn.execute(
        "call create_ticket(?, ?, ?, ?, ?, ?, ?)",
        valuesTicket
      )) as [ResultSetHeader];

      const newTicketId = resultTrip[0][0].ticketId;

      if (!newTicketId) {
        await conn.rollback();
        return {
          status: "ERR",
          message: "Create ticket failed",
        };
      }

      await conn.commit();

      return {
        status: "OK",
        message: "Add ticket success",
        ticket: newTicketId,
      };
    } catch (error) {
      await conn.rollback();
      return {
        status: "ERR",
        message: "Unexpected server error",
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      conn.release();
    }
  };

  getDetailTicket(data: searchTicket): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const { phone, idTicket } = data;

        const sql = "call getDetailTicket(?, ?)";
        const values = [phone, idTicket];

        const [rows] = (await this.db.execute(sql, values)) as [ResultSetHeader];
        if (rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Ticket not found",
          });
        }
        resolve({
          status: "OK",
          data: rows[0][0],
        });
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  getDetailTicketByEmail(email: string): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "CALL getDetailTicketByEmail(?)";

        const [rows] = (await this.db.execute(sql, [email])) as [any[]];

        if (!rows || rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Ticket not found",
          });
          return;
        }
        resolve(rows[0]);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  getDetailTicketById(id: number): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "CALL get_ticket_by_id(?)";

        const [rows] = (await this.db.execute(sql, [id])) as [any[]];
        console.log("rows", rows[0][0]);

        if (!rows || rows[0].length === 0) {
          resolve({
            status: "ERR",
            message: "Ticket not found",
          });
          return;
        }
        resolve(rows[0][0]);
      } catch (error) {
        console.log("Err Service.getDetail", error);
        reject(error);
      }
    });
  }

  deleteById(id: number): Promise<{ status: "ERR" | "OK"; message?: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "call delete_ticket(?)";

        const [rows] = (await this.db.execute(sql, [id])) as [ResultSetHeader];

        if (rows.affectedRows <= 0) {
          resolve({
            status: "ERR",
            message: "Ticket not found",
          });
        }
        resolve({
          status: "OK",
        });
      } catch (error) {
        console.log("Err Service.deleteById", error);
        reject(error);
      }
    });
  }

  getTotalTicket = async (ticketSearchParams: TicketSearchParams) => {
    const { transactionId, phone, paymentStatus, paymentType } = ticketSearchParams;
    const [rows] = await this.db.execute(`CALL get_total_tickets(?, ?, ?, ?)`, [
      transactionId,
      phone,
      paymentStatus,
      paymentType,
    ]);
    const total = rows[0]?.[0]?.total || 0;
    return total;
  };

  public getAll = async (limit: number, offset: number, ticketSearchParams: TicketSearchParams) => {
    try {
      const { arrangeType, transactionId, phone, paymentStatus, paymentType } = ticketSearchParams;
      const total = await this.getTotalTicket(ticketSearchParams);
      const [rows] = await this.db.execute(`call get_tickets(?, ?, ?, ?, ?, ?, ?)`, [
        limit,
        offset,
        arrangeType,
        transactionId,
        phone,
        paymentStatus,
        paymentType,
      ]);
      if (rows.length > 0) {
        return {
          status: "OK",
          message: "Get all ticket success",
          total: total,
          totalPage: Math.ceil(total / limit),
          data: rows[0],
        };
      } else {
        return null;
      }
    } catch (error) {}
  };

  updateById(
    id: number,
    valueUpdate: DataUpdateTicket
  ): Promise<{ status: "ERR" | "OK"; message?: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "call update_ticket(?, ?, ?)";

        const [rows] = (await this.db.execute(sql, [
          id,
          valueUpdate.paymentType,
          valueUpdate.paymentStatus,
        ])) as [ResultSetHeader];

        if (rows.affectedRows <= 0) {
          resolve({
            status: "ERR",
            message: "Update ticket failed or ticket not found",
          });
        }
        resolve({
          status: "OK",
        });
      } catch (error) {
        console.log("Err Service.updateById", error);
        reject(error);
      }
    });
  }
}

export default TicketService;
