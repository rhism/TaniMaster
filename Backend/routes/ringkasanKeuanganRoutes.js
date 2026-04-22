const express = require('express');
const {
    createRingkasanKeuangan,
    getRingkasanKeuangan,
    getRingkasanKeuanganById,
    updateRingkasanKeuangan,
    deleteRingkasanKeuangan
} = require('../controllers/ringkasanKeuanganController');

const router = express.Router();

// Route untuk menambahkan ringkasan keuangan
router.post('/ringkasan-keuangan', createRingkasanKeuangan);

// Route untuk mendapatkan semua ringkasan keuangan
router.get('/ringkasan-keuangan', getRingkasanKeuangan);

// Route untuk mendapatkan satu ringkasan keuangan berdasarkan ID
router.get('/ringkasan-keuangan/:id', getRingkasanKeuanganById);

// Route untuk mengupdate ringkasan keuangan berdasarkan ID
router.put('/ringkasan-keuangan/:id', updateRingkasanKeuangan);

// Route untuk menghapus ringkasan keuangan berdasarkan ID
router.delete('/ringkasan-keuangan/:id', deleteRingkasanKeuangan);

module.exports = router;
