import mysql from "mysql2/promise";

const sslEnabled = process.env.DB_SSL === "true";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  maxIdle: 5,
  idleTimeout: 60000,
  queueLimit: 0,
  ...(sslEnabled
    ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } }
    : {}),
});
