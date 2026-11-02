// ===== KERANJANG: hitung ulang dan tampilkan bar =====
function perbaruiKeranjang() {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

    let totalItem = 0;
    let totalHarga = 0;

    keranjang.forEach(function(item) {
        totalItem += item.jumlah;
        totalHarga += item.hargaSatuan * item.jumlah;
    });

    const bar = document.getElementById("cart-bar");

    if (totalItem > 0) {
        document.getElementById("cart-count").textContent = totalItem + " item";
        document.getElementById("cart-total").textContent =
            "Rp" + totalHarga.toLocaleString("id-ID") + " →";
        bar.style.display = "flex";
    } else {
        bar.style.display = "none";
    }
}

// jalan sekali saat halaman dibuka
perbaruiKeranjang();

// jalan lagi setiap kali catatan keranjang berubah (dari panel detail)
window.addEventListener("storage", function(event) {
    if (event.key === "keranjang") {
        perbaruiKeranjang();
    }
});


// ===== INFO MEJA DAN NAMA =====
const nomorMeja = localStorage.getItem("meja") || "-";
const namaTamu = localStorage.getItem("nama") || "Tamu";
document.getElementById("info-tamu").textContent =
    "Meja " + nomorMeja + " · Halo, " + namaTamu;


// ===== PANEL DETAIL MENU =====
function bukaDetail(event, kodeMenu) {
    event.preventDefault();

    document.getElementById("detail-frame").src =
        "customer_detail.html?menu=" + kodeMenu;

    document.getElementById("detail-overlay").style.display = "flex";
}

function tutupDetail() {
    document.getElementById("detail-overlay").style.display = "none";
    document.getElementById("detail-frame").src = "";

    // cadangan: perbarui bar setiap panel ditutup
    perbaruiKeranjang();
}


// FILTER KATEGORI 
// ===== FILTER KATEGORI + PENCARIAN =====
const tombolKategori = document.querySelectorAll(".chips .chip");
const daftarMenu = document.querySelectorAll(".menu-link");
const cariMenu = document.getElementById("cari-menu");

let kategoriAktif = "semua";

function saring() {
    const kataCari = cariMenu.value.trim().toLowerCase();

    daftarMenu.forEach(function(menu) {
        const nama = menu.querySelector(".item-name").textContent.toLowerCase();

        const cocokKategori = kategoriAktif === "semua" || menu.dataset.kategori === kategoriAktif;
        const cocokNama = nama.includes(kataCari);

        menu.style.display = (cocokKategori && cocokNama) ? "" : "none";
    });
}

tombolKategori.forEach(function(tombol) {
    tombol.addEventListener("click", function() {
        kategoriAktif = tombol.dataset.kategori;

        tombolKategori.forEach(function(item) {
            item.classList.remove("chip-on");
        });

        tombol.classList.add("chip-on");
        saring();
    });
});

cariMenu.addEventListener("input", saring);

// ===== TERIMA PESAN DARI PANEL DETAIL =====
window.addEventListener("message", function(event) {
    if (event.data === "tutup-detail") {
        tutupDetail();
    }
});