const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifySession } = require('../middleware/auth');

router.use(verifySession);

// GET List Insiden + Join Lokasi
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT i.*, l.nama_lokasi, l.zona 
            FROM insiden i 
            LEFT JOIN lokasi l ON i.id_lokasi = l.id_lokasi 
            ORDER BY i.waktu_lapor DESC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data insiden' });
    }
});

// POST Buat Insiden Baru
router.post('/', async (req, res) => {
    try {
        const { judul, deskripsi, prioritas, id_lokasi } = req.body;
        if (!judul || !deskripsi || !id_lokasi) {
            return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }

        // Ambil id_petugas dari session
        const [[petugas]] = await db.query('SELECT id_petugas FROM petugas WHERE user_id = ?', [req.session.userId]);
        if (!petugas) return res.status(403).json({ success: false, message: 'Akun petugas tidak ditemukan' });

        const kode_insiden = `INS-${Date.now().toString().slice(-6)}`;
        const bukti_foto = req.file ? `/uploads/insiden/${req.file.filename}` : '';

        await db.query(`
            INSERT INTO insiden (kode_insiden, judul, deskripsi, prioritas, status, id_lokasi, id_petugas, penanggung_jawab, bukti_foto)
            VALUES (?, ?, ?, ?, 'Open', ?, ?, ?, ?)
        `, [kode_insiden, judul, deskripsi, prioritas || 'Medium', id_lokasi, petugas.id_petugas, req.session.username, bukti_foto]);

        res.json({ success: true, message: 'Insiden berhasil dilaporkan' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal menyimpan insiden' });
    }
});

// PUT Update Status/Detail
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const id = req.params.id;
        
        // Ambil data insiden saat ini
        const [current] = await db.query('SELECT * FROM insiden WHERE id_insiden = ?', [id]);
        if (current.length === 0) {
            return res.status(404).json({ success: false, message: 'Insiden tidak ditemukan' });
        }
        
        const insiden = current[0];
        const now = new Date();
        
        // Tentukan field waktu yang akan diupdate
        let waktu_respon = insiden.waktu_respon;
        let waktu_selesai = insiden.waktu_selesai;
        
        // Logika otomatis isi waktu
        if (status === 'In Progress' && !insiden.waktu_respon) {
            waktu_respon = now; // Isi waktu respon pertama kali
        }
        
        if ((status === 'Resolved' || status === 'Closed') && !insiden.waktu_selesai) {
            waktu_selesai = now; // Isi waktu selesai pertama kali
        }
        
        // Update database
        await db.query(
            'UPDATE insiden SET status = ?, waktu_respon = ?, waktu_selesai = ? WHERE id_insiden = ?',
            [status, waktu_respon, waktu_selesai, id]
        );
        
        res.json({ success: true, message: 'Status insiden diperbarui' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal update insiden' });
    }
});

// DELETE Hapus Insiden
router.delete('/:id', async (req, res) => {
    try {
        // Hanya security_lead yang bisa hapus
        if (req.session.role !== 'security_lead') {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }
        await db.query('DELETE FROM insiden WHERE id_insiden = ?', [req.params.id]);
        res.json({ success: true, message: 'Insiden dihapus' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Gagal menghapus insiden' });
    }
});

// GET Detail Insiden by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT i.*, l.nama_lokasi, l.kode_area, l.zona 
            FROM insiden i 
            LEFT JOIN lokasi l ON i.id_lokasi = l.id_lokasi 
            WHERE i.id_insiden = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Insiden tidak ditemukan' });
        }
        
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal mengambil detail insiden' });
    }
});

// Analytics untuk Manajemen & Security Lead
router.get('/analytics/summary', async (req, res) => {
    try {
        // Hanya manajemen dan security_lead yang bisa akses
        if (req.session.role !== 'manajemen' && req.session.role !== 'security_lead') {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }
        
        // Total insiden per status
        const [statusCount] = await db.query(`
            SELECT status, COUNT(*) as jumlah 
            FROM insiden 
            GROUP BY status
        `);
        
        // Total insiden per lokasi
        const [locationCount] = await db.query(`
            SELECT l.nama_lokasi, COUNT(i.id_insiden) as jumlah
            FROM insiden i
            LEFT JOIN lokasi l ON i.id_lokasi = l.id_lokasi
            GROUP BY l.nama_lokasi
        `);
        
        // Trend bulanan (6 bulan terakhir)
        const [monthlyTrend] = await db.query(`
            SELECT DATE_FORMAT(waktu_lapor, '%Y-%m') as bulan, COUNT(*) as jumlah
            FROM insiden
            GROUP BY bulan
            ORDER BY bulan DESC
            LIMIT 6
        `);
        
        // Rata-rata waktu respon (dalam jam)
        const [avgResponse] = await db.query(`
            SELECT AVG(TIMESTAMPDIFF(HOUR, waktu_lapor, waktu_respon)) as avg_hours
            FROM insiden
            WHERE waktu_respon IS NOT NULL
        `);
        
        res.json({ 
            success: true, 
            data: {
                per_status: statusCount,
                per_lokasi: locationCount,
                trend_bulanan: monthlyTrend,
                rata_rata_respon: avgResponse[0]?.avg_hours || 0
            }
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ success: false, message: 'Gagal mengambil analytics' });
    }
});

// Export Laporan CSV untuk Manajemen & Security Lead
router.get('/export/laporan', async (req, res) => {
    try {
        // Hanya manajemen dan security_lead yang bisa akses
        if (req.session.role !== 'manajemen' && req.session.role !== 'security_lead') {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }
        
        const [rows] = await db.query(`
            SELECT i.*, l.nama_lokasi, p.nama_lengkap as nama_petugas
            FROM insiden i 
            LEFT JOIN lokasi l ON i.id_lokasi = l.id_lokasi 
            LEFT JOIN petugas p ON i.id_petugas = p.id_petugas
            ORDER BY i.waktu_lapor DESC
        `);
        
        // Convert ke CSV
        const headers = ['Kode', 'Judul', 'Lokasi', 'Prioritas', 'Status', 'Petugas', 'Tanggal', 'Deskripsi'];
        const csvRows = [headers.join(',')];
        
        rows.forEach(row => {
            csvRows.push([
                row.kode_insiden,
                `"${row.judul}"`,
                `"${row.nama_lokasi || '-'}"`,
                row.prioritas,
                row.status,
                `"${row.nama_petugas || '-'}"`,
                new Date(row.waktu_lapor).toLocaleDateString('id-ID'),
                `"${row.deskripsi || '-'}"`
            ].join(','));
        });
        
        const csvContent = csvRows.join('\n');
        
        // Set header untuk download file
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=laporan_insiden_${Date.now()}.csv`);
        res.send(csvContent);
        
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ success: false, message: 'Gagal export laporan' });
    }
});

module.exports = router;