const Todo = require('../models/todoModel');
const moment = require('moment-timezone');

// Menambahkan aktivitas baru
const addTodo = async (req, res) => {
  const { title, description, due_date, category, status,   reminder_time } = req.body;

  // Format waktu sebelum menyimpan ke database
  const formattedTodo = {
    title,
    description,
    due_date: moment(due_date).tz("Asia/Jakarta").format("YYYY-MM-DD"),
    category,
    status,
    
    
    reminder_time: moment(reminder_time).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
  };

  try {
    const results = await Todo.addTodo(formattedTodo); // Simpan ke database
    res.status(201).json({ message: 'Todo added successfully', data: results });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Failed to add todo' });
  }
};

// Mendapatkan semua aktivitas
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.getAllTodos(); // Ambil semua data dari database
    if (todos.length === 0) {
      return res.status(404).json({ message: 'No todos found' });
    }

    // Format ulang waktu untuk setiap aktivitas sebelum dikirim ke frontend
    const formattedTodos = todos.map(todo => ({
      ...todo,
      due_date: moment(todo.due_date).tz("Asia/Jakarta").format("YYYY-MM-DD "),
      reminder_time: moment(todo.reminder_time).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }));

    res.status(200).json(formattedTodos)
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mengupdate status aktivitas
const updateTodo = async (req, res) => {
  const { id } = req.params; // Ambil ID dari parameter URL
  const { title, description, due_date, category, status,   reminder_time } = req.body;

  try {
    const updatedFields = {
      title,
      description,
      due_date: moment(due_date).tz("Asia/Jakarta").format("YYYY-MM-DD "),
      category,
      status,
      
      
      reminder_time: moment(reminder_time).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    };

    const results = await Todo.updateTodoById(id, updatedFields); // Perbarui data di database
    res.status(200).json({ message: 'Todo updated successfully', data: results });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};


// Menghapus aktivitas
const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.deleteTodo(id); // Hapus data dari database
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

// Mendapatkan satu aktivitas berdasarkan ID
const getTodoById = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.getTodoById(id); // Ambil data berdasarkan ID
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Format ulang waktu untuk aktivitas yang ditemukan
    const formattedTodo = {
      ...todo,
      due_date: moment(todo.due_date).tz("Asia/Jakarta").format("YYYY-MM-DD "),
      reminder_time: moment(todo.reminder_time).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    };

    res.status(200).json(formattedTodo); // Kirim data sebagai response JSON
  } catch (error) {
    console.error('Error fetching todo by ID:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

module.exports = { addTodo, getTodos, getTodoById, updateTodo, deleteTodo };
