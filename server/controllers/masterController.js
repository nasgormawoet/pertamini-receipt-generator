const db = require('../config/db');

// --- SPBU ---
const getSpbu = (req, res) => {
    db.all('SELECT * FROM spbu', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
};

const addSpbu = (req, res) => {
    const { spbuNo, spbuName, spbuCity, spbuAddress } = req.body;
    const sql = 'INSERT INTO spbu (spbuNo, spbuName, spbuCity, spbuAddress) VALUES (?, ?, ?, ?)';
    db.run(sql, [spbuNo, spbuName, spbuCity, spbuAddress], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'SPBU berhasil ditambahkan!' });
    });
};

const deleteSpbu = (req, res) => {
    db.run('DELETE FROM spbu WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'SPBU berhasil dihapus!' });
    });
};

// --- OPERATORS ---
const getOperators = (req, res) => {
    db.all('SELECT * FROM operators', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
};

const addOperator = (req, res) => {
    const { name, defaultShift } = req.body;
    const sql = 'INSERT INTO operators (name, defaultShift) VALUES (?, ?)';
    db.run(sql, [name, defaultShift], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Operator berhasil ditambahkan!' });
    });
};

const deleteOperator = (req, res) => {
    db.run('DELETE FROM operators WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Operator berhasil dihapus!' });
    });
};

// --- FOOTERS ---
const getFooters = (req, res) => {
    db.all('SELECT * FROM footers', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
};

const addFooter = (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO footers (title, content) VALUES (?, ?)';
    db.run(sql, [title, content], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Footer berhasil ditambahkan!' });
    });
};

const deleteFooter = (req, res) => {
    db.run('DELETE FROM footers WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Footer berhasil dihapus!' });
    });
};

// --- FUELS (BBM & SUBSIDI) ---
const getFuels = (req, res) => {
    db.all('SELECT * FROM fuels ORDER BY id ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
};

const addFuel = (req, res) => {
    const { name, originalPrice, subsidi, price } = req.body;
    const sql = 'INSERT INTO fuels (name, originalPrice, subsidi, price) VALUES (?, ?, ?, ?)';
    const params = [
        name,
        Number(originalPrice) || 0,
        Number(subsidi) || 0,
        Number(price) || 0
    ];
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'BBM berhasil ditambahkan!' });
    });
};

const updateFuel = (req, res) => {
    const { id } = req.params;
    const { name, originalPrice, subsidi, price } = req.body;
    const sql = 'UPDATE fuels SET name = ?, originalPrice = ?, subsidi = ?, price = ? WHERE id = ?';
    const params = [
        name,
        Number(originalPrice) || 0,
        Number(subsidi) || 0,
        Number(price) || 0,
        id
    ];
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: Number(id), message: 'BBM berhasil diperbarui!' });
    });
};

const deleteFuel = (req, res) => {
    db.run('DELETE FROM fuels WHERE id = ?', req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'BBM berhasil dihapus!' });
    });
};

module.exports = {
    getSpbu, addSpbu, deleteSpbu,
    getOperators, addOperator, deleteOperator,
    getFooters, addFooter, deleteFooter,
    getFuels, addFuel, updateFuel, deleteFuel
};