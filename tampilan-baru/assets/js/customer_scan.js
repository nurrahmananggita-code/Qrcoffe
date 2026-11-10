/* =========================================================
   customer_scan.js — halaman scan QR
   Mengatur pilihan meja demo dan membersihkan sesi lama.
   ========================================================= */

/* Sesi pesanan lama dibersihkan setiap halaman scan dibuka */
localStorage.removeItem("keranjang");
localStorage.removeItem("catatanPesanan");
localStorage.removeItem("noPesanan");
localStorage.removeItem("noTransaksi");
localStorage.removeItem("totalBayar");
localStorage.removeItem("metode");

var pilihMejaEl = document.getElementById("pilih-meja");
var btnScan = document.getElementById("btn-scan");

function pilihMeja() {
    btnScan.href = "customer_meja.html?meja=" + pilihMejaEl.value;
}

pilihMejaEl.addEventListener("change", pilihMeja);

/* Sesuaikan tombol dengan meja yang sedang dipilih saat halaman dibuka */
pilihMeja();
