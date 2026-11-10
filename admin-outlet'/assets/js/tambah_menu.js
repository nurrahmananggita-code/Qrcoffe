document.addEventListener('DOMContentLoaded', function () {
  var STORAGE_KEY = 'qrcoffee_menu_baru';
  var MAKS_FOTO = 2 * 1024 * 1024; // 2 MB

  // ===== Ambil elemen (tanpa perlu ubah HTML) =====
  var inputNama = document.querySelector('input.form-input[type="text"]');
  var selKategori = document.querySelector('select.form-input');
  var barePrices = document.querySelectorAll('.input-bare');
  var inputRegular = barePrices[0];
  var inputLarge = barePrices[1];
  var textDesk = document.querySelector('textarea.form-input');
  var cekBox = document.querySelectorAll('.check-box input');
  var uploadBox = document.querySelector('.upload-box');
  var uploadIcon = document.querySelector('.upload-icon');
  var uploadTitle = document.querySelector('.upload-title');
  var uploadSub = document.querySelector('.upload-sub');
  var pvPhoto = document.querySelector('.preview-photo');
  var pvName = document.querySelector('.preview-name');
  var pvDesc = document.querySelector('.preview-desc');
  var pvPrice = document.querySelector('.preview-price');
  var btnSimpan = document.querySelector('.btn-save');

  var fotoData = ''; // foto dalam bentuk data URL
  var subAwal = uploadSub.textContent;

  textDesk.setAttribute('maxlength', '120');

  // ===== Toast =====
  var toast = document.getElementById('toast-notif');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notif';
    toast.id = 'toast-notif';
    document.body.appendChild(toast);
  }
  var timerToast;
  function tampilToast(pesan) {
    toast.textContent = pesan;
    toast.classList.add('show');
    clearTimeout(timerToast);
    timerToast = setTimeout(function () { toast.classList.remove('show'); }, 2500);
  }

  // ===== Format rupiah =====
  function angka(teks) { return (teks || '').replace(/\D/g, ''); }
  function rupiah(n) { return n ? Number(n).toLocaleString('id-ID') : '0'; }

  function formatInput(el) {
    el.addEventListener('input', function () {
      var a = angka(el.value);
      el.value = a ? Number(a).toLocaleString('id-ID') : '';
      tandaiNormal(el);
      perbaruiPratinjau();
    });
  }
  formatInput(inputRegular);
  formatInput(inputLarge);

  // ===== Tandai kolom salah =====
  function tandaiSalah(el) {
    var target = el.closest('.input-prefix') || el;
    target.style.borderColor = 'var(--c-danger)';
  }
  function tandaiNormal(el) {
    var target = el.closest('.input-prefix') || el;
    target.style.borderColor = '';
  }
  inputNama.addEventListener('input', function () { tandaiNormal(inputNama); perbaruiPratinjau(); });
  textDesk.addEventListener('input', perbaruiPratinjau);

  // ===== Pratinjau di HP pelanggan =====
  function perbaruiPratinjau() {
    var nama = inputNama.value.trim();
    var desk = textDesk.value.trim();
    pvName.textContent = nama || 'Nama menu';
    pvDesc.textContent = desk || 'Deskripsi menu tampil di sini.';
    pvPrice.textContent = 'Rp ' + rupiah(angka(inputRegular.value));
    if (!fotoData) {
      pvPhoto.style.backgroundImage = '';
      pvPhoto.textContent = nama ? nama.charAt(0).toUpperCase() : '?';
    }
  }

  // ===== Unggah foto =====
  var inputFoto = document.createElement('input');
  inputFoto.type = 'file';
  inputFoto.accept = 'image/jpeg,image/png';
  inputFoto.style.display = 'none';
  uploadBox.appendChild(inputFoto);
  uploadBox.style.cursor = 'pointer';

  uploadBox.addEventListener('click', function (e) {
    if (e.target === inputFoto) return;
    inputFoto.click();
  });

  function resetFoto() {
    fotoData = '';
    inputFoto.value = '';
    uploadIcon.textContent = '🖼';
    uploadTitle.textContent = 'Unggah foto';
    uploadSub.textContent = subAwal;
    perbaruiPratinjau();
  }

  inputFoto.addEventListener('change', function () {
    var file = inputFoto.files[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      tampilToast('Format foto harus JPG atau PNG');
      resetFoto();
      return;
    }
    if (file.size > MAKS_FOTO) {
      tampilToast('Ukuran foto maksimal 2 MB');
      resetFoto();
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      fotoData = e.target.result;
      pvPhoto.textContent = '';
      pvPhoto.style.backgroundImage = 'url("' + fotoData + '")';
      pvPhoto.style.backgroundSize = 'cover';
      pvPhoto.style.backgroundPosition = 'center';
      uploadIcon.textContent = '✔';
      uploadTitle.textContent = file.name;
      uploadSub.textContent = 'Klik lagi untuk mengganti foto';
    };
    reader.readAsDataURL(file);
  });

  // ===== Simpan =====
  btnSimpan.addEventListener('click', function (e) {
    e.preventDefault();

    var nama = inputNama.value.trim();
    var regular = parseInt(angka(inputRegular.value) || '0', 10);
    var large = parseInt(angka(inputLarge.value) || '0', 10);

    if (!nama) {
      tandaiSalah(inputNama);
      inputNama.focus();
      tampilToast('Nama menu wajib diisi');
      return;
    }
    if (!regular) {
      tandaiSalah(inputRegular);
      inputRegular.focus();
      tampilToast('Harga Regular wajib diisi');
      return;
    }
    if (large && large <= regular) {
      tandaiSalah(inputLarge);
      inputLarge.focus();
      tampilToast('Harga Large harus lebih besar dari Regular');
      return;
    }

    var menuBaru = {
      id: Date.now(),
      nama: nama,
      kategori: selKategori.value,
      hargaRegular: regular,
      hargaLarge: large || null,
      deskripsi: textDesk.value.trim(),
      tersedia: cekBox[0].checked,
      andalan: cekBox[1].checked,
      boleh_catatan: cekBox[2].checked,
      foto: fotoData
    };

    try {
      var daftar = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      daftar.push(menuBaru);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(daftar));
    } catch (err) {
      // penyimpanan penuh (biasanya karena foto besar): simpan tanpa foto
      try {
        menuBaru.foto = '';
        var d2 = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        d2.push(menuBaru);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(d2));
      } catch (err2) {
        tampilToast('Gagal menyimpan menu');
        return;
      }
    }

    tampilToast('Menu "' + nama + '" berhasil ditambahkan');
    btnSimpan.style.pointerEvents = 'none';
    setTimeout(function () { window.location.href = 'kelola_menu.html'; }, 1200);
  });

  // ===== Tombol "Tambah" di pratinjau HP pelanggan (simulasi) =====
  var pvBtn = document.querySelector('.preview-btn');
  var jumlahPv = 0;
  pvBtn.style.cursor = 'pointer';
  pvBtn.style.userSelect = 'none';
  pvBtn.addEventListener('click', function () {
    if (!inputNama.value.trim()) {
      tampilToast('Isi nama menu dulu untuk mencoba pratinjau');
      inputNama.focus();
      return;
    }
    jumlahPv++;
    pvBtn.textContent = jumlahPv === 1 ? '✓ Ditambahkan' : '✓ Ditambahkan (' + jumlahPv + ')';
    tampilToast('Pratinjau: ' + inputNama.value.trim() + ' masuk keranjang pelanggan');
  });

  perbaruiPratinjau();
});
