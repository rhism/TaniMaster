const db = require('../config/db'); // Menggunakan pool dari db.js

// Menambahkan aktivitas baru
const addTodo = async (todo) => {
  const { title, description, due_date, category, status,   reminder_time } = todo;
  const query = `
    INSERT INTO todos (title, description, due_date, category, status,   reminder_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [results] = await db.query(query, [title, description, due_date, category, status,   reminder_time]);
    return results;
  } catch (err) {
    throw err;
  }
};

// Mendapatkan semua aktivitas
const getAllTodos = async () => {
  const query = 'SELECT * FROM todos';
  try {
    const [results] = await db.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

// Mengupdate status atau informasi aktivitas
const updateTodoById = async (id, updatedFields) => {
  const query = `
    UPDATE todos 
    SET 
      title = ?, 
      description = ?, 
      due_date = ?, 
      category = ?, 
      status = ?, 
      
       
      reminder_time = ?
      WHERE id = ?
  `;
  const { title, description, due_date, category, status,   reminder_time } = updatedFields;

  try {
    const [results] = await db.query(query, [
      title,
      description,
      due_date,
      category,
      status,
      
      
      reminder_time,
      id
    ]);
    return results;
  } catch (err) {
    throw err;
  }
};


// Menghapus aktivitas
const deleteTodo = async (id) => {
  const query = 'DELETE FROM todos WHERE id = ?';
  try {
    const [results] = await db.query(query, [id]);
    return results;
  } catch (err) {
    throw err;
  }
};

// Mendapatkan satu aktivitas berdasarkan ID
const getTodoById = async (id) => {
  const query = 'SELECT * FROM todos WHERE id = ?';
  try {
    const [results] = await db.query(query, [id]);
    if (results.length === 0) {
      return null; // Jika tidak ada aktivitas dengan ID tersebut
    }
    return results[0];
  } catch (err) {
    throw err;
  }
};

module.exports = { addTodo, getAllTodos, getTodoById, updateTodoById, deleteTodo };
