import React, { useState, useEffect } from "react";
import axios from "../../config/axiosInstance";
import LayoutKeuangan from "../../components/Layout/LayoutKeuangan";
import HeaderKeuangan from "../../components/ComponentKeuangan/HeaderKeuangan";
import RiwayatKeuangan from "../../components/ComponentKeuangan/RiwayatKeuangan";

const calculateSummary = (transactions) => {
  let totalPendapatan = 0;
  let totalPengeluaran = 0;
  let totalPinjaman = 0;
  let totalModal = 0;

  transactions.forEach((item) => {
    switch (item.tipe) {
      case "Pendapatan":
        totalPendapatan += item.nominal;
        break;
      case "Pengeluaran":
        totalPengeluaran += item.nominal;
        break;
      case "Pinjaman":
        totalPinjaman += item.nominal;
        break;
      case "Modal":
        totalModal += item.nominal;
        break;
      default:
        break;
    }
  });

  return {
    totalPendapatan,
    totalPengeluaran,
    totalPinjaman,
    totalModal,
    totalSaldo: totalPendapatan - totalPengeluaran + totalPinjaman + totalModal,
  };
};

const KeuanganPage = () => {
  const [riwayatKeuangan, setRiwayatKeuangan] = useState([
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/riwayat-keuangan");
        setRiwayatKeuangan(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const summary = calculateSummary(riwayatKeuangan);

  const handleAdd = async (newTransaction) => {
    try {
      const response = await axios.post("/api/riwayat-keuangan",
        newTransaction)
      setRiwayatKeuangan([...riwayatKeuangan, newTransaction]);
    } catch (error) {
      
    }
  };

  const handleUpdate = async (updatedTransaction, index) => {
    try {
      const {id,...data} = updatedTransaction;
      await axios.put(`/api/riwayat-keuangan/${id}`, data);
      const updatedRiwayat = [...riwayatKeuangan];
      updatedRiwayat[index] = updatedTransaction;
      setRiwayatKeuangan(updatedRiwayat);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const transaction = riwayatKeuangan[index];
      await axios.delete(`/api/riwayat-keuangan/${transaction.id}`);
      const filteredRiwayat = riwayatKeuangan.filter((_, i) => i !== index);
      setRiwayatKeuangan(filteredRiwayat);
    } catch (error) {
      
    }
  };

  return (
    <LayoutKeuangan>
      {/* Header Section */}
      <HeaderKeuangan summary={summary} />

      {/* Main Content */}
      <RiwayatKeuangan 
        riwayatKeuangan={riwayatKeuangan} 
        onAdd={handleAdd} 
        onUpdate={handleUpdate} 
        onDelete={handleDelete} 
      />
    </LayoutKeuangan>
  );
};

export default KeuanganPage;