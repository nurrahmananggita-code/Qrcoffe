/* =========================================================
   customer_meja.js — halaman informasi meja
   Membaca nomor meja dari URL, menyimpan nama pemesan.
   ========================================================= */

var params = new URLSearchParams(window.location.search);
var meja = params.get("meja") || localStorage.getItem("meja") || "-";

localStorage.setItem("meja", meja);
document.getElementById("nomor-meja").textContent = "Meja " + meja;

/* Kalau nama pernah diisi, tampilkan lagi supaya tidak mengetik ulang */
var inputNama = document.getElementById("input-nama");
var namaTersimpan = localStorage.getItem("nama");

if (namaTersimpan) {
    inputNama.value = namaTersimpan;
}

function simpanNama() {
    const nama = inputNama.value.trim();
    localStorage.setItem("nama", nama);
}

document.getElementById("form-nama").addEventListener("submit", simpanNama);
