# ️ UAS-SISKO - Sistem Pelaporan Insiden Keamanan dan Audit Fasilitas

**SISKO** adalah aplikasi web berbasis Node.js untuk manajemen pelaporan insiden keamanan dan Audit Fasilitas dengan dashboard interaktif, role-based access control, dan manajemen petugas terintegrasi.


##  Fitur Utama

### 1. Autentikasi & Keamanan
- Login dengan NIP (Nomor Induk Pegawai)
- Password hashing dengan bcrypt
- Session management
- Role-based access control (Security Lead, Petugas, Manajemen)

### 2. Dashboard Interaktif
- Statistik real-time (Total, Open, In Progress, Resolved)
- Chart trend insiden per bulan
- Chart insiden per lokasi
- Chart prioritas

### 3. Manajemen Insiden
- Buat laporan insiden dengan upload foto bukti
- Update status insiden (Open → In Progress → Resolved → Closed)
- Detail view dengan foto
- Hapus insiden dengan konfirmasi
- Filter berdasarkan role

### 4. Kelola Petugas
- Tambah petugas baru dengan akun login otomatis
- Password default = NIP
- Toggle status aktif/nonaktif
- Validasi duplikat NIP & username

---

## Teknologi

| Kategori | Teknologi |
|----------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (via phpMyAdmin) |
| **Frontend** | HTML5, CSS3, Bootstrap 5 |
| **Charts** | Chart.js |
| **Icons** | Bootstrap Icons |
| **Security** | bcrypt, express-session |
| **File Upload** | Multer |

---

## Instalasi

### Prasyarat
- Node.js v14+ 
- MySQL Server
- phpMyAdmin (opsional)

### Langkah Instalasi

1. **Clone repository**
```bash
git clone https://github.com/Natashamelinda037/sisko.git
cd sisko
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup database**
- Buat database `keamanan_uas` di phpMyAdmin
- Import struktur tabel (lihat bagian Database)

4. **Konfigurasi environment**
Buat file `.env` di root folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=keamanan_uas
SESSION_SECRET=your_secret_key_here
PORT=3000
```

5. **Jalankan server**
```bash
npm run dev
```

6. **Akses aplikasi**
Buka browser: `http://localhost:3000`

---

## Struktur Database

### 1. Tabel `users`
```sql
CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('security_lead', 'petugas', 'manajemen'),
    nip VARCHAR(20) UNIQUE,
    first_login TINYINT(1) DEFAULT 1
);
```

### 2. Tabel `petugas`
```sql
CREATE TABLE petugas (
    id_petugas INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    nip VARCHAR(20),
    nama_lengkap VARCHAR(100),
    jabatan VARCHAR(50),
    shift ENUM('pagi', 'siang', 'malam'),
    status_aktif TINYINT(1) DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id_user)
);
```

### 3. Tabel `lokasi`
```sql
CREATE TABLE lokasi (
    id_lokasi INT PRIMARY KEY AUTO_INCREMENT,
    nama_lokasi VARCHAR(100),
    kode_area VARCHAR(20),
    alamat TEXT,
    zona VARCHAR(50)
);
```

### 4. Tabel `insiden`
```sql
CREATE TABLE insiden (
    id_insiden INT PRIMARY KEY AUTO_INCREMENT,
    kode_insiden VARCHAR(20),
    judul VARCHAR(200),
    deskripsi TEXT,
    prioritas ENUM('Low', 'Medium', 'High', 'Critical'),
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
    id_lokasi INT,
    id_petugas INT,
    waktu_lapor DATETIME,
    waktu_respon DATETIME,
    waktu_selesai DATETIME,
    bukti_foto VARCHAR(255),
    FOREIGN KEY (id_lokasi) REFERENCES lokasi(id_lokasi),
    FOREIGN KEY (id_petugas) REFERENCES petugas(id_petugas)
);
```

---

## 👤 Akun Default

| Role | NIP | Username | Password |
|------|-----|----------|----------|
| Security Lead | SL-2026-001 | security_lead | password |
| Petugas | PO-2026-001 | petugas1 | password |
| Manajemen | MJ-2026-001 | manajemen | password |

---

## Struktur Folder

```
sisko/
├── config/
│   ── db.js                 # Konfigurasi database
├── middleware/
│   └── auth.js               # Middleware autentikasi
── routes/
│   ├── auth.js               # Route autentikasi
│   ├── insiden.js            # Route insiden
│   ├── lokasi.js             # Route lokasi
│   ── petugas.js            # Route petugas
├── public/
│   ├── css/
│   │   └── style.css         # Custom CSS
│   ├── uploads/
│   │   └── insiden/          # Folder upload foto
│   ├── index.html            # Halaman login
│   ├── dashboard.html        # Halaman dashboard
│   └── change-password.html  # Halaman ganti password
├── .env                      # Environment variables
├── server.js                 # Main server
├── package.json
└── README.md
```

---

##  Cara Penggunaan

### 1. Login
- Masukkan NIP dan password
- Jika login pertama, akan diarahkan ke halaman ganti password

### 2. Dashboard
- Lihat statistik insiden
- Analisis trend bulanan
- Monitoring distribusi status & lokasi

### 3. Buat Laporan (Petugas & Security Lead)
- Klik menu "Buat Laporan"
- Isi form: Judul, Lokasi, Deskripsi, Prioritas
- Upload foto bukti (opsional)
- Klik "Kirim"

### 4. Kelola Insiden
- Lihat daftar insiden
- Update status (Open → In Progress → Resolved)
- Lihat detail dengan foto
- Hapus insiden (Security Lead only)

### 5. Kelola Petugas (Security Lead Only)
- Tambah petugas baru
- Sistem otomatis buat akun login
- Password default = NIP
- Toggle status aktif/nonaktif

---

## Keamanan

- **Password Hashing**: bcrypt dengan 10 salt rounds
- **Session Management**: express-session dengan cookie secure
- **Role-Based Access**: Middleware untuk setiap endpoint
- **Input Validation**: Server-side & client-side
- **SQL Injection Prevention**: Prepared statements

---

## Fitur yang Direncanakan (Future Enhancement)

- [ ] Notifikasi real-time (WebSocket)
- [ ] Mobile responsive design
- [ ] Audit log sistem
- [ ] Backup database otomatis

---

## Developer

**Natasha Melinda**  
Universitas Pignatelli Triputra.  
Mata Kuliah: Pemrograman Berbasis Web (P1) 
Tahun: 2026

---

## Lisensi

Project ini dibuat untuk keperluan akademis (UAS).  
Tidak untuk penggunaan komersial tanpa izin.

---

##  Ucapan Terima Kasih

Terima kasih kepada:
- Dosen pembimbing
- Bootstrap & Chart.js community
- Node.js ecosystem

---

**© 2026 SISKO - Sistem Pelaporan Insiden Keamanan dan Audit Aplikasi**
```
