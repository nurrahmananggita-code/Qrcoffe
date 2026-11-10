// Logout bersama (Admin Outlet + Dapur).
// Cara pakai: beri atribut data-logout pada link "Keluar" dan href ke halaman login.
//   <a href="login.html" data-logout>Keluar</a>
// Saat diklik muncul popup konfirmasi; kalau "Keluar" ditekan, sesi dihapus
// lalu pindah ke halaman login (href dari link tersebut).
(function () {
    var CSS =
        '.lo-overlay{position:fixed;inset:0;background:var(--c-overlay,rgba(18,10,7,.65));display:none;' +
        'align-items:center;justify-content:center;z-index:10000;}' +
        '.lo-overlay.show{display:flex;}' +
        '.lo-box{background:var(--c-surface,#2D1F19);color:var(--c-text,#F5ECE2);border:1px solid var(--c-border,#4A362C);' +
        'border-radius:14px;padding:26px;width:380px;max-width:90%;box-shadow:0 24px 60px rgba(0,0,0,.45);font-family:inherit;}' +
        '.lo-box h2{margin:0 0 8px;font-size:18px;}' +
        '.lo-box p{margin:0 0 22px;color:var(--c-muted,#C2AB99);font-size:14px;line-height:1.5;}' +
        '.lo-actions{display:flex;justify-content:flex-end;gap:10px;}' +
        '.lo-actions button{font:inherit;font-weight:700;font-size:14px;padding:10px 18px;border-radius:8px;cursor:pointer;}' +
        '.lo-batal{background:transparent;color:var(--c-text,#F5ECE2);border:1px solid var(--c-border,#4A362C);}' +
        '.lo-batal:hover{background:var(--c-surface-3,#3A2A22);}' +
        '.lo-keluar{background:var(--c-danger,#E5645F);color:#fff;border:1px solid var(--c-danger,#E5645F);}' +
        '.lo-keluar:hover{filter:brightness(1.08);}';

    var tujuan = "login.html";
    var overlay;

    function buat() {
        var st = document.createElement("style");
        st.textContent = CSS;
        document.head.appendChild(st);

        overlay = document.createElement("div");
        overlay.className = "lo-overlay";
        overlay.innerHTML =
            '<div class="lo-box" role="dialog" aria-modal="true" aria-labelledby="lo-judul">' +
                '<h2 id="lo-judul">Keluar dari akun?</h2>' +
                '<p>Kamu akan kembali ke halaman login. Pesanan dan data yang sudah tersimpan tidak terpengaruh.</p>' +
                '<div class="lo-actions">' +
                    '<button type="button" class="lo-batal">Batal</button>' +
                    '<button type="button" class="lo-keluar">Keluar</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (e) { if (e.target === overlay) { tutup(); } });
        overlay.querySelector(".lo-batal").addEventListener("click", tutup);
        overlay.querySelector(".lo-keluar").addEventListener("click", keluar);
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") { tutup(); } });
    }

    function buka(href) {
        if (href) { tujuan = href; }
        overlay.classList.add("show");
        overlay.querySelector(".lo-batal").focus();
    }

    function tutup() { overlay.classList.remove("show"); }

    function keluar() {
        try {
            sessionStorage.clear();
            localStorage.removeItem("qrcoffee_session");
        } catch (err) { /* abaikan */ }
        window.location.href = tujuan;
    }

    document.addEventListener("DOMContentLoaded", function () {
        buat();
        var link = document.querySelectorAll("[data-logout]");
        for (var i = 0; i < link.length; i++) {
            link[i].addEventListener("click", function (e) {
                e.preventDefault();
                buka(this.getAttribute("href"));
            });
        }
    });
})();
