const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

/* Kalau keranjang kosong, kembalikan ke halaman keranjang */
if (keranjang.length === 0) {
    window.location.href = "customer_keranjang.html";
}

const daftar = document.getElementById("daftar-ringkasan");
let subtotal = 0;

/* Satu baris untuk tiap menu */
keranjang.forEach(function (item) {
    const harga = item.hargaSatuan * item.jumlah;
    subtotal += harga;

    daftar.innerHTML += `
        <div class="summary-row">
            <span>${item.jumlah}× ${item.nama}</span>
            <span>Rp${harga.toLocaleString("id-ID")}</span>
        </div>
    `;
});

/* Tanpa pajak: total sama dengan subtotal */
const total = subtotal;

document.getElementById("subtotal").textContent = "Rp" + subtotal.toLocaleString("id-ID");
document.getElementById("total").textContent = "Rp" + total.toLocaleString("id-ID");

/* Info pemesan */
const namaTamu = localStorage.getItem("nama") || "Tamu";
const nomorMeja = localStorage.getItem("meja") || "-";

document.getElementById("info-pemesan").textContent = namaTamu + " · Meja " + nomorMeja;

/* Catatan: tampilkan yang tersimpan, simpan setiap kali mengetik */
const kolomCatatan = document.getElementById("catatan-pesanan");
const catatanTersimpan = localStorage.getItem("catatanPesanan");

if (catatanTersimpan) {
    kolomCatatan.value = catatanTersimpan;
}

kolomCatatan.addEventListener("input", function () {
    localStorage.setItem("catatanPesanan", kolomCatatan.value);
});