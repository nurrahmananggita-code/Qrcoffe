// ===== DATA MENU (kata = kata kunci yang dicocokkan dengan cerita) =====
const menus = [
    { slug: "kopi-susu-gula-aren", nama: "Kopi Susu Gula Aren", harga: 24000, foto: "kopi_susu_gula_aren.png", kopi: true,
      kata: ["manis", "dingin", "susu", "segar", "nggak pahit", "gak pahit", "tidak pahit", "kopi"] },
    { slug: "americano", nama: "Americano", harga: 20000, foto: "americano.png", kopi: true,
      kata: ["pahit", "kuat", "ngantuk", "kafein", "kerja", "fokus", "kopi"] },
    { slug: "kopi-tubruk", nama: "Kopi Tubruk", harga: 15000, foto: "kopi_tubruk.png", kopi: true,
      kata: ["pahit", "kuat", "ngantuk", "kafein", "kerja", "hangat", "panas", "murah", "tradisional", "kopi"] },
    { slug: "matcha-latte", nama: "Matcha Latte", harga: 28000, foto: "matcha_latte.png", kopi: false,
      kata: ["matcha", "manis", "creamy", "susu", "dingin", "hangat", "nggak mau kopi", "gak mau kopi", "tidak mau kopi"] },
    { slug: "teh-tarik", nama: "Teh Tarik", harga: 18000, foto: "teh_tarik.png", kopi: false,
      kata: ["teh", "creamy", "susu", "hangat", "panas", "manis", "santai", "nggak mau kopi", "gak mau kopi", "tidak mau kopi"] },
    { slug: "nasi-goreng-kampung", nama: "Nasi Goreng Kampung", harga: 32000, foto: "nasi_goreng_kampung.png", kopi: false,
      kata: ["lapar", "makan", "kenyang", "nasi", "pedas"] },
    { slug: "mie-goreng-jawa", nama: "Mie Goreng Jawa", harga: 30000, foto: "mie_goreng_jawa.png", kopi: false,
      kata: ["lapar", "makan", "kenyang", "mie"] },
    { slug: "ayam-bakar-madu", nama: "Ayam Bakar Madu", harga: 38000, foto: "ayam_bakar_madu.png", kopi: false,
      kata: ["lapar", "makan", "kenyang", "ayam", "madu"] },
    { slug: "pisang-goreng-keju", nama: "Pisang Goreng Keju", harga: 22000, foto: "pisang_goreng_keju.png", kopi: false,
      kata: ["ngemil", "camilan", "pisang", "keju", "manis", "asin"] },
    { slug: "kentang-goreng", nama: "Kentang Goreng", harga: 20000, foto: "kentang_goreng.png", kopi: false,
      kata: ["ngemil", "camilan", "kentang", "asin", "renyah"] },
    { slug: "roti-bakar-cokelat", nama: "Roti Bakar Cokelat", harga: 21000, foto: "roti_bakar_cokelat.png", kopi: false,
      kata: ["cokelat", "coklat", "manis", "roti", "hangat", "dessert"] },
    { slug: "puding-cokelat", nama: "Puding Cokelat", harga: 17000, foto: "puding_cokelat.png", kopi: false,
      kata: ["cokelat", "coklat", "manis", "dingin", "puding", "dessert"] }
];

// ===== ELEMEN HALAMAN =====
const kolomCerita = document.getElementById("rek-input");
const tombolTanya = document.getElementById("rek-tanya");
const areaForm = document.getElementById("rek-form");
const areaHasil = document.getElementById("rek-hasil");
const judul = document.getElementById("rek-judul");
const contohCerita = document.querySelectorAll(".rek-chip");

const popup = document.getElementById("rek-popup");
const popupFrame = document.getElementById("rek-popup-frame");

// klik area gelap = tutup pop-up
popup.addEventListener("click", function(e) {
    if (e.target === popup) {
        popup.hidden = true;
        popupFrame.src = "";
    }
});

// ===== BAR KERANJANG =====
const barKeranjang = document.getElementById("rek-cart");
const barItem = document.getElementById("rek-cart-item");
const barTotal = document.getElementById("rek-cart-total");

function perbaruiBarKeranjang() {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    let totalItem = 0;
    let totalHarga = 0;

    keranjang.forEach(function(item) {
        totalItem = totalItem + item.jumlah;
        totalHarga = totalHarga + item.jumlah * item.hargaSatuan;
    });

    if (totalItem === 0) {
        barKeranjang.hidden = true;
        return;
    }

    barItem.textContent = totalItem + " item";
    barTotal.textContent = "Rp" + totalHarga.toLocaleString("id-ID") + " →";
    barKeranjang.hidden = false;
}

perbaruiBarKeranjang();

// halaman detail (di dalam pop-up) mengirim pesan ini setelah klik Tambah
window.addEventListener("message", function(e) {
    if (e.data === "tutup-detail") {
        popup.hidden = true;
        popupFrame.src = "";
        perbaruiBarKeranjang();
    }
});

// ===== KLIK CONTOH CERITA: ISI KOLOM =====
contohCerita.forEach(function(tombol) {
    tombol.addEventListener("click", function() {
        kolomCerita.value = tombol.textContent;
    });
});

// ===== KLIK TOMBOL TANYA =====
tombolTanya.addEventListener("click", function() {
    const cerita = kolomCerita.value.trim();
    if (cerita === "") {
        alert("Ceritakan dulu seleramu ya 😊");
        return;
    }
    tampilkanHasil(cerita);
});

// ===== MENCARI MENU YANG COCOK =====
function cariRekomendasi(cerita) {
    const teks = cerita.toLowerCase();

    const tidakMauKopi = teks.includes("nggak mau kopi") || teks.includes("gak mau kopi")
        || teks.includes("tidak mau kopi") || teks.includes("tanpa kopi");
    const tidakPahit = teks.includes("nggak pahit") || teks.includes("gak pahit")
        || teks.includes("tidak pahit");

    const daftar = [];

    menus.forEach(function(menu) {
        // return di dalam forEach artinya "lewati menu ini"
        if (tidakMauKopi && menu.kopi) {
            return;
        }

        let skor = 0;
        const cocok = [];

        menu.kata.forEach(function(kata) {
            if (kata === "pahit" && tidakPahit) {
                return;
            }
            if (teks.includes(kata)) {
                skor = skor + 1;
                cocok.push(kata);
            }
        });

        if (skor > 0) {
            daftar.push({ menu: menu, skor: skor, cocok: cocok });
        }
    });

    // urutkan dari skor tertinggi, ambil 3 teratas
    daftar.sort(function(a, b) {
        return b.skor - a.skor;
    });
    return daftar.slice(0, 3);
}

function cariMenu(slug) {
    return menus.find(function(menu) {
        return menu.slug === slug;
    });
}

// ===== MENAMPILKAN HASIL =====
function tampilkanHasil(cerita) {
    let hasil = cariRekomendasi(cerita);

    // kalau tidak ada yang cocok, tampilkan menu favorit
    if (hasil.length === 0) {
        hasil = [
            { menu: cariMenu("kopi-susu-gula-aren"), cocok: [] },
            { menu: cariMenu("americano"), cocok: [] },
            { menu: cariMenu("matcha-latte"), cocok: [] }
        ];
    }

    let html = `
        <div class="rek-cerita">
            <p class="rek-cerita-label">Kamu bilang</p>
            <p class="rek-cerita-isi" id="rek-cerita-isi"></p>
        </div>
        <p class="rek-hasil-judul">Ini pilihan yang paling nyambung dengan ceritamu:</p>
    `;

    hasil.forEach(function(item, urutan) {
        const m = item.menu;

        let alasan = "Pilihan favorit pelanggan kami.";
        if (item.cocok.length > 0) {
            alasan = "Cocok karena kamu menyebut “" + item.cocok[0] + "”.";
        }

        let kelas = "rek-kartu";
        let badge = "";
        if (urutan === 0) {
            kelas = "rek-kartu rek-kartu-utama";
            badge = '<span class="rek-badge">Paling cocok</span>';
        }

        html += `
            <div class="${kelas}">
                ${badge}
                <div class="rek-kartu-atas">
                    <img src="../assets/images/${m.foto}" alt="${m.nama}" class="rek-foto">
                    <div>
                        <p class="rek-nama">${m.nama}</p>
                        <p class="rek-harga">Rp${m.harga.toLocaleString("id-ID")}</p>
                    </div>
                </div>
                <p class="rek-alasan">${alasan}</p>
                <a href="customer_detail.html?menu=${m.slug}" class="rek-lihat">Lihat &amp; Pesan</a>
            </div>
        `;
    });
    

    html += '<button type="button" id="rek-ulang" class="rek-ulang">Ceritakan ulang</button>';

    areaHasil.innerHTML = html;

    // teks cerita dipasang lewat textContent supaya aman
    document.getElementById("rek-cerita-isi").textContent = "“" + cerita + "”";

    areaForm.hidden = true;
    areaHasil.hidden = false;
    judul.textContent = "Hasil Rekomendasi";

        // tombol "Lihat & Pesan" membuka pop-up, bukan pindah halaman
    document.querySelectorAll(".rek-lihat").forEach(function(link) {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            popupFrame.src = link.href;
            popup.hidden = false;
        });
    }); 

    document.getElementById("rek-ulang").addEventListener("click", function() {
        areaHasil.hidden = true;
        areaForm.hidden = false;
        judul.textContent = "AI Barista";
        kolomCerita.value = "";
    });
}