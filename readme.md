# YouTube Telegram Downloader Bot

Bot Telegram untuk mendownload video YouTube dengan opsi download video atau audio. Bot ini menggunakan YouTube cookies untuk menghindari pembatasan dan captcha.

## 🚀 Fitur

- Download video YouTube dalam format MP4
- Download audio YouTube dalam format MP3
- Progress tracking real-time
- Mendukung berbagai kualitas video
- Sistem antrian untuk multiple requests
- Auto-cleanup file temporary
- Error handling yang lengkap

## 📋 Prasyarat

- Node.js (versi 14 atau lebih baru)
- NPM (Node Package Manager)
- Akun YouTube (untuk cookies)
- Bot Telegram (token dari BotFather)

## 🛠️ Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/ndaa-cmp/yt-telegram
cd yt-telegram
```

2. Install dependencies:
```bash
npm install node-telegram-bot-api @distube/ytdl-core
```

3. Setup konfigurasi:
   - Buat file `cookies.json`
   - Buat file `config.js` untuk token bot (opsional)

## 🍪 Cara Mendapatkan Cookie YouTube
## Menggunakan Extension
1. Install extension "EditThisCookie" di Chrome
2. Buka YouTube dan login
3. Klik icon EditThisCookie
4. Klik tombol Export
5. Cookie akan tercopy dalam format JSON

## ⚙️ Konfigurasi

1. Buat file `cookies.json`:
```json
[
    {
        "name": "VISITOR_INFO1_LIVE",
        "value": "your_visitor_cookie_value"
    },
    {
        "name": "LOGIN_INFO",
        "value": "your_login_cookie_value"
    },
    {
        "name": "SID",
        "value": "your_sid_cookie_value"
    },
    {
        "name": "HSID",
        "value": "your_hsid_cookie_value"
    },
    {
        "name": "__Secure-1PSID",
        "value": "your_secure_psid_cookie_value"
    }
]
```

2. Dapatkan Token Bot Telegram:
   - Chat dengan [@BotFather](https://t.me/botfather) di Telegram
   - Kirim command `/newbot`
   - Ikuti instruksi untuk membuat bot
   - Copy token yang diberikan
   - Paste token di file `.env` atau langsung di kode

## 🚀 Menjalankan Bot

1. Start bot:
```bash
node bot.js
```

2. Di Telegram:
   - Start chat dengan bot Anda
   - Kirim command `/start`
   - Paste link YouTube yang ingin didownload
   - Pilih format (Video/Audio)

## 📝 Penggunaan

1. Basic commands:
   ```
   /start - Memulai bot
   /help  - Menampilkan bantuan
   ```

2. Download video:
   - Kirim link YouTube
   - Pilih "🎥 Download Video"
   - Tunggu proses download dan upload

3. Download audio:
   - Kirim link YouTube
   - Pilih "🎵 Download Audio"
   - Tunggu proses download dan upload

## ⚠️ Troubleshooting

### Error "Sign in to confirm you're not a bot"
- Pastikan cookies.json berisi cookie yang valid
- Coba perbarui cookie dari YouTube
- Pastikan akun YouTube sudah login

### Error "Video unavailable"
- Cek apakah video bisa diakses di browser
- Pastikan video tidak private atau age-restricted

### Error saat upload ke Telegram
- Cek ukuran file (max 50MB untuk bot)
- Untuk video panjang, gunakan opsi audio

## 📌 Notes Penting

- Cookie YouTube perlu diperbarui secara berkala
- Jangan share cookie Anda dengan orang lain
- Bot memiliki limit size dari Telegram (50MB)
- Gunakan opsi audio untuk video panjang
- Simpan token bot dengan aman

## 🔄 Update Cookie

Cookie YouTube biasanya expired dalam beberapa hari/minggu. Untuk update:
1. Ulangi proses mendapatkan cookie
2. Update file cookies.json
3. Restart bot

## 👥 Kontribusi

Kontribusi selalu welcome! Silakan buat pull request atau issue untuk perbaikan dan saran.

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License - lihat file LICENSE untuk detail.
