-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2026 at 04:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `keamanan-uas`
--

-- --------------------------------------------------------

--
-- Table structure for table `insiden`
--

CREATE TABLE `insiden` (
  `id_insiden` int(11) NOT NULL,
  `kode_insiden` varchar(255) NOT NULL,
  `judul` varchar(150) NOT NULL,
  `deskripsi` text NOT NULL,
  `prioritas` enum('Low','Medium','High','Critical') NOT NULL COMMENT 'DEFAULT ''Medium''',
  `status` enum('Open','In Progress','Resolved','Closed') NOT NULL COMMENT 'DEFAULT ''Open''',
  `id_lokasi` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `penanggung_jawab` varchar(150) NOT NULL,
  `bukti_foto` text NOT NULL,
  `waktu_lapor` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'DEFAULT CURRENT_TIMESTAMP',
  `waktu_respon` timestamp NULL DEFAULT NULL,
  `waktu_selesai` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insiden`
--

INSERT INTO `insiden` (`id_insiden`, `kode_insiden`, `judul`, `deskripsi`, `prioritas`, `status`, `id_lokasi`, `id_petugas`, `penanggung_jawab`, `bukti_foto`, `waktu_lapor`, `waktu_respon`, `waktu_selesai`) VALUES
(11, 'INS-996003', 'Vandalisme', 'Terjadi aksi Vandalisme pada tembok luar gedung utama', 'High', 'Closed', 1, 1, 'security_lead', '/uploads/insiden/1779241995991-vandalisme.jpeg', '2026-05-27 01:40:15', '2026-05-20 02:02:51', '2026-05-20 02:07:26'),
(12, 'INS-268226', 'Akses tidak sah ke ruang server', 'Seorang pria tidak dikenal menerobos masuk kedalam ruang server menggunakan kartu karyawan curian. Insiden diperkirakan terjadi pada pukul 5 sore, saat jam pergantian shift siang ke malam.  ', 'Critical', 'Resolved', 2, 1, 'security_lead', '/uploads/insiden/1779242268224-server.jpg', '2026-05-20 02:07:54', '2026-05-20 02:03:05', '2026-05-20 02:07:54'),
(13, 'INS-532567', 'Pintu kaca pecah', 'Pintu kaca depan gudang pecah akibat benturan yang cukup keras dengan troli petugas kebersihan. Petugas kebersihan diduga sedang sakit dan mulai tidak sadar sehingga tanpa sengaja menabrak pintu kaca pada Ruang Meeting - Lt. 3 ', 'High', 'Closed', 4, 1, 'security_lead', '/uploads/insiden/1779242532565-pintu.jpeg', '2026-05-20 02:07:47', '2026-05-20 02:07:19', '2026-05-20 02:07:47'),
(15, 'INS-324561', 'AC rusak di ruang meeting', 'AC di ruang meeting diduga mengalami kerusakan pada bagian mesin nya sehingga tidak berfungsi dengan baik. di ajukan untuk adanya penggantian fasilitas AC dengan unit baru', 'Low', 'Resolved', 4, 1, 'security_lead', '/uploads/insiden/1779243324558-ac.jpg', '2026-05-27 01:40:08', '2026-05-20 02:17:22', '2026-05-27 01:40:08'),
(16, 'INS-430542', 'Percobaan pencurian mobil dan perusakan kamera pengawas', 'Terjadi percobaan pencurian mobil karyawan yang terparkir di area parkir basement. Untuk menjalankan aksi nya pelaku melakukan perusakan terhadap kamera pengawas menggunakan batu namun aksi tersebut berhasil diketahui oleh petugas keamanan yang sedang bertugas, sehingga aksi pencurian dapat digagalkan dan kamera pengawas dapat segera diperbaiki. Petugas akan segera melakukan perbaikan kamera pengawas dan memperketat penjagaan di area parkir dan gedung utama. ', 'Medium', 'In Progress', 3, 1, 'security_lead', '/uploads/insiden/1779243430539-parkir.jpg', '2026-05-27 01:39:53', '2026-05-27 01:39:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lokasi`
--

CREATE TABLE `lokasi` (
  `id_lokasi` int(11) NOT NULL,
  `nama_lokasi` varchar(225) NOT NULL,
  `kode_area` varchar(40) NOT NULL,
  `alamat` text NOT NULL,
  `zona` enum('public','restricted','critical') NOT NULL COMMENT 'DEFAULT ''public'''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lokasi`
--

INSERT INTO `lokasi` (`id_lokasi`, `nama_lokasi`, `kode_area`, `alamat`, `zona`) VALUES
(1, 'Gedung Utama - Lobby', 'A-01', 'Jl. Sudirman No. 1, Jakarta', 'public'),
(2, 'Ruang Server - Lt. 2', 'B-02', 'Jl. Sudirman No. 1, Jakarta', 'critical'),
(3, 'Area Parkir Basement', 'C-01', 'Jl. Sudirman No. 1, Jakarta', 'restricted'),
(4, 'Ruang Meeting - Lt. 3', 'A-03', 'Jl. Sudirman No. 1, Jakarta', 'restricted'),
(5, 'Gudang - Lt. 1', 'D-01', 'Jl. Sudirman No. 1, Jakarta', 'restricted');

-- --------------------------------------------------------

--
-- Table structure for table `petugas`
--

CREATE TABLE `petugas` (
  `id_petugas` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nip` varchar(20) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `jabatan` varchar(50) NOT NULL,
  `shift` varchar(50) DEFAULT NULL,
  `status_aktif` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `petugas`
--

INSERT INTO `petugas` (`id_petugas`, `user_id`, `nip`, `nama_lengkap`, `jabatan`, `shift`, `status_aktif`) VALUES
(1, 1, 'SL-2026-001', 'Ahmad Security Lead', 'Security Lead', 'pagi', 1),
(2, 2, 'PO-2026-001', 'Budi Petugas', 'Security Officer', 'pagi', 1),
(4, 4, 'PO-2026-002', 'Celcel', 'Petugas', 'pagi', 1),
(8, 9, 'MJ-2026-004', 'Vania', 'Manager Umum', NULL, 1),
(9, 10, 'MJ-2026-005', 'Vanessa Susanto', 'Anggota Tim Management 1', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tindakan`
--

CREATE TABLE `tindakan` (
  `id_tindakan` int(11) NOT NULL,
  `id_insiden` int(11) NOT NULL,
  `jenis_tindakan` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `status` enum('dijadwalkan','dalam proses','selesai') DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `waktu_selesai` timestamp NULL DEFAULT NULL,
  `hasil` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `nip` varchar(20) DEFAULT NULL,
  `password` varchar(225) NOT NULL,
  `role` enum('security_lead','petugas','manajemen') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `username`, `nip`, `password`, `role`) VALUES
(1, 'security_lead', 'SL-2026-001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'security_lead'),
(2, 'petugas1', 'PO-2026-001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'petugas'),
(3, 'manajemen', 'MJ-2026-001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manajemen'),
(4, 'PO-2026-002', 'PO-2026-002', '$2b$10$X2TsQvmi7wa2ODKg9TdWse2DsWDabTjJrO/k9a1VWASCHqkCUVzYu', 'petugas'),
(5, 'MJ-2026-002', 'MJ-2026-002', '$2b$10$dUgwbKNWrucpot8jdIYpZefmbooJUw.w6c8rku6k2i1YopWEyTCyu', 'petugas'),
(6, 'PO-2026-003', 'PO-2026-003', '$2b$10$NmdzW.Pu3GdAt8.Twd/J5ePNCSTPu8IDD9xHgzDfktfSCHknXMYIm', 'petugas'),
(7, 'MJ-2026-003', 'MJ-2026-003', '$2b$10$8fxtAOfGj.UGUnZriASKX.J.UqwlhVYiYq4.1ibXdlPg1HucXN3Ti', 'petugas'),
(8, 'MJ-2026-001', NULL, '$2b$10$wXH4rHwhS5VDpWAwlf0sSeS3ANaeCzGc.XGvhP.kyCqsMJ5jmjGHS', 'manajemen'),
(9, 'MJ-2026-004', NULL, '$2b$10$b9GP.oZsXFtrKW7YIeitxeN8CoUfYv4ATNODDc3XyLvJte5OSkeeG', 'manajemen'),
(10, 'MJ-2026-005', NULL, '$2b$10$kXh/aJYyb8Chjxutb/kpuOwjrhWmL0.7jy1zm3YffoE5T67As4Dzq', 'manajemen');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `insiden`
--
ALTER TABLE `insiden`
  ADD PRIMARY KEY (`id_insiden`),
  ADD UNIQUE KEY `kode_insiden` (`kode_insiden`),
  ADD KEY `id_lokasi` (`id_lokasi`),
  ADD KEY `id_petugas` (`id_petugas`);

--
-- Indexes for table `lokasi`
--
ALTER TABLE `lokasi`
  ADD PRIMARY KEY (`id_lokasi`);

--
-- Indexes for table `petugas`
--
ALTER TABLE `petugas`
  ADD PRIMARY KEY (`id_petugas`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `nip` (`nip`);

--
-- Indexes for table `tindakan`
--
ALTER TABLE `tindakan`
  ADD PRIMARY KEY (`id_tindakan`),
  ADD KEY `fk_tindakan_insiden_01` (`id_insiden`),
  ADD KEY `fk_tindakan_petugas_01` (`id_petugas`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `nip` (`nip`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `insiden`
--
ALTER TABLE `insiden`
  MODIFY `id_insiden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `lokasi`
--
ALTER TABLE `lokasi`
  MODIFY `id_lokasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `petugas`
--
ALTER TABLE `petugas`
  MODIFY `id_petugas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tindakan`
--
ALTER TABLE `tindakan`
  MODIFY `id_tindakan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `insiden`
--
ALTER TABLE `insiden`
  ADD CONSTRAINT `fk_insiden_lokasi_01` FOREIGN KEY (`id_lokasi`) REFERENCES `lokasi` (`id_lokasi`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_insiden_petugas_01` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_petugas`) ON UPDATE CASCADE;

--
-- Constraints for table `petugas`
--
ALTER TABLE `petugas`
  ADD CONSTRAINT `fk_petugas_user_01` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `tindakan`
--
ALTER TABLE `tindakan`
  ADD CONSTRAINT `fk_tindakan_insiden_01` FOREIGN KEY (`id_insiden`) REFERENCES `insiden` (`id_insiden`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tindakan_petugas_01` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_petugas`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
