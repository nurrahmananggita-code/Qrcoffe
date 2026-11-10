// Kelola Kategori: tambah, edit, tampil/sembunyikan, hapus.
// Memakai event delegation, jadi baris yang baru ditambahkan langsung berfungsi.
(function () {
    var tabel = document.getElementById("daftar-kategori");
    var input = document.getElementById("input-kategori");
    var tombol = document.getElementById("btn-tambah-kategori");
    var pesan = document.getElementById("error-kategori");

    var IKON_HAPUS =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/>' +
        '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>' +
        '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';

    function tampilPesan(teks) {
        pesan.textContent = teks;
        pesan.style.display = teks ? "block" : "none";
    }

    // abaikan: elemen .cat-name yang sedang diedit (supaya tidak dianggap duplikat dirinya sendiri)
    function namaSudahAda(nama, abaikan) {
        var daftar = tabel.querySelectorAll(".cat-name");
        for (var i = 0; i < daftar.length; i++) {
            if (daftar[i] === abaikan) { continue; }
            if (daftar[i].textContent.trim().toLowerCase() === nama.toLowerCase()) { return true; }
        }
        return false;
    }

    function buatBaris(nama) {
        var tr = document.createElement("tr");
        tr.innerHTML =
            '<td class="cat-drag">⋮⋮</td>' +
            '<td><p class="cat-name"></p><p class="cat-count">0 menu</p></td>' +
            '<td class="cat-right"><span class="badge-show">● Tampil</span></td>' +
            '<td class="cat-right"><label class="switch"><input type="checkbox" checked>' +
                '<span class="slider"></span></label></td>' +
            '<td class="cat-right">' +
                '<button type="button" class="icon-btn icon-edit" title="Edit">✎</button> ' +
                '<button type="button" class="icon-btn icon-delete" title="Hapus">' + IKON_HAPUS + '</button>' +
            '</td>';
        tr.querySelector(".cat-name").textContent = nama;   // textContent: aman dari HTML injection
        return tr;
    }

    function tambahKategori() {
        var nama = input.value.replace(/\s+/g, " ").trim();

        if (nama === "") {
            tampilPesan("Nama kategori wajib diisi.");
            input.focus();
            return;
        }
        if (namaSudahAda(nama)) {
            tampilPesan("Kategori \"" + nama + "\" sudah ada.");
            input.focus();
            return;
        }

        tabel.appendChild(buatBaris(nama));
        input.value = "";
        tampilPesan("");
        input.focus();
    }

    tombol.addEventListener("click", tambahKategori);

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); tambahKategori(); }
    });
    input.addEventListener("input", function () { tampilPesan(""); });

    // Switch tampil/sembunyi
    tabel.addEventListener("change", function (e) {
        var sw = e.target;
        if (!sw.matches || !sw.matches(".switch input")) { return; }
        var label = sw.closest("tr").querySelector(".badge-show, .badge-hide");
        if (sw.checked) {
            label.className = "badge-show";
            label.textContent = "● Tampil";
        } else {
            label.className = "badge-hide";
            label.textContent = "● Disembunyikan";
        }
    });

    // Hapus kategori
    tabel.addEventListener("click", function (e) {
        var btn = e.target.closest(".icon-delete");
        if (!btn) { return; }
        var baris = btn.closest("tr");
        var nama = baris.querySelector(".cat-name").textContent;
        if (window.confirm("Hapus kategori \"" + nama + "\"?")) { baris.remove(); }
    });

    // ===== Edit nama kategori (inline) =====
    function akhiriEdit(editInput, namaEl, btn) {
        editInput.remove();
        namaEl.style.display = "";
        btn.textContent = "✎";
        btn.title = "Edit";
    }

    function simpanEdit(editInput, namaEl, btn) {
        var namaBaru = editInput.value.replace(/\s+/g, " ").trim();

        if (namaBaru === "") {
            alert("Nama kategori wajib diisi.");
            editInput.focus();
            return;
        }
        if (namaSudahAda(namaBaru, namaEl)) {
            alert("Kategori \"" + namaBaru + "\" sudah ada.");
            editInput.focus();
            return;
        }

        namaEl.textContent = namaBaru;
        akhiriEdit(editInput, namaEl, btn);
    }

    tabel.addEventListener("click", function (e) {
        var btn = e.target.closest(".icon-edit");
        if (!btn) { return; }

        var baris = btn.closest("tr");
        var namaEl = baris.querySelector(".cat-name");
        var editInput = baris.querySelector(".cat-edit-input");

        // sedang mode edit: klik tombol lagi = simpan
        if (editInput) {
            simpanEdit(editInput, namaEl, btn);
            return;
        }

        editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "form-input cat-edit-input";
        editInput.maxLength = 40;
        editInput.value = namaEl.textContent.trim();

        namaEl.style.display = "none";
        namaEl.parentNode.insertBefore(editInput, namaEl);
        btn.textContent = "✔";
        btn.title = "Simpan";
        editInput.focus();
        editInput.select();

        editInput.addEventListener("keydown", function (ev) {
            if (ev.key === "Enter") {
                ev.preventDefault();
                simpanEdit(editInput, namaEl, btn);
            } else if (ev.key === "Escape") {
                akhiriEdit(editInput, namaEl, btn);
            }
        });
    });
})();