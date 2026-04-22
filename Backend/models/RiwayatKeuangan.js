const db = require('../config/db');
const moment = require('moment-timezone');

// Menambahkan riwayat keuangan baru
const createRiwayatKeuangan = async (data) => {
    const query = `
        INSERT INTO riwayat_keuangan (tanggal, tipe, nominal,  deskripsi)
        VALUES (?, ?, ?, ?)
    `;
    const { tanggal, tipe, nominal,  deskripsi } = data;

    const formattedDate = moment.tz(tanggal, 'Asia/Jakarta').format('YYYY-MM-DD');

    const [results] = await db.query(query, [formattedDate, tipe, nominal,  deskripsi]);
    return { id: results.insertId, ...data, tanggal: formattedDate };
};

// Mendapatkan semua riwayat keuangan
const getAll = async () => {
    const query = 'SELECT * FROM riwayat_keuangan';
    const [results] = await db.query(query);
    return results.map(item => ({
        ...item,
        tanggal: moment.tz(item.tanggal, 'Asia/Jakarta').format('YYYY-MM-DD')
    }));
};

// Mendapatkan riwayat keuangan berdasarkan ID
const getById = async (id) => {
    const query = 'SELECT * FROM riwayat_keuangan WHERE id = ?';
    const [results] = await db.query(query, [id]);

    if (results.length === 0) return null;

    const item = results[0];
    item.tanggal = moment.tz(item.tanggal, 'Asia/Jakarta').format('YYYY-MM-DD');
    return item;
};

// Mengupdate riwayat keuangan berdasarkan ID
const updateById = async (id, fields) => {
    let query = 'UPDATE riwayat_keuangan SET ';
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

// Menghapus riwayat keuangan berdasarkan ID
const deleteById = async (id) => {
    const query = 'DELETE FROM riwayat_keuangan WHERE id = ?';
    const [results] = await db.query(query, [id]);
    return results.affectedRows;
};

module.exports = {
    createRiwayatKeuangan,
    getAll,
    getById,
    updateById,
    deleteById
};
