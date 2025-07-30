import { join } from "path";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";

const dbPath = join(process.cwd(), "lib/database/db.sqlite3");
export const dbSqlite = new Database(dbPath, OPEN_READWRITE | OPEN_CREATE, (err) => {
  if (err) {
    console.error("Error opening database: ", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});
