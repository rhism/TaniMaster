const db = require('../config/db');
const moment = require('moment-timezone');

// Menambahkan bahan bibit baru
const createBahanBibit = async (data) => {
    const query = `
        INSERT INTO bahan_bibit (nama_bibit, stok, tanggal,  biaya, total)
        VALUES (?, ?, ?, ?, ?)
    `;
    const { nama_bibit, stok, tanggal,  biaya, total } = data;

    const formattedDate = moment.tz(tanggal, 'Asia/Jakarta').format('YYYY-MM-DD');

    const [results] = await db.query(query, [nama_bibit, stok, formattedDate, biaya, total]);
    return { id: results.insertId, ...data, tanggal: formattedDate };
};

// Mendapatkan semua bahan bibit
const getAll = async () => {
    const query = 'SELECT * FROM bahan_bibit';
    const [results] = await db.query(query);
    return results.map(item => ({
        ...item,
        tanggal: moment.tz(item.tanggal, 'Asia/Jakarta').format('YYYY-MM-DD')
    }));
};

// Mendapatkan bahan bibit berdasarkan ID
const getById = async (id) => {
    const query = 'SELECT * FROM bahan_bibit WHERE id = ?';
    const [results] = await db.query(query, [id]);

    if (results.length === 0) return null;

    const item = results[0];
    item.tanggal = moment.tz(item.tanggal, 'Asia/Jakarta').format('YYYY-MM-DD');
    return item;
};

// Mengupdate bahan bibit berdasarkan ID
const updateById = async (id, fields) => {
    let query = 'UPDATE bahan_bibit SET ';
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            if (key === 'tanggal') {
                updates.push(`${key} = ?`);
                values.push(moment.tz(value, 'Asia/Jakarta').format('YYYY-MM-DD'));
            } else {
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

// Menghapus bahan bibit berdasarkan ID
const deleteById = async (id) => {
    const query = 'DELETE FROM bahan_bibit WHERE id = ?';
    const [results] = await db.query(query, [id]);
    return results.affectedRows;
};

module.exports = {
    createBahanBibit,
    getAll,
    getById,
    updateById,
    deleteById
};
