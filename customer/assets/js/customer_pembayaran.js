const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

        let subtotal = 0;
        keranjang.forEach(function(item) {
            subtotal = subtotal + item.hargaSatuan * item.jumlah;
        });

        const total = subtotal + Math.round(subtotal * 0.1);
localStorage.setItem("totalBayar", total);

        document.getElementById("total-bayar").textContent = "Rp" + total.toLocaleString("id-ID");
                localStorage.setItem("totalBayar", total);
        localStorage.setItem("metode", "QRIS");

        let noPesanan = localStorage.getItem("noPesanan");
        if (!noPesanan) {
            noPesanan = "A-" + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem("noPesanan", noPesanan);
        }
        document.getElementById("no-pesanan").textContent = noPesanan;

                function pilihMetode(metode) {
            const kartuQris = document.getElementById("metode-qris");
            const kartuTransfer = document.getElementById("metode-transfer");
            const kartuQr = document.getElementById("qr-card");

                 if (metode === "qris") {
                localStorage.setItem("metode", "QRIS");
                kartuQris.classList.add("metode-on");
                kartuTransfer.classList.remove("metode-on");
                kartuQr.style.display = "block";
            }   else {
                localStorage.setItem("metode", "Transfer");
                kartuTransfer.classList.add("metode-on");
                kartuQris.classList.remove("metode-on");
                kartuQr.style.display = "none";
            }
        }