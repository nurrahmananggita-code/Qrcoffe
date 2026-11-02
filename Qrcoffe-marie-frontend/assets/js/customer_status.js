const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
        const noPesanan = localStorage.getItem("noPesanan") || "A-0000";
        const meja = localStorage.getItem("meja") || "-";

        document.getElementById("info-pesanan").textContent = noPesanan + " · Meja " + meja;

        let daftar = "";
        keranjang.forEach(function(item) {
            daftar = daftar + '<div class="order-line"><span>' + item.jumlah + '× ' + item.nama + '</span><span class="order-line-opt">' + (item.ukuran || "") + '</span></div>';
        });
        document.getElementById("daftar-pesanan").innerHTML = daftar;