const express = require('express');
const {
    createRiwayatKeuangan,
    getRiwayatKeuangan,
    getRiwayatKeuanganById,
    updateRiwayatKeuangan,
    deleteRiwayatKeuangan
} = require('../controllers/riwayatKeuanganController');

const router = express.Router();

router.post('/riwayat-keuangan', createRiwayatKeuangan);
router.get('/riwayat-keuangan', getRiwayatKeuangan);
router.get('/riwayat-keuangan/:id', getRiwayatKeuanganById);
router.put('/riwayat-keuangan/:id', updateRiwayatKeuangan);
router.delete('/riwayat-keuangan/:id', deleteRiwayatKeuangan);

module.exports = router;
