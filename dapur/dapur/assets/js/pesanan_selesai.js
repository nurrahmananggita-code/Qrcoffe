// pesanan_selesai.js - Membaca data bawaan & localStorage untuk merender tabel

function bacaDaftar(kunci) {
    try { return JSON.parse(localStorage.getItem(kunci)) || []; } catch (e) { return []; }
}

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
    if (el) { el.textContent = n > 0 ? n : ''; }
}

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

(function () {
    var tbody = document.querySelector('table.data tbody');
    var dateEl = document.querySelector('p.date');
    if (!tbody) return;

    // 1. Data bawaan awal (hardcoded 2 baris awal)
    var daftarTampil = [
        { id: 'MN-036', meja: 'Meja 1', tipe: 'Dine in', item: '2x Kopi Tubruk', masuk: '08:48', selesai: '08:58' },
        { id: 'MN-037', meja: 'Meja 6', tipe: 'Takeaway', item: '1x Matcha Latte, 1x Croissant', masuk: '08:50', selesai: '09:02' }
    ];

    // 2. Ambil data pesanan tambahan yang diselesaikan dari localStorage
    var dataBaru = bacaDaftar('dapurSelesaiData');
    dataBaru.forEach(function (d) {
        // Cek agar tidak ganda
        var sudahAda = daftarTampil.some(function (item) { return item.id === d.id; });
        if (!sudahAda) {
            daftarTampil.push({
                id: d.id || 'MN-000',
                meja: d.meja || 'Meja',
                tipe: 'Dine in',
                item: d.item || 'Pesanan Makanan/Minuman',
                masuk: d.masuk || '09:00',
                selesai: d.selesai || '09:20'
            });
        }
    });

    // 3. Render isi tabel secara dinamis
    var html = '';
    daftarTampil.forEach(function (d) {
        html += '<tr>' +
            '<td>' + d.id + '</td>' +
            '<td><b>' + d.meja + '</b><br><span class="meta">' + d.tipe + '</span></td>' +
            '<td>' + d.item + '</td>' +
            '<td>' + d.masuk + '</td>' +
            '<td>' + d.selesai + '</td>' +
            '<td><span class="tag tag-done">Selesai</span></td>' +
        '</tr>';
    });

    tbody.innerHTML = html;

    // 4. Update teks jumlah pesanan di atas tabel
    if (dateEl) {
        dateEl.textContent = daftarTampil.length + ' pesanan sudah diantar.';
    }

    perbaruiAngka();
})();