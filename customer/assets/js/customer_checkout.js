const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

// Kalau keranjang kosong, kembalikan ke halaman keranjang
if (keranjang.length === 0) {
    window.location.href = "customer_keranjang.html";
}

const daftar = document.getElementById("daftar-ringkasan");
let subtotal = 0;

// Satu baris untuk tiap menu
keranjang.forEach(function(item) {
    const harga = item.hargaSatuan * item.jumlah;
    subtotal += harga;

    daftar.innerHTML += `
        <div class="summary-row">
            <span>${item.jumlah}× ${item.nama}</span>
            <span>Rp${harga.toLocaleString("id-ID")}</span>
            </div>
        `;
    });

// Hitung pajak 10% dan total
const pajak = Math.round(subtotal * 0.1);
const total = subtotal + pajak;

document.getElementById("subtotal").textContent = "Rp" + subtotal.toLocaleString("id-ID");
document.getElementById("pajak").textContent = "Rp" + pajak.toLocaleString("id-ID");
document.getElementById("total").textContent = "Rp" + total.toLocaleString("id-ID");

// LANGKAH 3: Simpan catatan sebelum pindah ke halaman pembayaran
document.getElementById("tombol-bayar").addEventListener("click", function() {
    localStorage.setItem(
        "catatanPesanan",
        document.getElementById("catatan-pesanan").value
    );
});

const namaTamu = localStorage.getItem("nama") || "Tamu";
const nomorMeja = localStorage.getItem("meja") || "-";
document.getElementById("info-pemesan").textContent = namaTamu + " · Meja " + nomorMeja;