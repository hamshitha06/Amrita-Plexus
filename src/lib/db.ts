import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "carpool.db");

// Ensure data folder exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'student',
    verified INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS rides (
    id TEXT PRIMARY KEY,
    driver_id TEXT NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    price REAL NOT NULL,
    ride_type TEXT NOT NULL DEFAULT 'Own Car',
    status TEXT NOT NULL DEFAULT 'Available', -- Available, Full, Cancelled, Completed
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ride_bookings (
    id TEXT PRIMARY KEY,
    ride_id TEXT NOT NULL,
    passenger_id TEXT NOT NULL,
    seats_requested INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Accepted, Rejected, Cancelled
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ride_messages (
    id TEXT PRIMARY KEY,
    ride_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    recipient_id TEXT,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ride_reviews (
    id TEXT PRIMARY KEY,
    ride_id TEXT NOT NULL,
    reviewer_id TEXT NOT NULL,
    reviewee_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    recipient_id TEXT NOT NULL,
    ride_id TEXT,
    message TEXT NOT NULL,
    read_status INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Seed Default Users if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (id, name, email, role, verified) VALUES (?, ?, ?, ?, ?)");
  insertUser.run("user_rahul", "Rahul Sharma (Student A)", "rahul@amrita.edu", "student", 1);
  insertUser.run("user_sneha", "Sneha Patel (Student B)", "sneha@amrita.edu", "student", 1);
  insertUser.run("user_anish", "Anish Kumar", "anish@amrita.edu", "student", 1);

  // Seed sample rides
  const insertRide = db.prepare(`
    INSERT INTO rides (id, driver_id, source, destination, date, time, seats, available_seats, price, ride_type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertRide.run("ride_1", "user_rahul", "Campus Main Gate", "Railway Station", "2026-10-15", "10:00", 3, 3, 150, "Own Car", "Available");
  insertRide.run("ride_2", "user_sneha", "Airport", "Campus Hostel 3", "2026-10-16", "18:30", 2, 2, 300, "Taxi", "Available");
}

export default db;
