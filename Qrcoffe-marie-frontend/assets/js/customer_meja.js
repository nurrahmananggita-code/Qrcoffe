const params = new URLSearchParams(window.location.search);
    const meja = params.get("meja") || localStorage.getItem("meja") || "-";

    localStorage.setItem("meja", meja);
    document.getElementById("nomor-meja").textContent = "Meja " + meja;

    function simpanNama() {
        const nama = document.getElementById("input-nama").value.trim();
        localStorage.setItem("nama", nama);
    }