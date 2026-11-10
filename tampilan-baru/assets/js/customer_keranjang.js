/* =========================================================
   customer_keranjang.js — halaman keranjang
   Menampilkan isi keranjang dari localStorage, mengubah
   jumlah, dan menghitung total.
   ========================================================= */

let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
const daftar = document.getElementById("daftar-keranjang");
const barCheckout = document.getElementById("checkout-bar");

/* ---------- Menggambar ulang isi keranjang ---------- */
function tampilkan() {
    daftar.innerHTML = "";
    let total = 0;

    /* Keranjang kosong */
    if (keranjang.length === 0) {
        daftar.innerHTML = `
            <div class="cart-empty">
                <p>Keranjang masih kosong</p>
                <span class="muted">Yuk pilih menu favoritmu dulu.</span>
                <a href="customer_menu.html" class="btn">Lihat Menu</a>
            </div>
        `;
        barCheckout.style.display = "none";
        return;
    }

    /* Ada isinya */
    keranjang.forEach(function (item, nomor) {
        const subtotal = item.hargaSatuan * item.jumlah;
        total += subtotal;

        let opsi = "";

        if (item.ukuran) {
            opsi += item.ukuran;
        }

        if (item.gula) {
            opsi += (opsi ? " · " : "") + "gula " + item.gula;
        }

        if (item.catatan) {
            opsi += (opsi ? " · " : "") + item.catatan;
        }

        if (opsi === "") {
            opsi = "Makanan";
        }

        daftar.innerHTML += `
            <div class="menu-item">
                <img src="${item.foto}" alt="${item.nama}" class="cart-photo">

                <div class="item-info">
                    <p class="item-name">${item.nama}</p>
                    <p class="item-desc">${opsi}</p>
                    <p class="item-price">Rp${subtotal.toLocaleString("id-ID")}</p>
                </div>

                <div class="quantity">
                    <button type="button" class="quantity-btn"
                            data-nomor="${nomor}" data-aksi="kurang"
                            aria-label="Kurangi ${item.nama}">−</button>
                    <span>${item.jumlah}</span>
                    <button type="button" class="quantity-btn"
                            data-nomor="${nomor}" data-aksi="tambah"
                            aria-label="Tambah ${item.nama}">+</button>
                </div>
            </div>
        `;
    });

    document.getElementById("total-harga").textContent =
        "Rp" + total.toLocaleString("id-ID");
    barCheckout.style.display = "flex";
}

/* ---------- Tombol − dan + ---------- */
daftar.addEventListener("click", function (event) {
    const tombol = event.target;

    if (!tombol.classList.contains("quantity-btn")) {
        return;
    }

    const nomor = Number(tombol.dataset.nomor);

    if (tombol.dataset.aksi === "tambah") {
        keranjang[nomor].jumlah++;
    } else {
        keranjang[nomor].jumlah--;

        /* Kalau jumlah jadi 0, hapus dari keranjang */
        if (keranjang[nomor].jumlah === 0) {
            keranjang.splice(nomor, 1);
        }
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    tampilkan();
});

/* ---------- Tampilkan pertama kali ---------- */
tampilkan();
