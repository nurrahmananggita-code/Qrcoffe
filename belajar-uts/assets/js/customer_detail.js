// 1. Data setiap menu
const menus = {
    "kopi-susu-gula-aren": {
        nama: "Kopi Susu Gula Aren",
        foto: "../assets/images/kopi_susu_gula_aren.png",
        harga: 24000,
        large: 29000,
        deskripsi: "Espresso, susu segar, gula aren cair.",
        kategori: "Kopi",
        kafein: "Kafein sedang",
        ukuran: true,
        levelGula: true
    },

    "americano": {
        nama: "Americano",
        foto: "../assets/images/americano.png",
        harga: 20000,
        large: 25000,
        deskripsi: "Espresso dengan air panas, menghasilkan rasa kopi yang kuat.",
        kategori: "Kopi",
        kafein: "Kafein tinggi",
        ukuran: true,
        levelGula: true
    },

    "kopi-tubruk": {
        nama: "Kopi Tubruk",
        foto: "../assets/images/kopi_tubruk.png",
        harga: 15000,
        large: 20000,
        deskripsi: "Kopi tubruk tradisional, disajikan panas.",
        kategori: "Kopi",
        kafein: "Kafein tinggi",
        ukuran: true,
        levelGula: false
    },

    "matcha-latte": {
        nama: "Matcha Latte",
        foto: "../assets/images/matcha_latte.png",
        harga: 28000,
        large: 33000,
        deskripsi: "Matcha Jepang dengan susu, bisa panas atau dingin.",
        kategori: "Non-kopi",
        kafein: "Kafein sedang",
        ukuran: true,
        levelGula: true
    },

    "teh-tarik": {
        nama: "Teh Tarik",
        foto: "../assets/images/teh_tarik.png",
        harga: 18000,
        large: 23000,
        deskripsi: "Teh pekat dengan susu, ditarik sampai berbusa.",
        kategori: "Non-kopi",
        kafein: "Kafein rendah",
        ukuran: true,
        levelGula: true
    },

    "nasi-goreng-kampung": {
        nama: "Nasi Goreng Kampung",
        foto: "../assets/images/nasi_goreng_kampung.png",
        harga: 32000,
        deskripsi: "Nasi goreng bumbu rempah, telur, ayam suwir, kerupuk.",
        kategori: "Makanan Berat",
        kafein: "",
        ukuran: false,
        levelGula: false
    },

    "mie-goreng-jawa": {
        nama: "Mie Goreng Jawa",
        foto: "../assets/images/mie_goreng_jawa.png",
        harga: 30000,
        deskripsi: "Mie kuning dengan bumbu kecap manis dan sayur.",
        kategori: "Makanan Berat",
        kafein: "",
        ukuran: false,
        levelGula: false
    },

    "ayam-bakar-madu": {
        nama: "Ayam Bakar Madu",
        foto: "../assets/images/ayam_bakar_madu.png",
        harga: 38000,
        deskripsi: "Ayam bakar dengan olesan madu, nasi, dan lalapan.",
        kategori: "Makanan Berat",
        kafein: "",
        ukuran: false,
        levelGula: false
    },

    "pisang-goreng-keju": {
        nama: "Pisang Goreng Keju",
        foto: "../assets/images/pisang_goreng_keju.png",
        harga: 22000,
        deskripsi: "Pisang kepok goreng dengan parutan keju dan susu.",
        kategori: "Camilan",
        kafein: "",
        ukuran: false,
        levelGula: false
    },

    "kentang-goreng": {
        nama: "Kentang Goreng",
        foto: "../assets/images/kentang_goreng.png",
        harga: 20000,
        deskripsi: "Kentang goreng renyah dengan saus sambal.",
        kategori: "Camilan",
        kafein: "",
        ukuran: false,
        levelGula: false
    },

    "roti-bakar-cokelat": {
        nama: "Roti Bakar Cokelat",
        foto: "../assets/images/roti_bakar_cokelat.png",
        harga: 21000,
        deskripsi: "Roti tebal panggang dengan selai cokelat dan keju.",
        kategori: "Dessert",
        kafein: "",
        ukuran: false,
        levelGula: false
    },

    "puding-cokelat": {
        nama: "Puding Cokelat",
        foto: "../assets/images/puding_cokelat.png",
        harga: 17000,
        deskripsi: "Puding cokelat lembut dengan vla vanila.",
        kategori: "Dessert",
        kafein: "",
        ukuran: false,
        levelGula: false
    }
};


// 2. Membaca kode menu dari URL
const parameter = new URLSearchParams(window.location.search);
const kodeMenu = parameter.get("menu");

const menu = menus[kodeMenu] || menus["kopi-susu-gula-aren"];


// 3. Menampilkan informasi menu
document.getElementById("detail-name").textContent = menu.nama;

document.getElementById("detail-photo").src = menu.foto;
document.getElementById("detail-photo").alt = menu.nama;

document.getElementById("detail-price").textContent =
    "Rp" + menu.harga.toLocaleString("id-ID");

document.getElementById("detail-desc").textContent = menu.deskripsi;

document.getElementById("detail-category").textContent = menu.kategori;


// 4. Menampilkan atau menyembunyikan informasi kafein
const caffeine = document.getElementById("detail-caffeine");

if (menu.kafein) {
    caffeine.textContent = menu.kafein;
} else {
    caffeine.style.display = "none";
}


// 5. Membuat pilihan ukuran dan level gula
const pilihanMenu = document.getElementById("pilihan-menu");

if (menu.ukuran) {
    pilihanMenu.innerHTML += `
        <div class="detail-section">
            <h3>Ukuran</h3>

            <div class="option-group" id="grup-ukuran">
                <button type="button"
                        class="option active"
                        data-harga="0">Regular</button>

                <button type="button"
                        class="option"
                        data-harga="${menu.large - menu.harga}">Large</button>
            </div>

            <p class="option-note">Large + Rp${(menu.large - menu.harga).toLocaleString("id-ID")}</p>
        </div>
    `;
}

if (menu.levelGula) {
    pilihanMenu.innerHTML += `
        <div class="detail-section">
            <h3>Level Gula</h3>

            <div class="option-group" id="grup-gula">
                <button type="button" class="option">Less</button>
                <button type="button" class="option active">Normal</button>
                <button type="button" class="option">Extra</button>
            </div>
        </div>
    `;
}


// 6. Mengatur tombol pilihan
pilihanMenu.addEventListener("click", function(event) {
    if (event.target.classList.contains("option")) {
        const kelompok = event.target.parentElement;

        kelompok.querySelectorAll(".option").forEach(function(tombol) {
            tombol.classList.remove("active");
        });

        event.target.classList.add("active");

        if (event.target.dataset.harga !== undefined) {
            hargaUkuran = Number(event.target.dataset.harga);
            perbaruiHarga();
        }
    }
});


// 7. Mengatur jumlah pesanan
let jumlah = 1;
let hargaUkuran = 0;

const jumlahTeks = document.getElementById("jumlah");

document.getElementById("kurang").addEventListener("click", function() {
    if (jumlah > 1) {
        jumlah--;
        jumlahTeks.textContent = jumlah;
        perbaruiHarga();
    }
});

document.getElementById("tambah").addEventListener("click", function() {
    jumlah++;
    jumlahTeks.textContent = jumlah;
    perbaruiHarga();
});


// 8. Memperbarui harga pada tombol tambah
function perbaruiHarga() {
    const satuan = menu.harga + hargaUkuran;
    const total = satuan * jumlah;

    document.getElementById("detail-price").textContent =
        "Rp" + satuan.toLocaleString("id-ID");

    document.getElementById("tambah-keranjang").textContent =
        "Tambah · Rp" + total.toLocaleString("id-ID");
}

perbaruiHarga();


// 9. Tombol tambah keranjang
document.getElementById("tambah-keranjang").addEventListener("click", function() {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

    const ukuranAktif = document.querySelector("#grup-ukuran .option.active");
    const gulaAktif = document.querySelector("#grup-gula .option.active");

    keranjang.push({
        nama: menu.nama,
        foto: menu.foto,
        ukuran: ukuranAktif ? ukuranAktif.textContent : "",
        gula: gulaAktif ? gulaAktif.textContent : "",
        catatan: document.getElementById("catatan").value,
        jumlah: jumlah,
        hargaSatuan: menu.harga + hargaUkuran
    });

    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    if (window.parent !== window) {
        window.parent.postMessage("tutup-detail", "*");
    } else {
        window.location.href = "customer_menu.html";
    }
});