const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Berhasil terhubung ke database SQLite SPBU.');
        db.serialize(() => {
            // Tabel SPBU (Disesuaikan dengan field dari frontend lama)
            db.run(`CREATE TABLE IF NOT EXISTS spbu (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                spbuNo TEXT NOT NULL,
                spbuName TEXT NOT NULL,
                spbuCity TEXT NOT NULL,
                spbuAddress TEXT NOT NULL
            )`);

            // Tabel Operator
            db.run(`CREATE TABLE IF NOT EXISTS operators (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                defaultShift TEXT NOT NULL
            )`);

            // Tabel Footer
            db.run(`CREATE TABLE IF NOT EXISTS footers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL
            )`);
        });

        console.log('Tabel spbu, operators, dan footers siap digunakan.');
    }
});

module.exports = db;