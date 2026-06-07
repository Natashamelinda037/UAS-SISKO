const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifySession } = require('../middleware/auth');

router.use(verifySession);

// GET semua lokasi
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM lokasi ORDER BY nama_lokasi ASC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data lokasi' });
    }
});

module.exports = router;