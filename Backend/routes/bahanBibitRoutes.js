const express = require('express');
const {
    createBahanBibit,
    getBahanBibit,
    getBahanBibitById,
    updateBahanBibit,
    deleteBahanBibit
} = require('../controllers/bahanBibitController');

const router = express.Router();

router.post('/bahan-bibit', createBahanBibit);
router.get('/bahan-bibit', getBahanBibit);
router.get('/bahan-bibit/:id', getBahanBibitById);
router.put('/bahan-bibit/:id', updateBahanBibit);
router.delete('/bahan-bibit/:id', deleteBahanBibit);

module.exports = router;
