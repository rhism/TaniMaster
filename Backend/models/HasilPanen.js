const db = require('../config/db');
const moment = require('moment-timezone');

// Menambahkan data hasil panen baru
const createHasilPanen = async (data) => {
    const query = `
        INSERT INTO hasil_panen (nama_tumbuhan, jumlah_panen, harga_jual)
        VALUES (?, ?, ?)
    `;
    const { nama_tumbuhan, jumlah_panen, harga_jual } = data;

    const [results] = await db.query(query, [nama_tumbuhan, jumlah_panen, harga_jual]);
    return { id: results.insertId, ...data };
};

// Mendapatkan semua data hasil panen
const getAll = async () => {
    const query = 'SELECT * FROM hasil_panen';
    const [results] = await db.query(query);
    return results;
};

// Mendapatkan data hasil panen berdasarkan ID
const getById = async (id) => {
    const query = 'SELECT * FROM hasil_panen WHERE id = ?';
    const [results] = await db.query(query, [id]);

    if (results.length === 0) return null;

    return results[0];  // Tidak perlu format tanggal lagi
};

// Mengupdate data hasil panen berdasarkan ID
const updateById = async (id, fields) => {
    let query = 'UPDATE hasil_panen SET ';
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            // Hanya update field yang ada di tabel: nama_tumbuhan, jumlah_panen, harga_jual
            if (key === 'nama_tumbuhan' || key === 'jumlah_panen' || key === 'harga_jual') {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }
    }

    if (updates.length === 0) {
        throw new Error('Tidak ada field yang diupdate.');
    }

    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);

    const [results] = await db.query(query, values);
    return results.affectedRows;
};

// Menghapus data hasil panen berdasarkan ID
const deleteById = async (id) => {
    const query = 'DELETE FROM hasil_panen WHERE id = ?';
    const [results] = await db.query(query, [id]);
    return results.affectedRows;
};

module.exports = {
    createHasilPanen,
    getAll,
    getById,
    updateById,
    deleteById
};
