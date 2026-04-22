import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaPlus, FaEdit, FaTrash, FaFilePdf, FaSeedling } from "react-icons/fa";

const emptyForm = { nama_bibit: "", stok: "", biaya: "", tanggal: "" };

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
    <input {...props}
      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
  </div>
);

const InventoriBibit = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/bahan-bibit");
      setData(res.data);
    } catch (err) {
      if (err.response?.status !== 404) console.error("Gagal memuat bahan bibit:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTambah = async () => {
    const stok = parseInt(form.stok);
    const biaya = parseInt(form.biaya);
    if (!form.nama_bibit || !stok || !biaya || !form.tanggal) return;
    try {
      await axios.post("/api/bahan-bibit", { nama_bibit: form.nama_bibit, stok, biaya, tanggal: form.tanggal, total: stok * biaya });
      setForm(emptyForm);
      fetchData();
    } catch (err) { console.error("Gagal menambah:", err); }
  };

  const handleSaveEdit = async () => {
    const stok = parseInt(editForm.stok);
    const biaya = parseInt(editForm.biaya);
    try {
      await axios.put(`/api/bahan-bibit/${editForm.id}`, { nama_bibit: editForm.nama_bibit, stok, biaya, tanggal: editForm.tanggal, total: stok * biaya });
      setEditForm(null);
      fetchData();
    } catch (err) { console.error("Gagal update:", err); }
  };

  const handleHapus = async (id) => {
    if (!window.confirm("Hapus item ini?")) return;
    try { await axios.delete(`/api/bahan-bibit/${id}`); fetchData(); }
    catch (err) { console.error("Gagal hapus:", err); }
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Inventori Bahan Bibit", 10, 10);
    doc.autoTable({ head: [["Nama", "Stok", "Biaya", "Tanggal", "Total"]], body: data.map((i) => [i.nama_bibit, i.stok, i.biaya, i.tanggal, i.total]), startY: 20 });
    doc.save("Inventori_Bahan_Bibit.pdf");
  };

  const filteredData = data.filter((item) => item.nama_bibit?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (d) => { try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-green-50 dark:border-gray-700">
        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-xl">
          <FaSeedling size={16} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Bahan Bibit</h3>
          <p className="text-xs text-gray-400">{data.length} item tersimpan</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="px-5 py-4 border-b border-green-50 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tambah Bahan Bibit</h4>
        <div className="space-y-2.5">
          <InputField label="Nama Bibit" name="nama_bibit" placeholder="Contoh: Cabai Merah" value={form.nama_bibit}
            onChange={(e) => setForm({ ...form, nama_bibit: e.target.value })} />
          <div className="grid grid-cols-2 gap-2.5">
            <InputField label="Stok" type="number" name="stok" placeholder="0" value={form.stok}
              onChange={(e) => setForm({ ...form, stok: e.target.value })} />
            <InputField label="Biaya (Rp)" type="number" name="biaya" placeholder="0" value={form.biaya}
              onChange={(e) => setForm({ ...form, biaya: e.target.value })} />
          </div>
          <InputField label="Tanggal" type="date" name="tanggal" value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
          <button onClick={handleTambah}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm shadow-green-200">
            <FaPlus size={12} /> Tambah
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col flex-1 px-5 py-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <input type="text" placeholder="Cari nama bibit..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400" />
          <button onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm transition-colors">
            <FaFilePdf size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase tracking-wider">
                <th className="text-left px-3 py-2.5 font-semibold rounded-tl-lg">Nama</th>
                <th className="text-right px-3 py-2.5 font-semibold">Stok</th>
                <th className="text-right px-3 py-2.5 font-semibold">Biaya</th>
                <th className="text-left px-3 py-2.5 font-semibold hidden sm:table-cell">Tanggal</th>
                <th className="text-right px-3 py-2.5 font-semibold hidden sm:table-cell">Total</th>
                <th className="text-center px-3 py-2.5 font-semibold rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50 dark:divide-gray-700">
              {paginatedData.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">Belum ada data bibit</td></tr>
              ) : paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-200">{item.nama_bibit}</td>
                  <td className="px-3 py-3 text-right text-gray-600 dark:text-gray-400">{item.stok}</td>
                  <td className="px-3 py-3 text-right text-gray-600 dark:text-gray-400">Rp {parseInt(item.biaya).toLocaleString("id-ID")}</td>
                  <td className="px-3 py-3 hidden sm:table-cell text-gray-600 dark:text-gray-400">{formatDate(item.tanggal)}</td>
                  <td className="px-3 py-3 text-right hidden sm:table-cell font-medium text-green-700 dark:text-green-400">Rp {parseInt(item.total).toLocaleString("id-ID")}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1.5 justify-center">
                      <button onClick={() => setEditForm({ ...item })}
                        className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg transition-colors">
                        <FaEdit size={12} />
                      </button>
                      <button onClick={() => handleHapus(item.id)}
                        className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 rounded-lg transition-colors">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Tampilkan</label>
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="text-xs border border-green-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none">
              {[5, 10, 15].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {totalPages > 1 && (
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${currentPage === i + 1
                    ? "bg-green-600 text-white" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-green-100 dark:border-gray-600"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800 dark:text-gray-100">Edit Bahan Bibit</h4>
              <button onClick={() => setEditForm(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-light">✕</button>
            </div>
            <div className="space-y-3">
              <InputField label="Nama Bibit" value={editForm.nama_bibit}
                onChange={(e) => setEditForm({ ...editForm, nama_bibit: e.target.value })} />
              <div className="grid grid-cols-2 gap-2.5">
                <InputField label="Stok" type="number" value={editForm.stok}
                  onChange={(e) => setEditForm({ ...editForm, stok: e.target.value })} />
                <InputField label="Biaya (Rp)" type="number" value={editForm.biaya}
                  onChange={(e) => setEditForm({ ...editForm, biaya: e.target.value })} />
              </div>
              <InputField label="Tanggal" type="date" value={editForm.tanggal}
                onChange={(e) => setEditForm({ ...editForm, tanggal: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditForm(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Batal
              </button>
              <button onClick={handleSaveEdit}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoriBibit;
