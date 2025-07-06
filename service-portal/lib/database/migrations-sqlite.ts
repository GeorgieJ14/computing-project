import { dbSqlite } from "@/lib/database/db-sqlite";

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createTicketsTable = `
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`;

export const migrateSqlite = () => {
  dbSqlite.serialize(() => {
    // Create users table
    dbSqlite.run(createUsersTable, (err: Error) => {
      if (err) {
        console.error("Error creating users table: ", err.message);
        return;
      }
      console.log("Users table created or already exists.");
    });
    // Create tickets table
    dbSqlite.run(createTicketsTable, (err: Error) => {
      if (err) {
        console.error("Error creating tickets table: ", err.message);
        return;
      }
      console.log("Tickets table created or already exists.");
    });
  });
}
