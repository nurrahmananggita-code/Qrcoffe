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