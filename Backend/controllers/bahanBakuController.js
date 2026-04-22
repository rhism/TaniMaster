const BahanBaku = require('../models/BahanBaku');

// Menambahkan bahan baku baru
const createBahanBaku = async (req, res) => {
    const { nama_bahan_baku, stok, tanggal,  biaya, total } = req.body;

    try {
        const result = await BahanBaku.createBahanBaku({
            nama_bahan_baku, stok, tanggal, biaya, total
        });

        res.status(201).json({
            message: 'Bahan Baku berhasil ditambahkan',
            data: result
        });
    } catch (error) {
        console.error('Error menambahkan Bahan Baku:', error);
        res.status(500).json({ error: 'Gagal menambahkan Bahan Baku' });
    }
};

// Mendapatkan semua bahan baku
const getBahanBaku = async (req, res) => {
    try {
        const results = await BahanBaku.getAll();

        if (results.length === 0) {
            return res.status(404).json({ message: 'Data Bahan Baku kosong' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error mendapatkan Bahan Baku:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mendapatkan Bahan Baku berdasarkan ID
const getBahanBakuById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await BahanBaku.getById(id);

        if (!result) {
            return res.status(404).json({ message: 'Bahan Baku tidak ditemukan' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error mendapatkan Bahan Baku:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mengupdate bahan baku berdasarkan ID
const updateBahanBaku = async (req, res) => {
    const { id } = req.params;
    const { nama_bahan_baku, stok, tanggal, biaya, total } = req.body;

    try {
        const updateResult = await BahanBaku.updateById(id, {
            nama_bahan_baku, stok, tanggal, biaya, total
        });

        if (updateResult === 0) {
            return res.status(404).json({
                error: 'Bahan Baku tidak ditemukan atau tidak ada perubahan'
            });
        }

        const updatedData = await BahanBaku.getById(id);

        res.status(200).json({
            message: 'Bahan Baku berhasil diperbarui',
            data: updatedData
        });
    } catch (error) {
        console.error('Error memperbarui Bahan Baku:', error);
        res.status(500).json({ error: 'Gagal memperbarui data' });
    }
};

// Menghapus bahan baku berdasarkan ID
const deleteBahanBaku = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await BahanBaku.deleteById(id);

        if (deleteResult === 0) {
            return res.status(404).json({ error: 'Bahan Baku tidak ditemukan' });
        }

        res.status(200).json({ message: 'Bahan Baku berhasil dihapus' });
    } catch (error) {
        console.error('Error menghapus Bahan Baku:', error);
        res.status(500).json({ error: 'Gagal menghapus data' });
    }
};

module.exports = {
    createBahanBaku,
    getBahanBaku,
    getBahanBakuById,
    updateBahanBaku,
    deleteBahanBaku
};
