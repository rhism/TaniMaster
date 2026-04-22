const express = require('express');
const {
    createProduksi,
    getProduksi,
    getProduksiById,
    updateProduksi,
    deleteProduksi
} = require('../controllers/produksiController');

const router = express.Router();

router.post('/produksi', createProduksi);
router.get('/produksi', getProduksi);
router.get('/produksi/:id', getProduksiById);
router.put('/produksi/:id', updateProduksi);
router.delete('/produksi/:id', deleteProduksi);

module.exports = router;
