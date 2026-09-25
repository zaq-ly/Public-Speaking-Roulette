# PRD: Public Speaking Roulette

## 1. Ringkasan
Public Speaking Roulette adalah web app untuk latihan public speaking dengan cara mengeluarkan topik secara acak (roulette), digunakan dalam sesi latihan komunitas/kelas public speaking secara individu (giliran satu per satu).

## 2. Latar Belakang & Tujuan
- Komunitas/kelas public speaking butuh cara cepat dan seru untuk memberi topik dadakan ke peserta.
- Tujuan: menyediakan alat bantu sesi latihan yang interaktif, mudah dipakai fasilitator, tanpa setup rumit (tanpa login, tanpa server).

## 3. Target Pengguna
- Fasilitator/pengurus komunitas atau kelas public speaking yang memandu sesi latihan.
- Peserta yang mendapat giliran bicara berdasarkan topik yang keluar dari roulette.

## 4. Lingkup MVP (Fase 1)
### 4.1 Fitur Utama
1. **Roulette Topik Random**
   - Tombol "Spin/Acak" untuk mengeluarkan satu topik secara acak dari daftar topik.
   - Animasi roulette/spin sederhana saat memilih topik (feedback visual, bukan sekadar random instan).
2. **Kustomisasi Topik**
   - User bisa menambah topik baru ke daftar.
   - User bisa mengedit topik yang sudah ada.
   - User bisa menghapus topik dari daftar.
   - Ada daftar topik default (preset) saat pertama kali dibuka, supaya tidak kosong.
3. **History Topik**
   - Menyimpan daftar topik yang sudah pernah keluar dalam sesi berjalan.
   - Opsi untuk menghindari topik yang sudah keluar (tidak diulang) sampai semua topik habis, lalu reset otomatis/manual.
   - User bisa melihat dan menghapus history.
4. **Mode Sesi Individu**
   - Satu topik ditampilkan besar di layar untuk satu pembicara pada satu waktu (giliran satu-satu).
   - Tombol "Topik Berikutnya" untuk lanjut ke giliran berikutnya.
5. **Timer per Giliran Bicara**
   - Timer hitung mundur otomatis mulai/reset setiap kali topik baru muncul (setiap giliran user berbicara punya timer sendiri).
   - Durasi timer bisa di-set oleh fasilitator (misal 1-3 menit), berlaku sebagai default untuk semua giliran.
   - Tombol start/pause/reset timer untuk kontrol manual saat sesi berlangsung.
   - Notifikasi/suara saat waktu habis, agar fasilitator tahu giliran harus berpindah tanpa perlu memelototi layar.
   - Tampilan sisa waktu terlihat jelas (besar) berdampingan dengan topik yang sedang aktif.
6. **Penyimpanan Lokal**
   - Semua data (daftar topik custom & history) disimpan di `localStorage` browser, tanpa backend/database, tanpa login.

### 4.2 Di Luar Lingkup MVP (Fase Berikutnya / Nice-to-have)
- Sistem login/akun multi-fasilitator dengan daftar topik masing-masing.
- Kategori topik (bisnis, santai, dll.) dengan filter kategori.
- Mode grup/tim (giliran acak per anggota tim).
- Sinkronisasi data ke cloud/server (supaya bisa diakses lintas device).
- Statistik/rekap sesi latihan (misal jumlah topik yang sudah dibahas per peserta).
- Impor/ekspor daftar topik (misal via file JSON) untuk berbagi antar fasilitator.

## 5. Alur Penggunaan (User Flow)
1. Fasilitator membuka web app.
2. (Opsional) Fasilitator menambah/mengedit daftar topik sesuai kebutuhan sesi.
3. Fasilitator menekan tombol "Spin" → topik acak muncul.
4. Peserta yang mendapat giliran bicara berdasarkan topik tersebut (dengan timer berjalan jika diaktifkan).
5. Setelah selesai, fasilitator menekan "Topik Berikutnya" untuk giliran peserta berikutnya.
6. Topik yang sudah keluar masuk ke history dan tidak diulang sampai semua topik habis.

## 6. Kebutuhan Teknis
- **Stack**: React + Vite + Tailwind CSS.
- **Penyimpanan**: `localStorage` (tanpa backend, tanpa database, tanpa autentikasi).
- **Deployment**: Static hosting (misal Cloudflare Pages, konsisten dengan hosting portofolio yang sudah ada).
- **Kompatibilitas**: Responsive, minimal harus nyaman dipakai di layar laptop/proyektor untuk sesi komunitas (kemungkinan ditampilkan ke banyak orang).

## 7. Kriteria Sukses
- Fasilitator bisa menjalankan satu sesi latihan penuh (banyak giliran) tanpa perlu reload atau kehilangan data topik custom.
- Topik yang sama tidak keluar dua kali dalam satu putaran sebelum semua topik habis.
- Tidak ada dependensi backend — aplikasi tetap berfungsi penuh secara offline setelah dimuat pertama kali (opsional PWA di fase berikutnya).

## 8. Risiko & Catatan
- Karena pakai `localStorage`, data tidak tersinkron antar device/browser — perlu disebutkan sebagai batasan, bukan bug.
- Jika sesi dibuka di device berbeda dari yang biasa dipakai fasilitator, daftar topik custom perlu diinput ulang (kecuali fitur impor/ekspor ditambahkan).
