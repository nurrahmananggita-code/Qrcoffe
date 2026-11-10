/* =========================================================
   customer_pembayaran.js — halaman pembayaran
   Menghitung total bayar, membuat nomor pesanan,
   dan mengatur pilihan metode pembayaran.
   ========================================================= */

const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

let subtotal = 0;

keranjang.forEach(function (item) {
    subtotal = subtotal + item.hargaSatuan * item.jumlah;
});

const total = subtotal;

localStorage.setItem("totalBayar", total);
document.getElementById("total-bayar").textContent = "Rp" + total.toLocaleString("id-ID");

localStorage.setItem("metode", "QRIS");

/* Nomor pesanan dibuat sekali per sesi */
let noPesanan = localStorage.getItem("noPesanan");

if (!noPesanan) {
    noPesanan = "A-" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("noPesanan", noPesanan);
}

document.getElementById("no-pesanan").textContent = noPesanan;

/* ---------- Pilihan metode pembayaran ---------- */
const kartuQris = document.getElementById("metode-qris");
const kartuTransfer = document.getElementById("metode-transfer");
const kartuQr = document.getElementById("qr-card");

function pilihMetode(metode) {
    if (metode === "qris") {
        localStorage.setItem("metode", "QRIS");
        kartuQris.classList.add("metode-on");
        kartuTransfer.classList.remove("metode-on");
        kartuQr.style.display = "block";
    } else {
        localStorage.setItem("metode", "Transfer");
        kartuTransfer.classList.add("metode-on");
        kartuQris.classList.remove("metode-on");
        kartuQr.style.display = "none";
    }
}

kartuQris.addEventListener("click", function () {
    pilihMetode("qris");
});

kartuTransfer.addEventListener("click", function () {
    pilihMetode("transfer");
});
