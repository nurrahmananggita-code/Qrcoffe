// Riwayat Pesanan: filter periode + pencarian, dan ekspor CSV sesuai baris yang tampil.
(function () {
    var tombol = document.getElementById("btn-ekspor");
    var tabel = document.getElementById("tabel-riwayat");
    var toast = document.getElementById("toast-notif");
    var selectPeriode = document.getElementById("filter-periode");
    var cari = document.getElementById("cari-riwayat");
    var info = document.getElementById("info-jumlah");
    if (!tombol || !tabel || !selectPeriode) { return; }

    // batas maksimal "berapa hari yang lalu" untuk tiap pilihan periode
    var BATAS_HARI = { "hari-ini": 0, "7-hari": 6, "30-hari": 29 };

    function dua(n) { return (n < 10 ? "0" : "") + n; }

    function tampilToast(teks) {
        toast.textContent = teks;
        toast.classList.add("show");
        setTimeout(function () { toast.classList.remove("show"); }, 3000);
    }

    // ===== FILTER (periode + pencarian) =====
    function terapkanFilter() {
        var batas = BATAS_HARI[selectPeriode.value];
        var kata = cari ? cari.value.trim().toLowerCase() : "";
        var baris = tabel.querySelectorAll("tbody tr");
        var jumlah = 0;

        for (var i = 0; i < baris.length; i++) {
            var lalu = parseInt(baris[i].getAttribute("data-hari-lalu"), 10);
            var cocokPeriode = !isNaN(lalu) && lalu <= batas;
            var cocokCari = kata === "" || baris[i].textContent.toLowerCase().indexOf(kata) !== -1;
            var tampil = cocokPeriode && cocokCari;

            baris[i].style.display = tampil ? "" : "none";
            if (tampil) { jumlah++; }
        }

        if (info) { info.textContent = "Menampilkan " + jumlah + " pesanan"; }
    }

    selectPeriode.addEventListener("change", terapkanFilter);
    if (cari) { cari.addEventListener("input", terapkanFilter); }
    terapkanFilter();   // jalankan saat halaman dibuka

    // ===== EKSPOR =====

    // "Rp 59.400" -> 59400
    function keAngka(teks) {
        return teks.replace(/[^0-9]/g, "");
    }

    function bersihkan(teks) {
        teks = teks.replace(/●/g, "").replace(/\s+/g, " ").trim();
        // cegah formula injection saat dibuka di Excel
        if (/^[=+\-@]/.test(teks)) { teks = "'" + teks; }
        return '"' + teks.replace(/"/g, '""') + '"';
    }

    // n hari yang lalu -> "2026-11-10"
    function tanggalDariOffset(n) {
        var d = new Date();
        d.setDate(d.getDate() - n);
        return d.getFullYear() + "-" + dua(d.getMonth() + 1) + "-" + dua(d.getDate());
    }

    // "Hari ini, 20.00" + 0 hari lalu -> "2026-11-10 20:00"
    function waktuLengkap(tr, teksWaktu) {
        var lalu = parseInt(tr.getAttribute("data-hari-lalu"), 10);
        var bagian = teksWaktu.split(",");
        var jam = bagian.length > 1 ? bagian[1].trim().replace(".", ":") : "";
        if (isNaN(lalu)) { return teksWaktu; }
        return tanggalDariOffset(lalu) + (jam ? " " + jam : "");
    }

    function ekspor() {
        var baris = tabel.querySelectorAll("tbody tr");
        var data = [];

        for (var i = 0; i < baris.length; i++) {
            if (baris[i].style.display === "none") { continue; }   // lewati baris yang tersaring
            var sel = baris[i].querySelectorAll("td");
            if (sel.length < 7) { continue; }
            data.push([
                bersihkan(sel[0].textContent),                                   // No. pesanan
                bersihkan(waktuLengkap(baris[i], sel[1].textContent.trim())),    // Waktu (tanggal lengkap)
                bersihkan(sel[2].textContent),                                   // Meja
                bersihkan(sel[3].textContent),                                   // Nama
                bersihkan(sel[4].textContent),                                   // Pembayaran
                keAngka(sel[5].textContent),                                     // Total (angka, bisa dijumlah)
                bersihkan(sel[6].textContent)                                    // Status
            ]);
        }

        if (data.length === 0) {
            tampilToast("Tidak ada data untuk diekspor.");
            return;
        }

        var header = ["No. pesanan", "Waktu", "Meja", "Nama", "Pembayaran", "Total (Rp)", "Status"]
            .map(function (h) { return '"' + h + '"'; });

        // pemisah koma (standar CSV, terbaca di WPS/Excel/Google Sheets); BOM agar karakter terbaca benar
        var csv = "\ufeff" + [header].concat(data).map(function (r) { return r.join(","); }).join("\r\n");
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);

        var hariIni = tanggalDariOffset(0);
        var a = document.createElement("a");
        a.href = url;
        a.download = "riwayat-pesanan-" + selectPeriode.value + "-" + hariIni + ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

        tampilToast(data.length + " pesanan berhasil diekspor.");
    }

    tombol.addEventListener("click", ekspor);
})();