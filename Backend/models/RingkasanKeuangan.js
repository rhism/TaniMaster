const db = require('../config/db');

// Menambahkan ringkasan keuangan baru
const createRingkasanKeuangan = async (data) => {
    const { total_saldo, pendapatan, pengeluaran, pinjaman, modal } = data;
    const query = `
        INSERT INTO ringkasan_keuangan (total_saldo, pendapatan, pengeluaran, pinjaman, modal)
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        const [results] = await db.query(query, [total_saldo, pendapatan, pengeluaran, pinjaman, modal]);
        return { id: results.insertId, ...data };  // Mengembalikan data dengan id baru
    } catch (err) {
        throw err;
    }
};

// Mendapatkan semua ringkasan keuangan
const getAll = async () => { 
    const query = 'SELECT * FROM ringkasan_keuangan';
    try {
        const [results] = await db.query(query);
        return results;
    } catch (err) {
        throw err;
    }
};

// Mengupdate ringkasan keuangan berdasarkan id
const updateRingkasanKeuangan = async (id, updatedFields) => {
    let query = 'UPDATE ringkasan_keuangan SET ';
    const values = [];
    const updates = [];

    if (updatedFields.total_saldo !== undefined) {
        updates.push('total_saldo = ?');
        values.push(updatedFields.total_saldo);
    }
    if (updatedFields.pendapatan !== undefined) {
        updates.push('pendapatan = ?');
        values.push(updatedFields.pendapatan);
    }
    if (updatedFields.pengeluaran !== undefined) {
        updates.push('pengeluaran = ?');
        values.push(updatedFields.pengeluaran);
    }
    if (updatedFields.pinjaman !== undefined) {
        updates.push('pinjaman = ?');
        values.push(updatedFields.pinjaman);
    }
    if (updatedFields.modal !== undefined) {
        updates.push('modal = ?');
        values.push(updatedFields.modal);
    }

    if (updates.length === 0) {
        throw new Error("Tidak ada field yang perlu diupdate.");
    }

    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);

    try {
        const [results] = await db.query(query, values);
        return results;
    } catch (err) {
        throw err;
    }
};

// Menghapus ringkasan keuangan berdasarkan id
const deleteRingkasanKeuangan = async (id) => {
    const query = 'DELETE FROM ringkasan_keuangan WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        return results;
    } catch (err) {
        throw err;
    }
};

// Mendapatkan ringkasan keuangan berdasarkan id
const getRingkasanKeuanganById = async (id) => {
    const query = 'SELECT * FROM ringkasan_keuangan WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        return results.length > 0 ? results[0] : null;  // data kalo ada, null kalo gk ditemukan
    } catch (err) {
        throw err;
    }
};

module.exports = {
    createRingkasanKeuangan,
    getAll,
    updateRingkasanKeuangan,
    deleteRingkasanKeuangan,
    getRingkasanKeuanganById
};
