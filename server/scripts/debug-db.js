require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const books = await pool.query("SELECT * FROM \"Book\"");
  console.log("Books:", books.rows.map(b => b.id));
  process.exit(0);
}
main().catch(console.error);
