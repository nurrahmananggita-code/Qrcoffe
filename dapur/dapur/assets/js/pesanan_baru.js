// ===== FUNGSI CETAK (kode kamu, tidak diubah) =====

// Membuat tiket cetak dari satu kartu pesanan
function buatTiket(card) {
    var salinan = card.cloneNode(true);

    // Hapus elemen yang tidak perlu dicetak
    var buang = salinan.querySelectorAll('.actions, .tag');
    for (var i = 0; i < buang.length; i++) {
        buang[i].parentNode.removeChild(buang[i]);
    }

    var tiket = document.createElement('div');
    tiket.className = 'tiket';

    var waktu = new Date();
    var jam = ('0' + waktu.getHours()).slice(-2) + ':' + ('0' + waktu.getMinutes()).slice(-2);
    var tanggal = waktu.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    tiket.innerHTML =
        '<div class="tiket-head">' +
            '<p><b>Dapur Senja</b></p>' +
            '<p>Cabang Solo &middot; Tiket Dapur</p>' +
        '</div>';
    tiket.appendChild(salinan);

    var foot = document.createElement('div');
    foot.className = 'tiket-foot';
    foot.innerHTML = 'Dicetak: ' + tanggal + ', ' + jam;
    tiket.appendChild(foot);

    return tiket;
}

function jalankanCetak(daftarKartu) {
    var area = document.getElementById('area-cetak');
    area.innerHTML = '';
    for (var i = 0; i < daftarKartu.length; i++) {
        area.appendChild(buatTiket(daftarKartu[i]));
    }
    window.print();
    area.innerHTML = '';
}

// Cetak satu pesanan (tombol "Cetak" pada kartu)
function cetakPesanan(tombol) {
    var kartu = tombol;
    while (kartu && !(kartu.className && (' ' + kartu.className + ' ').indexOf(' card ') > -1)) {
        kartu = kartu.parentNode;
    }
    if (kartu) {
        jalankanCetak([kartu]);
    }
}

// Cetak semua pesanan baru
function cetakSemua() {
    var kartu = document.querySelectorAll('td.card');
    if (kartu.length === 0) {
        alert('Tidak ada pesanan untuk dicetak.');
        return;
    }
    jalankanCetak(kartu);
}

// ===== TERIMA & PROSES (tambahan) =====
// Status disimpan di localStorage supaya terbaca di halaman Pesanan Diproses.

function bacaDaftar(kunci) {
    try { return JSON.parse(localStorage.getItem(kunci)) || []; } catch (e) { return []; }
}

function idKartu(kartu) {
    return kartu.querySelector('.meta').textContent.trim().split(/\s+/)[0];   // "MN-041"
}

// Daftar pesanan bawaan yang tertulis di HTML (ubah di sini kalau kartu di HTML diganti)
var BAWAAN = {
    baru:    ['MN-041', 'MN-042', 'MN-043'],
    proses:  ['MN-039', 'MN-040'],
    selesai: ['MN-036', 'MN-037']
};

function unik(daftar) {
    var hasil = [];
    for (var i = 0; i < daftar.length; i++) {
        if (hasil.indexOf(daftar[i]) === -1) { hasil.push(daftar[i]); }
    }
    return hasil;
}

function isiAngka(href, n) {
    var el = document.querySelector('a.nav-link[href="' + href + '"] span');
    if (el) { el.textContent = n; }
}

// Angka di menu samping dihitung dari pesanan yang benar-benar ada
function perbaruiAngka() {
    var diterima = unik(bacaDaftar('dapurDiterima').map(function (d) { return d.id; }));
    var selesai = unik(bacaDaftar('dapurSelesai'));
    var dataSelesai = unik(bacaDaftar('dapurSelesaiData').map(function (d) { return d.id; }));

    var baru = BAWAAN.baru.filter(function (id) { return diterima.indexOf(id) === -1; });

    var proses = unik(BAWAAN.proses.concat(diterima)).filter(function (id) {
        return selesai.indexOf(id) === -1;
    });

    var tambahanSelesai = dataSelesai.filter(function (id) {
        return BAWAAN.selesai.indexOf(id) === -1;
    });

    isiAngka('pesanan_baru.html', baru.length);
    isiAngka('pesanan_diproses.html', proses.length);
    isiAngka('pesanan_selesai.html', BAWAAN.selesai.length + tambahanSelesai.length);
}

// Susun ulang kartu: 3 kartu per baris
function susunUlang(kartu) {
    var lama = document.querySelectorAll('table.row');
    var induk = lama[0].parentNode;
    var penanda = lama[lama.length - 1].nextSibling;
    for (var i = 0; i < lama.length; i++) { induk.removeChild(lama[i]); }

    for (var a = 0; a < Math.max(kartu.length, 1); a += 3) {
        var tabel = document.createElement('table');
        tabel.width = '100%';
        tabel.border = '0';
        tabel.className = 'row';
        var baris = tabel.insertRow();
        for (var b = 0; b < 3; b++) {
            if (b > 0) { baris.insertCell().width = '20px'; }
            if (kartu[a + b]) { baris.appendChild(kartu[a + b]); }
            else { baris.insertCell().width = '32%'; }
        }
        induk.insertBefore(tabel, penanda);
    }
}

var semuaKartu = [];

function segarkan() {
    susunUlang(semuaKartu);
    document.querySelector('p.date').textContent = semuaKartu.length > 0
        ? semuaKartu.length + ' pesanan menunggu diterima.'
        : 'Tidak ada pesanan baru.';
    perbaruiAngka();
}

// Klik "Terima & proses"
function terimaPesanan(tombol) {
    var kartu = tombol.closest('td.card');
    if (!kartu) { return; }

    // ubah tampilan kartu menjadi kartu "Diproses"
    var salinan = kartu.cloneNode(true);
    salinan.className = salinan.className.replace('card-baru', 'card-proc');
    var tag = salinan.querySelector('.tag');
    if (tag) { tag.className = 'tag tag-proc'; tag.textContent = 'Diproses'; }
    var aksi = salinan.querySelector('.actions');
    if (aksi) {
        aksi.innerHTML =
            '<a href="detail_pesanan.html" class="btn-secondary btn-link">Lihat detail</a> ' +
            '<a href="#" class="btn-primary btn-link" onclick="selesaikanPesanan(this); return false;">Tandai selesai</a>';
    }

    var diterima = bacaDaftar('dapurDiterima');
    diterima.push({ id: idKartu(kartu), html: salinan.outerHTML });
    localStorage.setItem('dapurDiterima', JSON.stringify(diterima));

    semuaKartu = semuaKartu.filter(function (k) { return k !== kartu; });
    segarkan();
}

// Saat halaman dibuka: sembunyikan pesanan yang sudah diterima
(function () {
    var sudah = bacaDaftar('dapurDiterima').map(function (d) { return d.id; });
    var kartu = document.querySelectorAll('td.card');
    for (var i = 0; i < kartu.length; i++) {
        if (sudah.indexOf(idKartu(kartu[i])) === -1) { semuaKartu.push(kartu[i]); }
    }
    segarkan();
})();