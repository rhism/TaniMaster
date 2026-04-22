import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaPlus, FaEdit, FaTrash, FaFilePdf, FaLeaf } from "react-icons/fa";

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
    <input {...props}
      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
  </div>
);

const emptyForm = { bibit: "", jumlah: "", waktu: "" };

const Produksi = () => {
  const [produksiData, setProduksiData] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddData = () => {
    if (!formData.bibit || !formData.jumlah || !formData.waktu) return;
    if (editIndex !== null) {
      const updated = [...produksiData];
      updated[editIndex] = formData;
      setProduksiData(updated);
      setEditIndex(null);
    } else {
      setProduksiData([...produksiData, formData]);
    }
    setFormData(emptyForm);
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(produksiData[(currentPage - 1) * itemsPerPage + index]);
    setEditIndex((currentPage - 1) * itemsPerPage + index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Hapus data ini?")) return;
    setProduksiData(produksiData.filter((_, i) => i !== (currentPage - 1) * itemsPerPage + index));
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text("Tabel Produksi", 20, 10);
    doc.autoTable({ head: [["Nama Bibit", "Jumlah", "Waktu Ditanam"]], body: produksiData.map((d) => [d.bibit, d.jumlah, d.waktu]), startY: 20 });
    doc.save("tabel-produksi.pdf");
  };

  const totalPages = Math.max(1, Math.ceil(produksiData.length / itemsPerPage));
  const currentItems = produksiData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const formatDate = (d) => { try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-green-50 dark:border-gray-700">
        <div className="flex items-center gap-2.5">
          <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 p-2 rounded-xl">
            <FaLeaf size={16} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Data Produksi</h3>
            <p className="text-xs text-gray-400">{produksiData.length} data tersimpan</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm transition-colors">
            <FaFilePdf size={13} />
          </button>
          <button onClick={() => { setFormData(emptyForm); setEditIndex(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm shadow-green-200">
            <FaPlus size={12} />
            <span className="hidden sm:inline">Tambah Produksi</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-semibold">Nama Bibit</th>
              <th className="text-right px-4 py-3 font-semibold">Jumlah</th>
              <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Waktu Ditanam</th>
              <th className="text-center px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50 dark:divide-gray-700">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400 dark:text-gray-500">
                  <FaLeaf size={24} className="mx-auto mb-2 opacity-30" />
                  <p>Belum ada data produksi</p>
                </td>
              </tr>
            ) : currentItems.map((data, index) => (
              <tr key={index} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-200">{data.bibit}</td>
                <td className="px-4 py-3.5 text-right text-gray-600 dark:text-gray-400">{data.jumlah}</td>
                <td className="px-4 py-3.5 hidden sm:table-cell text-gray-600 dark:text-gray-400">{formatDate(data.waktu)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-center">
                    <button onClick={() => handleEdit(index)}
                      className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg transition-colors">
                      <FaEdit size={13} />
                    </button>
                    <button onClick={() => handleDelete(index)}
                      className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 rounded-lg transition-colors">
                      <FaTrash size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-green-50 dark:border-gray-700 bg-green-50/30 dark:bg-gray-700/20">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">{editIndex !== null ? "Edit Produksi" : "Tambah Produksi"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-light">✕</button>
            </div>
            <div className="space-y-3">
              <InputField label="Nama Bibit" name="bibit" placeholder="Contoh: Cabai Merah" value={formData.bibit} onChange={handleInputChange} />
              <InputField label="Jumlah" type="number" name="jumlah" placeholder="0" value={formData.jumlah} onChange={handleInputChange} />
              <InputField label="Waktu Ditanam" type="date" name="waktu" value={formData.waktu} onChange={handleInputChange} />
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Batal
              </button>
              <button onClick={handleAddData}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                {editIndex !== null ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produksi;
