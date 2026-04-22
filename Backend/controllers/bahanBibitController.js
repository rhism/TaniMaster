const BahanBibit = require('../models/BahanBibit');

// Menambahkan bahan bibit baru
const createBahanBibit = async (req, res) => {
    const { nama_bibit, stok, tanggal,  biaya, total } = req.body;

    try {
        const result = await BahanBibit.createBahanBibit({
            nama_bibit, stok, tanggal, biaya, total
        });

        res.status(201).json({
            message: 'Bahan Bibit berhasil ditambahkan',
            data: result
        });
    } catch (error) {
        console.error('Error menambahkan Bahan Bibit:', error);
        res.status(500).json({ error: 'Gagal menambahkan Bahan Bibit' });
    }
};

// Mendapatkan semua bahan bibit
const getBahanBibit = async (req, res) => {
    try {
        const results = await BahanBibit.getAll();

        if (results.length === 0) {
            return res.status(404).json({ message: 'Data Bahan Bibit kosong' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error mendapatkan Bahan Bibit:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mendapatkan Bahan Bibit berdasarkan ID
const getBahanBibitById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await BahanBibit.getById(id);

        if (!result) {
            return res.status(404).json({ message: 'Bahan Bibit tidak ditemukan' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error mendapatkan Bahan Bibit:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mengupdate bahan bibit berdasarkan ID
const updateBahanBibit = async (req, res) => {
    const { id } = req.params;
    const { nama_bibit, stok, tanggal, biaya, total } = req.body;

    try {
        const updateResult = await BahanBibit.updateById(id, {
            nama_bibit, stok, tanggal, biaya, total
        });

        if (updateResult === 0) {
            return res.status(404).json({
                error: 'Bahan Bibit tidak ditemukan atau tidak ada perubahan'
            });
        }

        const updatedData = await BahanBibit.getById(id);

        res.status(200).json({
            message: 'Bahan Bibit berhasil diperbarui',
            data: updatedData
        });
    } catch (error) {
        console.error('Error memperbarui Bahan Bibit:', error);
        res.status(500).json({ error: 'Gagal memperbarui data' });
    }
};

// Menghapus bahan bibit berdasarkan ID
const deleteBahanBibit = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await BahanBibit.deleteById(id);

        if (deleteResult === 0) {
            return res.status(404).json({ error: 'Bahan Bibit tidak ditemukan' });
        }

        res.status(200).json({ message: 'Bahan Bibit berhasil dihapus' });
    } catch (error) {
        console.error('Error menghapus Bahan Bibit:', error);
        res.status(500).json({ error: 'Gagal menghapus data' });
    }
};

module.exports = {
    createBahanBibit,
    getBahanBibit,
    getBahanBibitById,
    updateBahanBibit,
    deleteBahanBibit
};
