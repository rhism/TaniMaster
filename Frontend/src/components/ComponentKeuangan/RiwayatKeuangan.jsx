import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaPlus, FaEdit, FaTrash, FaFilePdf, FaHistory } from "react-icons/fa";

const tipeConfig = {
  Pendapatan:  { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  dot: "bg-green-500" },
  Pengeluaran: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",          dot: "bg-red-500" },
  Pinjaman:    { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-500" },
  Modal:       { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", dot: "bg-purple-500" },
};

const TipeBadge = ({ tipe }) => {
  const cfg = tipeConfig[tipe] || { color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {tipe}
    </span>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>}
    <input
      {...props}
      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  </div>
);

const emptyForm = { tanggal: "", tipe: "Pendapatan", deskripsi: "", nominal: "" };

const RiwayatKeuangan = ({ riwayatKeuangan, onAdd, onUpdate, onDelete }) => {
  const [newData, setNewData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTipe, setSearchTipe] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = riwayatKeuangan.filter((item) => (searchTipe ? item.tipe === searchTipe : true));
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAdd = () => {
    if (newData.tanggal && newData.deskripsi && newData.nominal) {
      onAdd({ ...newData, nominal: parseFloat(newData.nominal) });
      setNewData(emptyForm);
    }
  };

  const saveEdit = () => {
    if (editData) {
      onUpdate({ ...editData, nominal: parseFloat(editData.nominal) }, editData.index);
      setIsEditing(false);
      setEditData(null);
    }
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Riwayat Keuangan", 10, 10);
    doc.autoTable({
      head: [["Tanggal", "Tipe", "Deskripsi", "Nominal"]],
      body: filteredData.map((item) => [item.tanggal, item.tipe, item.deskripsi, `Rp ${item.nominal.toLocaleString()}`]),
      startY: 20,
    });
    doc.save("Riwayat_Keuangan.pdf");
  };

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
            <FaHistory size={16} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Riwayat Keuangan</h3>
            <p className="text-xs text-gray-400">{riwayatKeuangan.length} transaksi tercatat</p>
          </div>
        </div>
        <button
          onClick={handlePrintPDF}
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-2 rounded-xl transition-colors"
        >
          <FaFilePdf size={13} />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>

      {/* Add Form */}
      <div className="px-5 py-4 border-b border-green-50 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tambah Transaksi</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <InputField label="Tanggal" type="date" name="tanggal" value={newData.tanggal}
            onChange={(e) => setNewData((p) => ({ ...p, tanggal: e.target.value }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Tipe</label>
            <select name="tipe" value={newData.tipe} onChange={(e) => setNewData((p) => ({ ...p, tipe: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="Pendapatan">Pendapatan</option>
              <option value="Pengeluaran">Pengeluaran</option>
              <option value="Pinjaman">Pinjaman</option>
              <option value="Modal">Modal</option>
            </select>
          </div>
          <InputField label="Deskripsi" type="text" name="deskripsi" placeholder="Deskripsi..." value={newData.deskripsi}
            onChange={(e) => setNewData((p) => ({ ...p, deskripsi: e.target.value }))} />
          <InputField label="Nominal (Rp)" type="number" name="nominal" placeholder="0" value={newData.nominal}
            onChange={(e) => setNewData((p) => ({ ...p, nominal: e.target.value }))} />
        </div>
        <button onClick={handleAdd}
          className="mt-3 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm shadow-green-200">
          <FaPlus size={12} /> Tambah Transaksi
        </button>
      </div>

      {/* Filter */}
      <div className="px-5 py-3 border-b border-green-50 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Filter Tipe:</label>
        <select value={searchTipe} onChange={(e) => { setSearchTipe(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400">
          <option value="">Semua Tipe</option>
          <option value="Pendapatan">Pendapatan</option>
          <option value="Pengeluaran">Pengeluaran</option>
          <option value="Pinjaman">Pinjaman</option>
          <option value="Modal">Modal</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-semibold">Tanggal</th>
              <th className="text-left px-4 py-3 font-semibold">Tipe</th>
              <th className="text-left px-4 py-3 font-semibold">Deskripsi</th>
              <th className="text-right px-4 py-3 font-semibold">Nominal</th>
              <th className="text-center px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400 dark:text-gray-500">
                  <FaHistory size={24} className="mx-auto mb-2 opacity-30" />
                  <p>Belum ada transaksi</p>
                </td>
              </tr>
            ) : paginatedData.map((item, index) => (
              <tr key={index} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">{formatDate(item.tanggal)}</td>
                <td className="px-4 py-3.5"><TipeBadge tipe={item.tipe} /></td>
                <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 max-w-xs truncate">{item.deskripsi}</td>
                <td className="px-4 py-3.5 text-right font-semibold text-gray-800 dark:text-gray-200">
                  Rp {item.nominal.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 justify-center">
                    <button onClick={() => { setEditData({ ...item, index: (currentPage - 1) * itemsPerPage + index }); setIsEditing(true); }}
                      className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors">
                      <FaEdit size={13} />
                    </button>
                    <button onClick={() => onDelete((currentPage - 1) * itemsPerPage + index)}
                      className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 border-t border-green-50 dark:border-gray-700 bg-green-50/30 dark:bg-gray-700/20">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">Tampilkan</label>
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="text-xs border border-green-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-green-400">
            {[5, 10, 15].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs text-gray-500 dark:text-gray-400">per halaman</span>
        </div>
        {totalPages > 1 && (
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${currentPage === i + 1
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-600 border border-green-100 dark:border-gray-600"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Edit Transaksi</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-light">✕</button>
            </div>
            <div className="space-y-3">
              <InputField label="Tanggal" type="date" value={editData.tanggal}
                onChange={(e) => setEditData((p) => ({ ...p, tanggal: e.target.value }))} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Tipe</label>
                <select value={editData.tipe} onChange={(e) => setEditData((p) => ({ ...p, tipe: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="Pendapatan">Pendapatan</option>
                  <option value="Pengeluaran">Pengeluaran</option>
                  <option value="Pinjaman">Pinjaman</option>
                  <option value="Modal">Modal</option>
                </select>
              </div>
              <InputField label="Deskripsi" type="text" value={editData.deskripsi}
                onChange={(e) => setEditData((p) => ({ ...p, deskripsi: e.target.value }))} />
              <InputField label="Nominal (Rp)" type="number" value={editData.nominal}
                onChange={(e) => setEditData((p) => ({ ...p, nominal: e.target.value }))} />
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Batal
              </button>
              <button onClick={saveEdit}
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

export default RiwayatKeuangan;
