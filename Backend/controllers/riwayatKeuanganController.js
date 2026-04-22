const RiwayatKeuangan = require('../models/RiwayatKeuangan');

// Menambahkan riwayat keuangan baru
const createRiwayatKeuangan = async (req, res) => {
    const { tanggal, tipe, nominal,  deskripsi } = req.body;

    try {
        const result = await RiwayatKeuangan.createRiwayatKeuangan({
            tanggal, tipe, nominal,  deskripsi
        });

        res.status(201).json({
            message: 'Riwayat Keuangan berhasil ditambahkan',
            data: result
        });
    } catch (error) {
        console.error('Error menambahkan Riwayat Keuangan:', error);
        res.status(500).json({ error: 'Gagal menambahkan Riwayat Keuangan' });
    }
};

// Mendapatkan semua riwayat keuangan
const getRiwayatKeuangan = async (req, res) => {
    try {
        const results = await RiwayatKeuangan.getAll();

        if (results.length === 0) {
            return res.status(404).json({ message: 'Data Riwayat Keuangan kosong' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error mendapatkan Riwayat Keuangan:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mendapatkan riwayat keuangan berdasarkan ID
const getRiwayatKeuanganById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await RiwayatKeuangan.getById(id);

        if (!result) {
            return res.status(404).json({ message: 'Riwayat Keuangan tidak ditemukan' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error mendapatkan Riwayat Keuangan:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mengupdate riwayat keuangan berdasarkan ID
const updateRiwayatKeuangan = async (req, res) => {
    const { id } = req.params;
    const { tanggal, tipe, nominal,  deskripsi } = req.body;

    try {
        const updateResult = await RiwayatKeuangan.updateById(id, {
            tanggal, tipe, nominal,  deskripsi
        });

        if (updateResult === 0) {
            return res.status(404).json({
                error: 'Riwayat Keuangan tidak ditemukan atau tidak ada perubahan'
            });
        }

        const updatedData = await RiwayatKeuangan.getById(id);

        res.status(200).json({
            message: 'Riwayat Keuangan berhasil diperbarui',
            data: updatedData
        });
    } catch (error) {
        console.error('Error memperbarui Riwayat Keuangan:', error);
        res.status(500).json({ error: 'Gagal memperbarui data' });
    }
};

// Menghapus riwayat keuangan berdasarkan ID
const deleteRiwayatKeuangan = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await RiwayatKeuangan.deleteById(id);

        if (deleteResult === 0) {
            return res.status(404).json({ error: 'Riwayat Keuangan tidak ditemukan' });
        }

        res.status(200).json({ message: 'Riwayat Keuangan berhasil dihapus' });
    } catch (error) {
        console.error('Error menghapus Riwayat Keuangan:', error);
        res.status(500).json({ error: 'Gagal menghapus data' });
    }
};

module.exports = {
    createRiwayatKeuangan,
    getRiwayatKeuangan,
    getRiwayatKeuanganById,
    updateRiwayatKeuangan,
    deleteRiwayatKeuangan
};
