const semuaSwitch = document.querySelectorAll(".cat-table .switch input");

semuaSwitch.forEach(function(tombol) {
    tombol.addEventListener("change", function() {
        const baris = tombol.closest("tr");
        const label = baris.querySelector(".badge-show, .badge-hide");

        if (tombol.checked) {
            label.className = "badge-show";
            label.textContent = "● Tampil";
        } else {
            label.className = "badge-hide";
            label.textContent = "● Disembunyikan";
        }
    });
});