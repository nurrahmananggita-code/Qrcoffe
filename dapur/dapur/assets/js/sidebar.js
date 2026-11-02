// Sidebar admin outlet yang dipakai bersama semua halaman.
// Cara pakai di setiap halaman:
//   1. Ganti isi <td ... class="sidebar"> dengan:
//        <td width="250px" valign="top" class="sidebar" id="sidebar" data-aktif="kelola_menu.html"></td>
//   2. Tambahkan sebelum </body>:
//        <script src="../assets/js/sidebar.js"></script>
// data-aktif = nama file menu yang disorot (lihat daftar HREF di bawah).
// Kalau data-aktif tidak diisi, menu disorot otomatis dari nama file halaman.
(function () {
    var td = document.getElementById("sidebar");
    if (!td) { return; }

    var IMG = "../assets/images/";
    var SVG = 'class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
              'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"';

    function img(nama) { return '<img src="' + IMG + nama + '" width="20" class="nav-icon">'; }
    function svg(isi) { return '<svg ' + SVG + '>' + isi + '</svg>'; }

    var IKON = {
        dashboard: img("dashboard.png"),
        menu:      img("menu.png"),
        kategori:  img("kelola_kategori.png"),
        riwayat:   img("riwayat_transaksi.png"),
        meja:      svg('<path d="M3 9h18"></path><path d="M3 9l1-5h16l1 5"></path><path d="M5 9v10"></path><path d="M19 9v10"></path>'),
        qr:        svg('<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3h-3z"></path><path d="M20 14v7"></path><path d="M14 21h3"></path>'),
        laporan:   svg('<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>'),
        profil:    svg('<path d="M3 9l1-5h16l1 5"></path><path d="M4 9v11h16V9"></path><path d="M9 20v-6h6v6"></path>')
    };

    // [grup, [[href, label, ikon], ...]]
    var MENU = [
        ["Ringkasan",  [["dashboard.html",          "Dashboard",         IKON.dashboard]]],
        ["Menu",       [["kelola_menu.html",        "Kelola Menu",       IKON.menu],
                        ["kelola_kategori.html",    "Kelola Kategori",   IKON.kategori]]],
        ["Meja",       [["kelola_meja.html",        "Kelola Meja",       IKON.meja],
                        ["qr_meja.html",            "QR Code Meja",      IKON.qr]]],
        ["Pesanan",    [["riwayat_transaksi.html",  "Riwayat Pesanan",   IKON.riwayat]]],
        ["Laporan",    [["laporan_penjualan.html",  "Laporan Penjualan", IKON.laporan]]],
        ["Pengaturan", [["profil_outlet.html",      "Profil Outlet",     IKON.profil]]]
    ];

    var aktif = (td.getAttribute("data-aktif") || location.pathname.split("/").pop() || "dashboard.html").toLowerCase();

    var h = '<h2 class="brand">Qrcoffee</h2><p class="brand-sub">Admin Outlet</p>';
    MENU.forEach(function (grup) {
        h += '<p class="nav-label">' + grup[0] + '</p>';
        grup[1].forEach(function (m) {
            h += '<p class="nav-item' + (m[0] === aktif ? ' nav-active' : '') + '">' +
                 '<a href="' + m[0] + '" class="nav-link">' + m[2] + ' ' + m[1] + '</a></p>';
        });
    });
    td.innerHTML = h;
})();
