import * as mysql from "mysql2/promise";
import * as readline from "readline/promises";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import { hash } from "@node-rs/argon2";

// Load environment variables from .env file
dotenv.config();

// Create a MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

function generateRandomId(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// generate hash password
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
      "Enter admin avatar URL (or leave blank): ",
    );

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Insert the admin data using raw MySQL2 query
    const [result] = await pool.query(
      `INSERT INTO admin (id, first_name, last_name, phone_number, user_name, email, password_hash, avatar) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generateRandomId(),
        firstName,
        lastName,
        phoneNumber,
        username,
        email,
        passwordHash,
        avatar || null, // Optional avatar
      ],
    );

    console.log("Admin initialized successfully", result);
  } catch (error) {
    console.error("Error initializing admin:", error);
  } finally {
    // Close the readline interface
    rl.close();
    pool.end(); // Close the MySQL connection
  }
}

initializeAdmin();
