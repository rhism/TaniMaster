const RingkasanKeuangan = require('../models/RingkasanKeuangan');

// Menambahkan ringkasan keuangan baru
const createRingkasanKeuangan = async (req, res) => {
    const { total_saldo, pendapatan, pengeluaran, pinjaman, modal } = req.body;

    const newRingkasan = {
        total_saldo,
        pendapatan,
        pengeluaran,
        pinjaman,
        modal
    };

    try {
        const result = await RingkasanKeuangan.createRingkasanKeuangan(newRingkasan);
        res.status(201).json({ message: 'Ringkasan Keuangan berhasil ditambahkan', data: result });
    } catch (error) {
        console.error('Error adding Ringkasan Keuangan:', error);
        res.status(500).json({ error: 'Failed to add Ringkasan Keuangan' });
    }
};

// Mendapatkan semua ringkasan keuangan
const getRingkasanKeuangan = async (req, res) => {
    try {
        const results = await RingkasanKeuangan.getAll();
        if (results.length === 0) {
            return res.status(404).json({ message: 'No ringkasan found' });
        }
        res.status(200).json(results); 
    } catch (error) {
        console.error('Error fetching Ringkasan Keuangan:', error);
        res.status(500).json({ error: 'Server error while fetching data' });
    }
};

// ringkasan keuangan berdasarkan ID
const getRingkasanKeuanganById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await RingkasanKeuangan.getRingkasanKeuanganById(id); // Mencari berdasarkan ID
        if (!result) {
            return res.status(404).json({ message: 'Ringkasan Keuangan not found' });
        }
        res.status(200).json(result);  // Menyampaikan data berdasarkan ID
    } catch (error) {
        console.error('Error fetching Ringkasan Keuangan by ID:', error);
        res.status(500).json({ error: 'Failed to fetch Ringkasan Keuangan' });
    }
};

// Mengupdate ringkasan keuangan berdasarkan ID
const updateRingkasanKeuangan = async (req, res) => {
    const { id } = req.params;  // Mendapatkan ID dari URL
    const { total_saldo, pendapatan, pengeluaran, pinjaman, modal } = req.body;

    const updatedFields = {
        total_saldo,
        pendapatan,
        pengeluaran,
        pinjaman,
        modal
    };

    try {
        const updateResult = await RingkasanKeuangan.updateRingkasanKeuangan(id, updatedFields);  // Mengupdate berdasarkan ID
        if (updateResult === 0) {
            return res.status(404).json({ error: 'Ringkasan Keuangan not found or no changes made' });
        }

        const updatedData = await RingkasanKeuangan.getRingkasanKeuanganById(id);  // Mengambil data yang sudah diupdate
        res.status(200).json({ message: 'Ringkasan Keuangan berhasil diupdate!', data: updatedData });
    } catch (error) {
        console.error('Error updating Ringkasan Keuangan:', error);
        res.status(500).json({ error: 'Failed to update Ringkasan Keuangan' });
    }
};

// Menghapus ringkasan keuangan berdasarkan ID
const deleteRingkasanKeuangan = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await RingkasanKeuangan.deleteRingkasanKeuangan(id);  // Menghapus berdasarkan ID
        if (deleteResult === 0) {
            return res.status(404).json({ error: 'Ringkasan Keuangan not found' });
        }
        res.status(200).json({ message: 'Ringkasan Keuangan berhasil dihapus!' });
    } catch (error) {
        console.error('Error deleting Ringkasan Keuangan:', error);
        res.status(500).json({ error: 'Failed to delete Ringkasan Keuangan' });
    }
};

module.exports = {
    createRingkasanKeuangan,
    getRingkasanKeuangan,
    getRingkasanKeuanganById,
    updateRingkasanKeuangan,
    deleteRingkasanKeuangan
};
