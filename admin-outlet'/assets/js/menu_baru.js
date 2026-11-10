// Menampilkan menu yang ditambah lewat halaman "Tambah menu" ke tabel Kelola Menu.
// Pasang SEBELUM kelola_menu.js supaya pencarian/filter ikut membaca baris baru.
(function () {
  var STORAGE_KEY = 'qrcoffee_menu_baru';
  var tbody = document.querySelector('.menu-table tbody');
  if (!tbody) return;

  var IKON = {
    'Kopi': 'icon-kopi',
    'Non-kopi': 'icon-nonkopi',
    'Makanan Berat': 'icon-makanan',
    'Camilan': 'icon-camilan',
    'Dessert': 'icon-dessert',
    'Paket Hemat': 'icon-paket'
  };

  var ICON_HAPUS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rp(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }

  function baca() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function simpan(daftar) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(daftar)); } catch (e) {}
  }

  function buatBaris(m) {
    var harga = m.hargaLarge
      ? '<div class="harga-box"><p class="harga-baris"><span>Regular</span><span>' + rp(m.hargaRegular) + '</span></p>' +
        '<p class="harga-baris"><span>Large</span><span>' + rp(m.hargaLarge) + '</span></p></div>'
      : rp(m.hargaRegular);

    var ikon = m.foto
      ? '<div class="item-icon" style="background:url(\'' + m.foto + '\') center/cover no-repeat;"></div>'
      : '<div class="item-icon ' + (IKON[m.kategori] || 'icon-paket') + '">' + esc((m.nama || '?').charAt(0).toUpperCase()) + '</div>';

    var tr = document.createElement('tr');
    tr.setAttribute('data-baru-id', m.id);
    tr.innerHTML =
      '<td class="col-menu"><div class="menu-cell">' + ikon +
        '<div class="menu-text"><p class="item-name">' + esc(m.nama) + '</p>' +
        '<p class="item-sub">' + esc(m.deskripsi) + '</p></div></div></td>' +
      '<td class="col-category">' + esc(m.kategori) + '</td>' +
      '<td class="col-price">' + harga + '</td>' +
      '<td class="col-avail"><label class="switch"><input type="checkbox"' + (m.tersedia ? ' checked' : '') + '>' +
        '<span class="slider"></span></label></td>' +
      '<td class="col-action"><a href="ubah_menu.html" class="icon-btn" title="Edit">✎</a>' +
        '<button class="icon-btn icon-delete" title="Hapus">' + ICON_HAPUS + '</button></td>';
    return tr;
  }

  var daftar = baca();
  daftar.forEach(function (m) { tbody.appendChild(buatBaris(m)); });

  // Simpan perubahan toggle "Tersedia" pada menu baru
  tbody.addEventListener('change', function (e) {
    var tr = e.target.closest('tr[data-baru-id]');
    if (!tr || e.target.type !== 'checkbox') return;
    var id = tr.getAttribute('data-baru-id');
    var d = baca();
    d.forEach(function (m) { if (String(m.id) === id) m.tersedia = e.target.checked; });
    simpan(d);
    perbaruiJumlah();
  });

  // Kalau baris menu baru dihapus (oleh tombol hapus), hapus juga dari penyimpanan
  new MutationObserver(function (list) {
    list.forEach(function (mu) {
      mu.removedNodes.forEach(function (n) {
        if (n.nodeType === 1 && n.getAttribute && n.getAttribute('data-baru-id')) {
          var id = n.getAttribute('data-baru-id');
          simpan(baca().filter(function (m) { return String(m.id) !== id; }));
          perbaruiJumlah();
        }
      });
    });
  }).observe(tbody, { childList: true });

  // Sembunyikan menu bawaan yang pernah dihapus
  var KEY_HAPUS = 'qrcoffee_menu_dihapus';
  function bacaHapus() {
    try { return JSON.parse(localStorage.getItem(KEY_HAPUS) || '[]'); } catch (e) { return []; }
  }
  var dihapus = bacaHapus();
  tbody.querySelectorAll('tr:not([data-baru-id])').forEach(function (tr) {
    var el = tr.querySelector('.item-name');
    if (el && dihapus.indexOf(el.textContent.trim()) > -1) tr.remove();
  });

  // Perbarui tulisan "14 menu, 12 tersedia untuk dipesan."
  function perbaruiJumlah() {
    var info = document.querySelector('.date');
    if (!info) return;
    var semua = tbody.querySelectorAll('tr');
    var tersedia = tbody.querySelectorAll('.switch input:checked');
    info.textContent = semua.length + ' menu, ' + tersedia.length + ' tersedia untuk dipesan.';
  }
  perbaruiJumlah();

  // ===== Hapus menu (dengan konfirmasi) =====
  function toastMsg(pesan) {
    var t = document.getElementById('toast-notif');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast-notif';
      t.id = 'toast-notif';
      document.body.appendChild(t);
    }
    t.textContent = pesan;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2500);
  }

  function konfirmasi(nama, ok) {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:10000;';
    var box = document.createElement('div');
    box.style.cssText = 'width:420px;max-width:90%;padding:24px;background:var(--c-surface);border:1px solid var(--c-border);border-radius:12px;color:var(--c-text);';
    box.innerHTML =
      '<h2 style="margin:0;font-size:17px;">Hapus menu?</h2>' +
      '<p style="margin:10px 0 20px;color:var(--c-muted);font-size:14px;line-height:1.5;">Menu <b style="color:var(--c-text)">' +
      esc(nama) + '</b> akan dihapus dari daftar dan tidak muncul lagi di halaman pelanggan.</p>' +
      '<div style="text-align:right;">' +
      '<button type="button" id="hm-batal" style="margin-right:8px;padding:10px 18px;background:transparent;border:1px solid var(--c-border);border-radius:8px;color:var(--c-text);font:inherit;font-size:14px;font-weight:bold;cursor:pointer;">Batalkan</button>' +
      '<button type="button" id="hm-ok" style="padding:10px 18px;background:var(--c-danger);border:1px solid var(--c-danger);border-radius:8px;color:#fff;font:inherit;font-size:14px;font-weight:bold;cursor:pointer;">Hapus</button>' +
      '</div>';
    ov.appendChild(box);
    document.body.appendChild(ov);
    function tutup() { ov.remove(); }
    box.querySelector('#hm-batal').onclick = tutup;
    box.querySelector('#hm-ok').onclick = function () { tutup(); ok(); };
    ov.addEventListener('click', function (e) { if (e.target === ov) tutup(); });
  }

  // capture: jalan lebih dulu, supaya tidak dobel dengan kelola_menu.js
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.icon-delete');
    if (!btn) return;
    var tr = btn.closest('tr');
    if (!tr || !tbody.contains(tr)) return;
    e.preventDefault();
    e.stopPropagation();

    var el = tr.querySelector('.item-name');
    var nama = el ? el.textContent.trim() : 'ini';
    konfirmasi(nama, function () {
      if (!tr.hasAttribute('data-baru-id')) {
        var d = bacaHapus();
        if (d.indexOf(nama) === -1) d.push(nama);
        try { localStorage.setItem(KEY_HAPUS, JSON.stringify(d)); } catch (err) {}
      }
      tr.remove();               // menu baru ikut terhapus dari penyimpanan lewat observer
      perbaruiJumlah();
      toastMsg('Menu "' + nama + '" dihapus');
    });
  }, true);

})();
