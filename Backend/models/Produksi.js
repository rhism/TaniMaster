const db = require('../config/db');
const moment = require('moment-timezone');

// Menambahkan data produksi baru
const createProduksi = async (data) => {
    const query = `
        INSERT INTO produksi (nama_bibit, jumlah, waktu_ditanam)
        VALUES (?, ?, ?)
    `;
    const { nama_bibit, jumlah, waktu_ditanam } = data;

    const formattedDate = moment.tz(waktu_ditanam, 'Asia/Jakarta').format('YYYY-MM-DD');

    const [results] = await db.query(query, [nama_bibit, jumlah, formattedDate]);
    return { id: results.insertId, ...data, waktu_ditanam: formattedDate };
};

// Mendapatkan semua data produksi
const getAll = async () => {
    const query = 'SELECT * FROM produksi';
    const [results] = await db.query(query);
    return results.map(item => ({
        ...item,
        waktu_ditanam: moment.tz(item.waktu_ditanam, 'Asia/Jakarta').format('YYYY-MM-DD')
    }));
};

// Mendapatkan data produksi berdasarkan ID
const getById = async (id) => {
    const query = 'SELECT * FROM produksi WHERE id = ?';
    const [results] = await db.query(query, [id]);

    if (results.length === 0) return null;

    const item = results[0];
    item.waktu_ditanam = moment.tz(item.waktu_ditanam, 'Asia/Jakarta').format('YYYY-MM-DD');
    return item;
};

// Mengupdate data produksi berdasarkan ID
const updateById = async (id, fields) => {
    let query = 'UPDATE produksi SET ';
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            if (key === 'waktu_ditanam') {
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

// Menghapus data produksi berdasarkan ID
const deleteById = async (id) => {
    const query = 'DELETE FROM produksi WHERE id = ?';
    const [results] = await db.query(query, [id]);
    return results.affectedRows;
};

module.exports = {
    createProduksi,
    getAll,
    getById,
    updateById,
    deleteById
};
