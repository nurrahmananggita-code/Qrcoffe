const pilihKategori = document.getElementById("pilih-kategori");
const cariMenu = document.getElementById("cari-menu");
const semuaBaris = document.querySelectorAll(".menu-table tbody tr");

function saring() {
    const kategoriDipilih = pilihKategori.value;
    const kataCari = cariMenu.value.toLowerCase();

    semuaBaris.forEach(function(baris) {
        const kategori = baris.querySelector(".col-category").textContent.trim();
        const nama = baris.querySelector(".item-name").textContent.toLowerCase();

        const cocokKategori = kategoriDipilih === "Semua kategori" || kategori === kategoriDipilih;
        const cocokNama = nama.includes(kataCari);

        if (cocokKategori && cocokNama) {
            baris.style.display = "";
        } else {
            baris.style.display = "none";
        }
    });
}

pilihKategori.addEventListener("change", saring);
cariMenu.addEventListener("input", saring);