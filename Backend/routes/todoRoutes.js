const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Route untuk menambahkan aktivitas
router.post('/todos', todoController.addTodo);

// Route untuk mendapatkan semua aktivitas
router.get('/todos', todoController.getTodos);

// Route untuk mendapatkan satu aktivitas berdasarkan ID
router.get('/todos/:id', todoController.getTodoById);

// Route untuk mengupdate status aktivitas
router.put('/todos/:id', todoController.updateTodo);

// Route untuk menghapus aktivitas
router.delete('/todos/:id', todoController.deleteTodo);

module.exports = router;
