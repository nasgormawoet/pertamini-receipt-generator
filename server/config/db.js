const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../data/data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Berhasil terhubung ke database SQLite SPBU.');
        db.serialize(() => {
            // Tabel SPBU
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

            // Tabel Fuels (BBM & Subsidi)
            db.run(`CREATE TABLE IF NOT EXISTS fuels (
                                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         name TEXT NOT NULL,
                                                         originalPrice INTEGER NOT NULL DEFAULT 0,
                                                         subsidi INTEGER NOT NULL DEFAULT 0,
                                                         price INTEGER NOT NULL DEFAULT 0
                    )`, (err) => {
                if (err) {
                    console.error('Gagal membuat tabel fuels:', err.message);
                    return;
                }

                // Cek apakah tabel fuels masih kosong, jika kosong isi data awal (seed)
                db.get('SELECT COUNT(*) as count FROM fuels', [], (err, row) => {
                    if (!err && row && row.count === 0) {
                        const initialFuels = [
                            ['PERTALITE (RON 90)', 15892, 5892, 10000],
                            ['BIO SOLAR', 12100, 5300, 6800],
                            ['PERTAMAX (RON 92)', 12950, 0, 12950],
                            ['PERTAMAX TURBO (RON 98)', 14400, 0, 14400],
                            ['DEXLITE (CN 51)', 14550, 0, 14550],
                            ['PERTAMINA DEX (CN 53)', 15100, 0, 15100],
                        ];

                        const stmt = db.prepare(
                            'INSERT INTO fuels (name, originalPrice, subsidi, price) VALUES (?, ?, ?, ?)'
                        );
                        initialFuels.forEach((fuel) => {
                            stmt.run(fuel);
                        });
                        stmt.finalize();
                        console.log('Data awal BBM berhasil ditambahkan.');
                    }
                });
            });
        });

        console.log('Tabel spbu, operators, footers, dan fuels siap digunakan.');
    }
});

module.exports = db;