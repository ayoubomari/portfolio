import { Pool } from "pg"; // PostgreSQL client
import * as readline from "readline/promises";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import { hash } from "@node-rs/argon2";

// Load environment variables from .env file
dotenv.config();

// Create a PostgreSQL connection pool using environment variables
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 5432, // Default PostgreSQL port
  ssl: false, // Optional SSL
});

function generateRandomId(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// Generate hash password using Argon2
async function hashPassword(password: string): Promise<string> {
  try {
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    console.log("Generated hash:", passwordHash);
    return passwordHash;
  } catch (error) {
    console.error("Error generating hash:", error);
    throw error;
  }
}

async function initializeAdmin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // Prompt for all admin information
    const firstName = await rl.question("Enter admin first name: ");
    const lastName = await rl.question("Enter admin last name: ");
    const phoneNumber = await rl.question("Enter admin phone number: ");
    const username = await rl.question("Enter admin username: ");
    const email = await rl.question("Enter admin email: ");
    const password = await rl.question("Enter admin password: ");
    const avatar = await rl.question(
      "Enter admin avatar URL (or leave blank): "
    );

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Insert the admin data using parameterized PostgreSQL query
    const query = `
      INSERT INTO admin (
        id, first_name, last_name, phone_number, user_name, email, password_hash, avatar
      ) 
      VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8)
      RETURNING *;
    `;
    const values = [
      generateRandomId(),
      firstName,
      lastName,
      phoneNumber,
      username,
      email,
      passwordHash,
      avatar || null, // Optional avatar
    ];

    console.log("passwordHash", passwordHash);
    // const result = await pool.query(query, values);

    // console.log("Admin initialized successfully:", result.rows[0]);
  } catch (error) {
    console.error("Error initializing admin:", error);
  } finally {
    // Close the readline interface
    rl.close();
    // End the PostgreSQL pool
    await pool.end();
  }
}

initializeAdmin();