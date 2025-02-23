# Evaluasi Teknik Validasi Input untuk Mencegah SQL Injection

## 📌 Deskripsi

Proyek ini mengevaluasi berbagai teknik validasi input untuk mencegah serangan SQL Injection dalam aplikasi berbasis Node.js dengan Express dan MySQL. Kode ini menunjukkan berbagai tingkat keamanan dalam menangani input pengguna saat melakukan autentikasi pengguna.

## 🚀 Instalasi

### 1️⃣ **Kloning repositori ini:**
```sh
git clone https://github.com/kambingmetal/InputSanitization.git
cd InputSanitization
```

### 2️⃣ **Instal dependensi:**
```sh
npm install
```

### 3️⃣ **Buat file `.env` dan tambahkan konfigurasi database:**
```sh
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

### 4️⃣ **Jalankan server:**
```sh
node index.js
```

## 🔍 Endpoint Evaluasi

### 🔴 **1. Metode Tidak Aman (String Concatenation)**
📌 **Endpoint:**
```http
POST /login-unsafe
```
📌 **Penjelasan:**
- Query dibuat dengan menggabungkan string secara langsung.
- Rentan terhadap SQL Injection karena input tidak divalidasi.
- Contoh serangan: `username=' OR '1'='1' --` akan selalu mengembalikan hasil.

---

### 🟠 **2. Metode Kurang Aman (Escaping Input)**
📌 **Endpoint:**
```http
POST /login-escaped
```
📌 **Penjelasan:**
- Input menggunakan fungsi `mysql.escape()` untuk membersihkan karakter berbahaya.
- Masih rentan jika ada kelemahan dalam implementasi sanitasi atau pengkodean karakter.

---

### 🟢 **3. Metode Sangat Aman (Parameterized Query)**
📌 **Endpoint:**
```http
POST /login-secure
```
📌 **Penjelasan:**
- Menggunakan prepared statements dengan placeholder (`?`).
- Mencegah SQL Injection karena parameter akan diperlakukan sebagai nilai, bukan bagian dari query.
- Cara yang sangat direkomendasikan untuk menangani input pengguna.

---

### 🟢 **4. Metode Aman (ORM Sequelize)**
📌 **Endpoint:**
```http
POST /login-orm
```
📌 **Penjelasan:**
- Menggunakan ORM Sequelize untuk mengelola query SQL.
- Menghindari langsung menulis query SQL dan memanfaatkan fitur ORM yang lebih aman.
- Keamanan tergantung pada ORM yang digunakan dan cara implementasi validasi data.

## 📊 Kesimpulan

| Metode                 | 🔐 Keamanan | ✅ Kelebihan | ⚠ Kekurangan |
|------------------------|------------|-------------|--------------|
| String Concatenation  | ❌ Tidak Aman | Mudah diterapkan | Sangat rentan terhadap SQL Injection |
| Escaping Input        | ⚠ Kurang Aman | Mengurangi risiko SQL Injection | Masih ada celah keamanan |
| Parameterized Query   | ✅ Sangat Aman | Mencegah SQL Injection sepenuhnya | Perlu pengetahuan tentang prepared statements |
| ORM Sequelize        | 🟢 Aman | Abstraksi yang lebih mudah digunakan | Bergantung pada implementasi ORM |

✅ **Untuk keamanan terbaik, disarankan untuk menggunakan Parameterized Query atau ORM Sequelize dengan validasi input tambahan.**

## 📜 Lisensi
Proyek ini dirilis di bawah lisensi **MIT**.

