const express = require('express');
const {
    createHasilPanen,
    getHasilPanen,
    getHasilPanenById,
    updateHasilPanen,
    deleteHasilPanen
} = require('../controllers/hasilPanenController');

const router = express.Router();

router.post('/hasil-panen', createHasilPanen);
router.get('/hasil-panen', getHasilPanen);
router.get('/hasil-panen/:id', getHasilPanenById);
router.put('/hasil-panen/:id', updateHasilPanen);
router.delete('/hasil-panen/:id', deleteHasilPanen);

module.exports = router;
