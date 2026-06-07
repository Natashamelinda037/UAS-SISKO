const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { verifySession, checkRole } = require('../middleware/auth');

// Middleware
router.use(verifySession);
router.use(checkRole(['security_lead']));

// GET: Ambil semua petugas
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, u.username 
            FROM petugas p 
            LEFT JOIN users u ON p.user_id = u.id_user 
            ORDER BY p.nama_lengkap ASC
        `);
        
        res.json({ success: true, data: rows });  // ✅ Konsisten pakai 'data'
    } catch (err) {
        console.error('Error GET petugas:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil data' });
    }
});

// POST: Tambah petugas baru
router.post('/', async (req, res) => {
    try {
        // ✅ 1. Tambah 'role' di destructuring
        const { nip, nama_lengkap, jabatan, shift, role, username, password } = req.body;
        
        // ✅ 2. Validasi TANPA shift (shift opsional untuk non-petugas)
        if (!nip || !nama_lengkap || !role || !username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Field bertanda * wajib diisi' 
            });
        }

        // ✅ 3. Validasi shift HANYA untuk petugas
        if (role === 'petugas' && !shift) {
            return res.status(400).json({ 
                success: false, 
                message: 'Shift wajib dipilih untuk Petugas' 
            });
        }

        // ✅ 4. Validasi role yang diizinkan
        const validRoles = ['petugas', 'manajemen', 'security_lead'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Role tidak valid' 
            });
        }

        // Cek duplikat username
        const [checkUser] = await db.query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );
        if (checkUser.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username sudah terdaftar' 
            });
        }

        // Cek duplikat NIP (opsional, tapi bagus untuk validasi)
        const [checkNip] = await db.query(
            'SELECT * FROM petugas WHERE nip = ?', 
            [nip]
        );
        if (checkNip.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'NIP sudah terdaftar' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ 5. Insert ke users dengan role DYNAMIC (bukan hardcoded)
        const [userResult] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]  // ✅ Pakai variabel 'role'
        );
        const newUserId = userResult.insertId;

        // ✅ 6. Insert ke petugas (shift bisa NULL untuk manajemen)
        await db.query(
            'INSERT INTO petugas (user_id, nip, nama_lengkap, jabatan, shift, status_aktif) VALUES (?, ?, ?, ?, ?, 1)',
            [newUserId, nip, nama_lengkap, jabatan || 'Security Officer', shift]  // shift bisa null
        );

        res.json({ 
            success: true, 
            message: 'Petugas berhasil ditambahkan',
            data: { id: newUserId }
        });
        
    } catch (err) {
        console.error('Error POST petugas:', err);
        res.status(500).json({ success: false, message: 'Gagal: ' + err.message });
    }
});

// PUT: Update status aktif/nonaktif
router.put('/:id/status', async (req, res) => {
    try {
        const { status_aktif } = req.body;
        const id = req.params.id;
        
        console.log('Update status - ID:', id, 'New Status:', status_aktif);
        
        const [result] = await db.query(
            'UPDATE petugas SET status_aktif = ? WHERE id_petugas = ?', 
            [status_aktif ? 1 : 0, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Petugas tidak ditemukan' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Status berhasil diupdate',
            data: { status_aktif: status_aktif ? 1 : 0 }
        });
    } catch (err) {
        console.error('Error PUT petugas status:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Gagal update: ' + err.message 
        });
    }
});

// DELETE Hapus Petugas
router.delete('/:id', async (req, res) => {
    try {
        // Hanya security_lead yang bisa hapus
        if (req.session.role !== 'security_lead') {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }

        const petugasId = req.params.id;

        // 1. Cari user_id dari petugas yang akan dihapus
        const [petugasData] = await db.query(
            'SELECT user_id FROM petugas WHERE id_petugas = ?', 
            [petugasId]
        );

        if (petugasData.length === 0) {
            return res.status(404).json({ success: false, message: 'Petugas tidak ditemukan' });
        }

        const userId = petugasData[0].user_id;

        // 2. Hapus dari tabel petugas dulu
        await db.query('DELETE FROM petugas WHERE id_petugas = ?', [petugasId]);

        // 3. Hapus dari tabel users (cascade)
        await db.query('DELETE FROM users WHERE id_user = ?', [userId]);

        res.json({ success: true, message: 'Petugas dan user berhasil dihapus' });
        
    } catch (err) {
        console.error('Error DELETE petugas:', err);
        res.status(500).json({ success: false, message: 'Gagal menghapus: ' + err.message });
    }
});

module.exports = router;