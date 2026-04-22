const express = require('express');
const {
    createBahanBaku,
    getBahanBaku,
    getBahanBakuById,
    updateBahanBaku,
    deleteBahanBaku
} = require('../controllers/bahanBakuController');

const router = express.Router();

router.post('/bahan-baku', createBahanBaku);
router.get('/bahan-baku', getBahanBaku);
router.get('/bahan-baku/:id', getBahanBakuById);
router.put('/bahan-baku/:id', updateBahanBaku);
router.delete('/bahan-baku/:id', deleteBahanBaku);

module.exports = router;
