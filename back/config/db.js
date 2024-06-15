require('dotenv').config();
const mysql = require('mysql2/promise');

// Параметри підключення до MySQL сервера
const dbConfig = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    // Створення бази даних, якщо вона не існує
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`База даних '${dbConfig.database}' успішно створена або вже існує`);

    // Підключення до новоствореної бази даних
    await connection.changeUser({ database: dbConfig.database });

    // Створення таблиці tasks, якщо вона не існує
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY,
        body TEXT NOT NULL
      )
    `;

    await connection.query(createTableQuery);
    console.log('Таблиця tasks успішно створена або вже існує');

    await connection.end();
  } catch (err) {
    console.error('Помилка при іниціалізації бази даних:', err);
    throw err;
  }
}

// Виклик `initializeDatabase` під час імпорту модуля
initializeDatabase();

const pool = mysql.createPool(dbConfig);

module.exports = pool;
