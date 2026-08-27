import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Database(path.join(__dirname, 'spbu_data.db'));

app.use(cors());
app.use(express.json());

db.exec(`
    CREATE TABLE IF NOT EXISTS spbu_profiles (
                                                 id TEXT PRIMARY KEY,
                                                 spbuNo TEXT UNIQUE NOT NULL,
                                                 spbuName TEXT NOT NULL,
                                                 spbuAddress TEXT NOT NULL,
                                                 spbuCity TEXT NOT NULL,
                                                 spbuPhone TEXT
    );

    CREATE TABLE IF NOT EXISTS operators (
                                             id TEXT PRIMARY KEY,
                                             name TEXT NOT NULL,
                                             defaultShift TEXT DEFAULT '1'
    );

    CREATE TABLE IF NOT EXISTS footer_templates (
                                                    id TEXT PRIMARY KEY,
                                                    title TEXT NOT NULL,
                                                    content TEXT NOT NULL
    );
`);

// 2. Seeder Data Master Otomatis
const seedMasterData = () => {
    // Seeder SPBU
    if (db.prepare('SELECT COUNT(*) as count FROM spbu_profiles').get().count === 0) {
        const insertSpbu = db.prepare(`
            INSERT INTO spbu_profiles (id, spbuNo, spbuName, spbuAddress, spbuCity, spbuPhone)
            VALUES (@id, @spbuNo, @spbuName, @spbuAddress, @spbuCity, @spbuPhone)
        `);
        const initialSpbu = [
            { id: 'spbu-1', spbuNo: '34.12345', spbuName: 'SPBU MT Haryono', spbuAddress: 'JL. MT HARYONO KAV. 20', spbuCity: 'JAKARTA TIMUR', spbuPhone: '021-88997766' },
            { id: 'spbu-2', spbuNo: '54.60102', spbuName: 'SPBU Raya Gubeng', spbuAddress: 'JL. RAYA GUBENG NO. 45', spbuCity: 'SURABAYA', spbuPhone: '031-55443322' }
        ];
        db.transaction((items) => items.forEach((i) => insertSpbu.run(i)))(initialSpbu);
    }

    // Seeder Operator
    if (db.prepare('SELECT COUNT(*) as count FROM operators').get().count === 0) {
        const insertOp = db.prepare(`INSERT INTO operators (id, name, defaultShift) VALUES (@id, @name, @defaultShift)`);
        const initialOps = [
            { id: 'op-1', name: 'EKO S.', defaultShift: '1' },
            { id: 'op-2', name: 'DIMAS A.', defaultShift: '2' },
            { id: 'op-3', name: 'WAHYU P.', defaultShift: '1' }
        ];
        db.transaction((items) => items.forEach((i) => insertOp.run(i)))(initialOps);
    }

    // Seeder Footer Templates
    if (db.prepare('SELECT COUNT(*) as count FROM footer_templates').get().count === 0) {
        const insertFooter = db.prepare(`INSERT INTO footer_templates (id, title, content) VALUES (@id, @title, @content)`);
        const initialFooters = [
            {
                id: 'ft-1',
                title: 'Standar Pertamina (Display Nol)',
                content: 'TERIMA KASIH & SELAMAT JALAN\nPASTIKAN DISPLAY POMPA DI ANGKA NOL\nPASTIKAN JUMLAH RUPIAH & LITER SESUAI'
            },
            {
                id: 'ft-2',
                title: 'Edukasi BBM Subsidi',
                content: 'TERIMA KASIH & SELAMAT JALAN\nBBM BERSUBSIDI HANYA UNTUK GOLONGAN BERHAK\nGUNAKAN BBM DENGAN BIJAK'
            },
            {
                id: 'ft-3',
                title: 'Call Center 135 & Pengaduan',
                content: 'TERIMA KASIH ATAS KUNJUNGAN ANDA\nKRITIK & SARAN HUBUNGI CALL CENTER 135\nSELAMAT MELANJUTKAN PERJALANAN'
            },
            {
                id: 'ft-4',
                title: 'Bahasa Daerah (Jawa Timuran)',
                content: 'MATUR NUWUN & HATI-HATI DI JALAN\nPASTIKAN DISPLAY POMPA DI ANGKA NOL'
            }
        ];
        db.transaction((items) => items.forEach((i) => insertFooter.run(i)))(initialFooters);
    }
};
seedMasterData();

// --- API MASTER SPBU ---
app.get('/api/spbu', (req, res) => res.json(db.prepare('SELECT * FROM spbu_profiles ORDER BY spbuName ASC').all()));
app.post('/api/spbu', (req, res) => {
    const d = req.body;
    const id = d.id || `spbu-${Date.now()}`;
    db.prepare(`
    INSERT OR REPLACE INTO spbu_profiles (id, spbuNo, spbuName, spbuAddress, spbuCity, spbuPhone)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, d.spbuNo, d.spbuName, d.spbuAddress, d.spbuCity, d.spbuPhone || '');
    res.json({ success: true, id });
});
app.delete('/api/spbu/:id', (req, res) => {
    db.prepare('DELETE FROM spbu_profiles WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// --- API MASTER OPERATOR ---
app.get('/api/operators', (req, res) => res.json(db.prepare('SELECT * FROM operators ORDER BY name ASC').all()));
app.post('/api/operators', (req, res) => {
    const d = req.body;
    const id = d.id || `op-${Date.now()}`;
    db.prepare(`INSERT OR REPLACE INTO operators (id, name, defaultShift) VALUES (?, ?, ?)`).run(id, d.name, d.defaultShift || '1');
    res.json({ success: true, id });
});
app.delete('/api/operators/:id', (req, res) => {
    db.prepare('DELETE FROM operators WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// --- API MASTER FOOTER TEMPLATES ---
app.get('/api/footers', (req, res) => res.json(db.prepare('SELECT * FROM footer_templates ORDER BY title ASC').all()));
app.post('/api/footers', (req, res) => {
    const d = req.body;
    const id = d.id || `ft-${Date.now()}`;
    db.prepare(`INSERT OR REPLACE INTO footer_templates (id, title, content) VALUES (?, ?, ?)`).run(id, d.title, d.content);
    res.json({ success: true, id });
});
app.delete('/api/footers/:id', (req, res) => {
    db.prepare('DELETE FROM footer_templates WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// SPA Static Serving
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));
app.use((req, res) => res.sendFile(path.join(clientDistPath, 'index.html')));

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server SPBU aktif di port ${PORT}`));