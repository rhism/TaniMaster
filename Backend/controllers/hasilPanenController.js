const HasilPanen = require('../models/HasilPanen');

// Menambahkan Data Hasil panen baru
const createHasilPanen = async (req, res) => {
    const { nama_tumbuhan, jumlah_panen, harga_jual } = req.body;

    try {
        const result = await HasilPanen.createHasilPanen({
            nama_tumbuhan, jumlah_panen, harga_jual
        });

        res.status(201).json({
            message: 'Data Hasil panen berhasil ditambahkan',
            data: result
        });
    } catch (error) {
        console.error('Error menambahkan Data Hasil panen:', error);
        res.status(500).json({ error: 'Gagal menambahkan Data Hasil panen' });
    }
};

// Mendapatkan semua Data Hasil panen
const getHasilPanen = async (req, res) => {
    try {
        const results = await HasilPanen.getAll();

        if (results.length === 0) {
            return res.status(404).json({ message: 'Data Hasil panen kosong' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error mendapatkan Data Hasil panen:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mendapatkan Data Hasil panen berdasarkan ID
const getHasilPanenById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await HasilPanen.getById(id);

        if (!result) {
            return res.status(404).json({ message: 'Data Hasil panen tidak ditemukan' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error mendapatkan Data Hasil panen:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data' });
    }
};

// Mengupdate Data Hasil panen berdasarkan ID
// Mengupdate Data Hasil panen berdasarkan ID
const updateHasilPanen = async (req, res) => {
    const { id } = req.params;
    const { nama_bibit, jumlah_panen, harga_jual } = req.body;

    try {
        const updateResult = await HasilPanen.updateById(id, {
            nama_bibit, jumlah_panen, harga_jual
        });

        if (updateResult === 0) {
            return res.status(404).json({
                error: 'Data Hasil Panen tidak ditemukan atau tidak ada perubahan'
            });
        }

        const updatedData = await HasilPanen.getById(id);

        res.status(200).json({
            message: 'Data Produksi berhasil diperbarui',
            data: updatedData
        });
    } catch (error) {
        console.error('Error memperbarui Data Produksi:', error);
        res.status(500).json({ error: 'Gagal memperbarui data' });
    }
};

// Menghapus Data Hasil panen berdasarkan ID
const deleteHasilPanen = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await HasilPanen.deleteById(id);

        if (deleteResult === 0) {
            return res.status(404).json({ error: 'Data Hasil panen tidak ditemukan' });
        }

        res.status(200).json({ message: 'Data Hasil panen berhasil dihapus' });
    } catch (error) {
        console.error('Error menghapus Data Hasil panen:', error);
        res.status(500).json({ error: 'Gagal menghapus data' });
    }
};

module.exports = {
    createHasilPanen,
    getHasilPanen,
    getHasilPanenById,
    updateHasilPanen,
    deleteHasilPanen
};
