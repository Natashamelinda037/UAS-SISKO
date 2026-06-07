const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username dan password wajib diisi' 
            });
        }

        // Cari user di database
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Username atau password salah' 
            });
        }

        const user = rows[0];

        // Cek password (bcrypt compare)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Username atau password salah' 
            });
        }

        // Simpan session
        req.session.userId = user.id_user;
        req.session.username = user.username;
        req.session.role = user.role;

        res.json({ 
            success: true, 
            message: 'Login berhasil',
            data: {
                userId: user.id_user,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server' 
        });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Gagal logout' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Logout berhasil' 
        });
    });
});

// GET /api/auth/me (cek session user yang login)
router.get('/me', (req, res) => {
    if (req.session.userId) {
        res.json({
            success: true,
            data: {
                userId: req.session.userId,
                username: req.session.username,
                role: req.session.role
            }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Tidak ada session aktif' 
        });
    }
});

module.exports = router;