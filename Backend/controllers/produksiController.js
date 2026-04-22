const Produksi = require('../models/Produksi');

// Menambahkan data Produksi baru
const createProduksi = async (req, res) => {
    const { nama_bibit, jumlah, waktu_ditanam } = req.body;

    try {
        const result = await Produksi.createProduksi({
            nama_bibit, jumlah, waktu_ditanam
        });

        res.status(201).json({
            message: 'Data Produksi berhasil ditambahkan',
            data: result
        });
    } catch (error) {
        console.error('Error menambahkan Data Produksi:', error);
        res.status(500).json({ error: 'Gagal menambahkan Data Produksi' });
    }
};

// Mendapatkan semua Data Produksi
const getProduksi = async (req, res) => {
    try {
        const results = await Produksi.getAll();

        if (results.length === 0) {
            return res.status(404).json({ message: 'Data Produksi kosong' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error mendapatkan Data Produksi:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mendapatkan Data Produksi berdasarkan ID
const getProduksiById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Produksi.getById(id);

        if (!result) {
            return res.status(404).json({ message: 'Data Produksi tidak ditemukan' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error mendapatkan Data Produksi:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mengupdate Data Produksi berdasarkan ID
const updateProduksi = async (req, res) => {
    const { id } = req.params;
    const { nama_bibit, jumlah, waktu_ditanam } = req.body;

    try {
        const updateResult = await Produksi.updateById(id, {
            nama_bibit, jumlah, waktu_ditanam
        });

        if (updateResult === 0) {
            return res.status(404).json({
                error: 'Data Produksi tidak ditemukan atau tidak ada perubahan'
            });
        }

        const updatedData = await Produksi.getById(id);

        res.status(200).json({
            message: 'Data Produksi berhasil diperbarui',
            data: updatedData
        });
    } catch (error) {
        console.error('Error memperbarui Data Produksi:', error);
        res.status(500).json({ error: 'Gagal memperbarui data' });
    }
};

// Menghapus Data Produksi berdasarkan ID
const deleteProduksi = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await Produksi.deleteById(id);

        if (deleteResult === 0) {
            return res.status(404).json({ error: 'Data Produksi tidak ditemukan' });
        }

        res.status(200).json({ message: 'Data Produksi berhasil dihapus' });
    } catch (error) {
        console.error('Error menghapus Data Produksi:', error);
        res.status(500).json({ error: 'Gagal menghapus data' });
    }
};

module.exports = {
    createProduksi,
    getProduksi,
    getProduksiById,
    updateProduksi,
    deleteProduksi
};
