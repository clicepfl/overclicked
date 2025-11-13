"use server";

import fs from "node:fs";
import Database from "better-sqlite3";

export interface Order {
  id: number;
  amounts: number[];
  register: string;
  prepared: boolean;
  served: boolean;
  canceled: boolean;
}

export interface Menu {
  name: string;
  description: string;
  totalStocks: number;
  stocks: number;
}

const DB_PATH = process.env["OVERCLICKED_DB_DIR"] + "/db.sqlite";
const DB_DOWNLOAD_FILENAME = "overclicked_db_backup.sqlite";

function runOnDb<T>(func: (db: Database.Database) => T) {
  const db = Database(DB_PATH);
  db.exec(fs.readFileSync("migration.sql").toString());
  const res = db.transaction(func)(db);
  db.close();
  return res;
}

function parseOrders(orders: any): Order[] {
  return orders.map(parseOrder);
}

function parseOrder(order: any): Order {
  return { ...order, amounts: JSON.parse(order.amounts) };
}

export const addOrder = async (amounts: number[], register: string) =>
  runOnDb((db) => {
    for (let i = 0; i < amounts.length; i++) {
      db.prepare("UPDATE menus SET stocks = stocks - ? WHERE id = ?;").run([
        amounts[i],
        i,
      ]);
    }

    const menus = db.prepare("SELECT * FROM menus").all() as Menu[];
    if (menus.some((m, i) => m.stocks < 0)) {
      throw new Error("Not enough stocks");
    }

    parseOrder(
      db
        .prepare(
          "INSERT INTO orders(amounts, register) VALUES(?, ?) RETURNING *"
        )
        .get([JSON.stringify(amounts), register])
    );
  });

export const getOrders = async () =>
  runOnDb((db) => parseOrders(db.prepare("SELECT * FROM orders").all()));

export const getOrdersToPrepare = async () =>
  runOnDb((db) =>
    parseOrders(
      db
        .prepare(
          "SELECT * FROM orders WHERE canceled = false AND prepared = false;"
        )
        .all()
    )
  );

export const getOrdersToServe = async (register: string) =>
  runOnDb((db) =>
    parseOrders(
      db
        .prepare(
          "SELECT * FROM orders WHERE canceled = false AND prepared = true AND served = false AND register = ?;"
        )
        .all([register])
    )
  );

export const markAsPrepared = async (id: number) =>
  runOnDb((db) =>
    db.prepare("UPDATE orders SET prepared = true WHERE id = ?;").run([id])
  );
export const markAsNotPrepared = async (id: number) =>
  runOnDb((db) =>
    db.prepare("UPDATE orders SET prepared = false WHERE id = ?;").run([id])
  );

export const markAsServed = async (id: number) =>
  runOnDb((db) =>
    db.prepare("UPDATE orders SET served = true WHERE id = ?;").run([id])
  );
export const markAsNotServed = async (id: number) =>
  runOnDb((db) =>
    db.prepare("UPDATE orders SET served = false WHERE id = ?;").run([id])
  );

export const cancelOrder = async (id: number) =>
  runOnDb((db) => {
    const order = parseOrder(
      db.prepare("SELECT * FROM orders WHERE id = ?;").get([id])
    );

    for (let i = 0; i < order.amounts.length; i++) {
      db.prepare("UPDATE menus SET stocks = stocks + ? WHERE id = ?;").run([
        order.amounts[i],
        i,
      ]);
    }

    db.prepare("UPDATE orders SET canceled = true WHERE id = ?;").run([id]);
  });

export const getMenus = async () =>
  runOnDb((db) => db.prepare("SELECT * FROM menus").all() as Menu[]);

export const addMenuStocks = async (menu: number, stocks: number) =>
  runOnDb((db) =>
    db
      .prepare(
        "UPDATE menus SET stocks = stocks + ?, totalStocks = totalStocks + ? WHERE id = ?;"
      )
      .run([stocks, stocks, menu])
  );

export const downloadDatabase = async () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      throw new Error("Database file not found on server.");
    }
    const fileBuffer = fs.readFileSync(DB_PATH);
    const base64Data = fileBuffer.toString("base64");

    return {
      success: true,
      data: base64Data,
      fileName: DB_DOWNLOAD_FILENAME,
      mimeType: "application/x-sqlite3",
      error: null,
    };
  } catch (e) {
    console.error("Failed to download database file:", e);
    return {
      success: false,
      data: null,
      fileName: DB_DOWNLOAD_FILENAME,
      mimeType: "application/x-sqlite3",
      error: `Failed to download database: ${
        e instanceof Error ? e.message : String(e)
      }`,
    };
  }
};

export const resetDatabase = async () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      // Synchronously delete the file
      fs.unlinkSync(DB_PATH);
      return {
        success: true,
        message: "Database deleted! It will be recreated on next access",
      };
    }
    return {
      success: true,
      message: "Database was already missing",
    };
  } catch (e) {
    console.error("Failed to delete database file:", e);
    throw new Error(
      `Failed to reset database: ${e instanceof Error ? e.message : String(e)}`
    );
  }
};
