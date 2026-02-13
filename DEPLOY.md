# Deploy ke GitHub & Hosting GitHub Pages

## 1. Upload proyek ke GitHub

### Langkah 1: Buat repository baru di GitHub

1. Buka [github.com](https://github.com) dan login.
2. Klik **New repository** (tombol hijau).
3. Isi:
   - **Repository name:** `dr-karmila-foundation` (atau nama lain; kalau beda, ubah `base` di `vite.config.js` agar sama).
   - **Visibility:** Public.
   - Jangan centang "Add a README" (karena proyek sudah ada).
4. Klik **Create repository**.

### Langkah 2: Push dari komputer Anda

Buka terminal/PowerShell di folder proyek (`Payung karmila`), lalu jalankan:

```bash
# Inisialisasi git (jika belum)
git init

# Tambah semua file
git add .

# Commit pertama
git commit -m "Initial commit: DR. KARMILA Foundation portal"

# Ganti YOUR_USERNAME dengan username GitHub Anda
git remote add origin https://github.com/Hann000/dr-karmila-foundation.git

# Push ke branch main
git branch -M main
git push -u origin main
```

Jika repo sudah ada dan sudah ada commit, cukup:

```bash
git remote add origin https://github.com/YOUR_USERNAME/dr-karmila-foundation.git
git push -u origin main
```

---

## 2. Aktifkan GitHub Pages

1. Di repo GitHub, buka **Settings** → **Pages**.
2. Di **Source**, pilih **GitHub Actions** (bukan "Deploy from a branch").
3. Simpan. Tidak perlu mengisi branch.

Setiap kali Anda push ke branch `main`, workflow akan otomatis build dan deploy.  

**URL situs:** ganti `Hann000` dengan username GitHub Anda  
→ **`https://Hann000.github.io/dr-karmila-foundation/`**

(Jika nama repo Anda berbeda, ganti `dr-karmila-foundation` di URL dan di `base` di `vite.config.js`.)

---

## 2.1 Jika muncul 404 "There isn't a GitHub Pages site here"

1. **Pakai username asli di URL**  
   Jangan pakai literal `YOUR_USERNAME`. Contoh: `https://Hann000.github.io/dr-karmila-foundation/` (ganti Hann000 jika username Anda beda).

2. **Source Pages harus "GitHub Actions"**  
   Repo → **Settings** → **Pages** → **Build and deployment** → **Source** pilih **GitHub Actions** (bukan "Deploy from a branch"). Simpan.

3. **Cek workflow sudah jalan**  
   Repo → tab **Actions**. Pastikan workflow **"Deploy to GitHub Pages"** ada dan statusnya **hijau (berhasil)**. Kalau merah, klik lalu baca error dan perbaiki.

4. **Jalankan deploy sekali**  
   Setelah Source diubah ke GitHub Actions, push kosong atau re-run workflow:  
   - **Re-run:** Actions → pilih run terakhir → **Re-run all jobs**.

5. **Tunggu 1–2 menit**  
   Setelah deploy sukses, buka lagi URL (refresh atau buka di tab incognito).

---

## 3. Penyimpanan data & opsi “realtime”

Saat ini **tidak ada backend**. Data pendaftaran (KIP/PIP) dan periode disimpan hanya di **localStorage** browser pengunjung. Artinya:

- Data **tidak** terkirim ke server.
- Data **tidak** sama antar perangkat/browser.
- Admin dan pengguna **tidak** melihat data yang sama secara realtime.

**GitHub Pages hanya hosting file statis** (HTML/CSS/JS). Tidak ada database atau API server. Jadi dari GitHub saja **tidak bisa** dapat penyimpanan realtime tanpa layanan lain.

### Opsi jika ingin data tersimpan dan (optionally) realtime

| Opsi | Keterangan |
|------|------------|
| **Supabase** | Database (PostgreSQL) + Auth + Realtime. Gratis tier cukup untuk satu aplikasi. Perlu ganti kode: simpan pendaftaran & periode ke Supabase, bukan localStorage. |
| **Firebase (Firestore)** | Database NoSQL + Auth + Realtime. Gratis tier terbatas. Sama: ganti `registration-store` & `period-store` untuk baca/tulis ke Firestore. |
| **Backend sendiri** | Server (Node/Express, PHP, dll.) + database (MySQL/PostgreSQL). Hosting terpisah (Railway, Render, VPS, dll.). Paling fleksibel, tapi butuh maintenance. |

Ringkasnya:

- **Hanya demo/try:** cukup GitHub Pages + localStorage seperti sekarang.
- **Data betulan dipakai banyak orang:** tambah backend (Supabase/Firebase atau server sendiri) dan ubah kode agar baca/tulis ke sana, bukan localStorage.

Jika Anda pilih salah satu (misalnya Supabase), saya bisa bantu rancang langkah integrasinya (struktur tabel, env, dan contoh kode).
