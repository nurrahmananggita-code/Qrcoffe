function pilihMeja() {
        const meja = document.getElementById("pilih-meja").value;
        document.getElementById("btn-scan").href = "customer_meja.html?meja=" + meja;
    }

    // Reset pesanan lama setiap kali halaman scan dibuka
    localStorage.removeItem("keranjang");
    localStorage.removeItem("catatanPesanan");
    localStorage.removeItem("noPesanan");