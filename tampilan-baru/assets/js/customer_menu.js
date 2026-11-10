/* =========================================================
   customer_menu.js — halaman menu customer
   Isi: bar keranjang, info meja, panel detail menu,
        rak menu bergerak, filter kategori + pencarian,
        animasi klik/hover, dan perapian foto.
   ========================================================= */

/* ---------- 1. BAR KERANJANG ---------- */
function perbaruiKeranjang() {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

    let totalItem = 0;
    let totalHarga = 0;

    keranjang.forEach(function (item) {
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

perbaruiKeranjang();

window.addEventListener("storage", function (event) {
    if (event.key === "keranjang") {
        perbaruiKeranjang();
    }
});

/* ---------- 2. INFO MEJA DAN NAMA ---------- */
const nomorMeja = localStorage.getItem("meja") || "-";
const namaTamu = localStorage.getItem("nama") || "Tamu";

document.getElementById("info-tamu").textContent =
    "Meja " + nomorMeja + " · Halo, " + namaTamu;

const infoMeja = document.getElementById("info-meja");

if (infoMeja) {
    infoMeja.textContent = "Meja " + nomorMeja;
}

/* ---------- 3. PANEL DETAIL MENU ---------- */
const overlay = document.getElementById("detail-overlay");
const frame = document.getElementById("detail-frame");
const scroller = document.getElementById("menu-scroll");

function bukaDetail(kodeMenu) {
    frame.src = "customer_detail.html?menu=" + kodeMenu;
    overlay.style.display = "flex";
    scroller.style.overflowY = "hidden";
}

function tutupDetail() {
    overlay.style.display = "none";
    frame.src = "";
    scroller.style.overflowY = "";

    /* cadangan: bar keranjang ikut diperbarui setiap panel ditutup */
    perbaruiKeranjang();
}

/* satu pendengar untuk semua kartu, termasuk salinan di rak bergerak */
document.addEventListener("click", function (event) {
    const link = event.target.closest(".menu-link");

    if (!link) {
        return;
    }

    const kode = new URLSearchParams(link.search).get("menu");

    if (!kode) {
        return;
    }

    event.preventDefault();
    bukaDetail(kode);
});

document.getElementById("detail-close").addEventListener("click", tutupDetail);

overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
        tutupDetail();
    }
});

window.addEventListener("message", function (event) {
    if (event.data === "tutup-detail") {
        tutupDetail();
    }
});

/* ---------- 4. ANIMASI SAAT KARTU DIKLIK ---------- */
document.addEventListener("pointerdown", function (event) {
    const link = event.target.closest(".menu-link");

    if (!link) {
        return;
    }

    const kartu = link.querySelector(".menu-item");

    if (!kartu) {
        return;
    }

    const kotak = kartu.getBoundingClientRect();
    const kilau = document.createElement("span");

    kilau.className = "tap-flash";
    kilau.style.setProperty("--tx", ((event.clientX - kotak.left) / kotak.width * 100) + "%");
    kilau.style.setProperty("--ty", ((event.clientY - kotak.top) / kotak.height * 100) + "%");

    kartu.appendChild(kilau);
    window.setTimeout(function () { kilau.remove(); }, 560);

    kartu.classList.remove("is-tap");
    void kartu.offsetWidth;
    kartu.classList.add("is-tap");

    kartu.addEventListener("animationend", function () {
        kartu.classList.remove("is-tap");
    }, { once: true });
});

/* ---------- 5. FILTER KATEGORI + PENCARIAN ---------- */
const tombolKategori = document.querySelectorAll(".chips .chip");
const daftarMenu = document.querySelectorAll(".menu-link");
const cariMenu = document.getElementById("cari-menu");

let kategoriAktif = "semua";

function cocok(menu, kataCari) {
    const nama = menu.querySelector(".item-name").textContent.toLowerCase();
    const cocokKategori = kategoriAktif === "semua" || menu.dataset.kategori === kategoriAktif;

    return cocokKategori && nama.includes(kataCari);
}

function saring() {
    const kataCari = cariMenu.value.trim().toLowerCase();
    let urutan = 0;

    daftarMenu.forEach(function (menu) {
        if (cocok(menu, kataCari)) {
            menu.style.display = "";
            menu.style.setProperty("--d", (urutan * 45) + "ms");

            menu.classList.remove("masuk");
            void menu.offsetWidth;
            menu.classList.add("masuk");

            urutan += 1;
        } else {
            menu.style.display = "none";
        }
    });

    bangunRak(kataCari);
}

tombolKategori.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
        kategoriAktif = tombol.dataset.kategori;

        tombolKategori.forEach(function (item) {
            item.classList.remove("chip-on");
        });

        tombol.classList.add("chip-on");
        saring();

        tombol.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
});

cariMenu.addEventListener("input", saring);

/* ---------- 6. RAK MENU BERGERAK ---------- */
const rakTrack = document.getElementById("rak-track");
const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let rakBerhenti = false;
let rakPosisi = 0;

function bangunRak(kataCari) {
    if (!rakTrack) {
        return;
    }

    const semua = Array.from(daftarMenu);
    const terpilih = kataCari === undefined
        ? semua.filter(function (menu) { return menu.style.display !== "none"; })
        : semua.filter(function (menu) { return cocok(menu, kataCari); });

    const dasar = terpilih.length ? terpilih : semua;

    rakTrack.innerHTML = "";

    dasar.forEach(function (link, urutan) {
        const kartu = link.cloneNode(true);

        kartu.classList.add("rak-card");
        kartu.style.setProperty("--n", urutan);
        rakTrack.appendChild(kartu);
    });

    /* salinan kedua supaya putaran tidak terlihat melompat */
    Array.from(rakTrack.children).forEach(function (kartu) {
        const lagi = kartu.cloneNode(true);

        lagi.setAttribute("aria-hidden", "true");
        lagi.setAttribute("tabindex", "-1");
        rakTrack.appendChild(lagi);
    });

    rakPosisi = 0;
    rakTrack.scrollLeft = 0;
}

function jalankanRak() {
    if (!rakBerhenti && !kurangiGerak && rakTrack) {
        const setengah = rakTrack.scrollWidth / 2;

        if (setengah > rakTrack.clientWidth) {
            rakPosisi += 0.4;

            if (rakPosisi >= setengah) {
                rakPosisi -= setengah;
            }

            rakTrack.scrollLeft = rakPosisi;
        }
    }

    window.requestAnimationFrame(jalankanRak);
}

if (rakTrack) {
    ["pointerenter", "pointerdown"].forEach(function (nama) {
        rakTrack.addEventListener(nama, function () { rakBerhenti = true; });
    });

    ["pointerleave", "pointerup", "pointercancel"].forEach(function (nama) {
        rakTrack.addEventListener(nama, function () {
            rakPosisi = rakTrack.scrollLeft;
            rakBerhenti = false;
        });
    });
}

bangunRak();

if (!kurangiGerak) {
    window.requestAnimationFrame(jalankanRak);
}

/* ---------- 7. GARIS BAWAH SAAT ALAT MENU MENEMPEL ---------- */
const menuTools = document.getElementById("menu-tools");

scroller.addEventListener("scroll", function () {
    const batas = scroller.getBoundingClientRect().top;
    const posisi = menuTools.getBoundingClientRect().top;
    menuTools.classList.toggle("is-stuck", posisi <= batas + 1);
}, { passive: true });

/* ---------- 8. MENYERAGAMKAN UKURAN OBJEK FOTO MENU ---------- */
function seragamkanFoto() {
    const KANVAS = 600;   /* ukuran kanvas akhir (persegi) */
    const ISI = 0.9;      /* objek memenuhi 90% kanvas */

    document.querySelectorAll(".menu-page .item-photo").forEach(function (img) {
        function proses() {
            if (img.dataset.rapi) {
                return;
            }

            const w = img.naturalWidth;
            const h = img.naturalHeight;

            if (!w || !h) {
                return;
            }

            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;

            const ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0);

            let data;

            try {
                data = ctx.getImageData(0, 0, w, h).data;
            } catch (e) {
                return;
            }

            /* cari batas objek yang tidak transparan */
            let atas = h, bawah = 0, kiri = w, kanan = 0;

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    if (data[(y * w + x) * 4 + 3] > 120) {
                        if (y < atas) atas = y;
                        if (y > bawah) bawah = y;
                        if (x < kiri) kiri = x;
                        if (x > kanan) kanan = x;
                    }
                }
            }

            if (bawah <= atas || kanan <= kiri) {
                return;
            }

            const bw = kanan - kiri + 1;
            const bh = bawah - atas + 1;
            const skala = Math.min(KANVAS * ISI / bw, KANVAS * ISI / bh);
            const dw = bw * skala;
            const dh = bh * skala;

            const out = document.createElement("canvas");
            out.width = KANVAS;
            out.height = KANVAS;
            out.getContext("2d").drawImage(
                img, kiri, atas, bw, bh,
                (KANVAS - dw) / 2,
                KANVAS - dh - KANVAS * (1 - ISI) / 2,
                dw, dh
            );

            img.dataset.rapi = "1";
            img.src = out.toDataURL("image/png");
        }

        if (img.complete) {
            proses();
        } else {
            img.addEventListener("load", proses);
        }
    });
}

window.addEventListener("load", seragamkanFoto);
