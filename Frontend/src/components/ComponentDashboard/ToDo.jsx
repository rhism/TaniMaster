import React, { useState, useEffect } from "react";
import axios from "../../config/axiosInstance";
import { FaPlus, FaEdit, FaTrash, FaClipboardList } from "react-icons/fa";

const statusConfig = {
  "Belum Mulai":     { color: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",       dot: "bg-gray-400" },
  "Sedang Berjalan": { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-400" },
  "Selesai":         { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  dot: "bg-green-500" },
};

const categoryConfig = {
  "Pekerjaan": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Pribadi":   "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Urgent":    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Sosial":    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig["Belum Mulai"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

const CategoryBadge = ({ category }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig[category] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
    {category || "-"}
  </span>
);

const emptyForm = {
  title: "", description: "", status: "Belum Mulai",
  due_date: "", category: "", reminder_time: "",
};

const inputCls = "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 dark:placeholder:text-gray-500";

const ToDo = () => {
  const [todoList, setTodoList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newData, setNewData] = useState(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/todos");
      setTodoList(res.data);
    } catch (err) {
      if (err.response?.status !== 404) console.error("Failed to fetch todos", err);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setNewData(emptyForm);
    setIsPopupOpen(true);
  };

  const handleEditRow = (id) => {
    const todo = todoList.find((t) => t.id === id);
    if (!todo) return;
    setIsEdit(true);
    setEditId(id);
    setNewData(todo);
    setIsPopupOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`/api/todos/${editId}`, newData);
      } else {
        await axios.post("/api/todos", newData);
      }
      setIsPopupOpen(false);
      setNewData(emptyForm);
      await fetchTodos();
    } catch (err) {
      console.error("Failed to save todo", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus tugas ini?")) return;
    try {
      await axios.delete(`/api/todos/${id}`);
      await fetchTodos();
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  const totalPages = Math.max(1, Math.ceil(todoList.length / itemsPerPage));
  const paginated = todoList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (d) => {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return d; }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-green-50 dark:border-gray-700">
        <div className="flex items-center gap-2.5">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-xl">
            <FaClipboardList size={16} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Daftar Tugas</h3>
            <p className="text-xs text-gray-400">{todoList.length} tugas terdaftar</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm shadow-green-200"
        >
          <FaPlus size={12} />
          <span className="hidden sm:inline">Tambah Tugas</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Mobile: Card View */}
      <div className="md:hidden divide-y divide-green-50 dark:divide-gray-700">
        {paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <FaClipboardList size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada tugas</p>
          </div>
        ) : (
          paginated.map((item) => (
            <div key={item.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug">{item.title}</h4>
                <StatusBadge status={item.status} />
              </div>
              {item.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{item.description}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={item.category} />
                  <span className="text-xs text-gray-400">{formatDate(item.due_date)}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleEditRow(item.id)}
                    className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-semibold">Judul</th>
              <th className="text-left px-4 py-3 font-semibold">Deskripsi</th>
              <th className="text-left px-4 py-3 font-semibold">Tenggat</th>
              <th className="text-left px-4 py-3 font-semibold">Kategori</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Pengingat</th>
              <th className="text-center px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50 dark:divide-gray-700">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-400 dark:text-gray-500">
                  <FaClipboardList size={28} className="mx-auto mb-2 opacity-30" />
                  <p>Belum ada tugas. Tambah tugas baru!</p>
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr key={item.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-100">{item.title}</td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 max-w-[180px] truncate">{item.description || "-"}</td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">{formatDate(item.due_date)}</td>
                  <td className="px-4 py-3.5"><CategoryBadge category={item.category} /></td>
                  <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                    {item.reminder_time ? formatDate(item.reminder_time) : "-"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5 justify-center">
                      <button onClick={() => handleEditRow(item.id)}
                        className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors">
                        <FaEdit size={13} />
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors">
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 border-t border-green-50 dark:border-gray-700 bg-green-50/30 dark:bg-gray-700/20">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">Tampilkan</label>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value, 10)); setCurrentPage(1); }}
            className="text-xs border border-green-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-green-400"
          >
            {[5, 10, 15].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs text-gray-500 dark:text-gray-400">per halaman</span>
        </div>
        {totalPages > 1 && (
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-600 border border-green-100 dark:border-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
                {isEdit ? "Edit Tugas" : "Tambah Tugas Baru"}
              </h3>
              <button onClick={() => setIsPopupOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-light">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Judul Tugas *</label>
                  <input type="text" name="title" value={newData.title} onChange={handleInputChange} required
                    placeholder="Masukkan judul tugas..." className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tenggat Waktu *</label>
                  <input type="date" name="due_date" value={newData.due_date} onChange={handleInputChange} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategori *</label>
                  <select name="category" value={newData.category} onChange={handleInputChange} required
                    className={inputCls}>
                    <option value="">Pilih Kategori</option>
                    <option value="Pekerjaan">Pekerjaan</option>
                    <option value="Pribadi">Pribadi</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Sosial">Sosial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select name="status" value={newData.status} onChange={handleInputChange} className={inputCls}>
                    <option value="Belum Mulai">Belum Mulai</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pengingat</label>
                  <input type="datetime-local" name="reminder_time" value={newData.reminder_time}
                    onChange={handleInputChange} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Deskripsi</label>
                  <textarea name="description" value={newData.description} onChange={handleInputChange} rows={3}
                    placeholder="Tambah deskripsi (opsional)..."
                    className={`${inputCls} resize-none`} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsPopupOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                  {isEdit ? "Simpan Perubahan" : "Tambah Tugas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDo;
