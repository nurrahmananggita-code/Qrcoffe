// Pesanan Diproses: tampilkan pesanan yang diterima dari halaman Pesanan Baru,
// dan tombol "Tandai selesai" memindahkan pesanan ke halaman Pesanan Selesai.

function bacaDaftar(kunci) {
    try { return JSON.parse(localStorage.getItem(kunci)) || []; } catch (e) { return []; }
}

function idKartu(kartu) {
    return kartu.querySelector('.meta').textContent.trim().split(/\s+/)[0];   // "MN-039"
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
        ? semuaKartu.length + ' pesanan sedang dibuat.'
        : 'Tidak ada pesanan yang sedang dibuat.';
    perbaruiAngka();
}

// Ambil data satu kartu untuk ditampilkan di tabel Pesanan Selesai
function ambilDataKartu(kartu) {
    var item = [];
    var baris = kartu.querySelectorAll('table.mt-15 tr');
    for (var i = 0; i < baris.length; i++) {
        var qty = baris[i].querySelector('.it-qty').textContent.trim();     // "2x"
        var nama = baris[i].querySelector('.it-name').cloneNode(true);
        var sub = nama.querySelector('.it-sub');
        if (sub) { sub.parentNode.removeChild(sub); }                       // buang catatan kecil (mis. "Less sugar")
        item.push(qty + ' ' + nama.textContent.trim());
    }

    var meta = kartu.querySelector('.meta').textContent.trim().split(/\s+/);
    var sekarang = new Date();

    return {
        id: meta[0],                                                         // "MN-039"
        meja: kartu.querySelector('.card-title').textContent.trim(),         // "Meja 2"
        item: item.join(', '),                                               // "2x Cappuccino, 1x Kentang Goreng"
        masuk: meta[meta.length - 1],                                        // "09:05"
        selesai: ('0' + sekarang.getHours()).slice(-2) + ':' + ('0' + sekarang.getMinutes()).slice(-2)
    };
}

// Klik "Tandai selesai"
function selesaikanPesanan(tombol) {
    var kartu = tombol.closest('td.card');
    if (!kartu) { return; }

    var data = ambilDataKartu(kartu);

    var selesai = bacaDaftar('dapurSelesai');
    if (selesai.indexOf(data.id) === -1) {
        selesai.push(data.id);
        localStorage.setItem('dapurSelesai', JSON.stringify(selesai));

        var dataSelesai = bacaDaftar('dapurSelesaiData');
        dataSelesai.push(data);
        localStorage.setItem('dapurSelesaiData', JSON.stringify(dataSelesai));
    }

    semuaKartu = semuaKartu.filter(function (k) { return k !== kartu; });
    segarkan();
}

// Saat halaman dibuka: kartu bawaan + kartu yang diterima dari Pesanan Baru
(function () {
    var selesai = bacaDaftar('dapurSelesai');

    var kartu = document.querySelectorAll('td.card');
    for (var i = 0; i < kartu.length; i++) {
        if (selesai.indexOf(idKartu(kartu[i])) === -1) { semuaKartu.push(kartu[i]); }
    }

    var diterima = bacaDaftar('dapurDiterima');
    for (var j = 0; j < diterima.length; j++) {
        if (selesai.indexOf(diterima[j].id) !== -1) { continue; }
        var tr = document.createElement('tr');
        tr.innerHTML = diterima[j].html;
        semuaKartu.push(tr.firstChild);
    }

    segarkan();
})();