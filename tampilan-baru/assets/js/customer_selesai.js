/* =========================================================
   customer_selesai.js — halaman pembayaran berhasil
   Menampilkan metode, total, dan nomor transaksi.
   ========================================================= */

const totalBayar = Number(localStorage.getItem("totalBayar")) || 0;

document.getElementById("total-bayar").textContent =
    "Rp" + totalBayar.toLocaleString("id-ID");

document.getElementById("metode-bayar").textContent =
    localStorage.getItem("metode") || "QRIS";

/* Nomor transaksi dibuat sekali per sesi */
let noTransaksi = localStorage.getItem("noTransaksi");

if (!noTransaksi) {
    noTransaksi = "TRX-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("noTransaksi", noTransaksi);
}

document.getElementById("no-transaksi").textContent = noTransaksi;
