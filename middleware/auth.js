// Middleware untuk verifikasi session
function verifySession(req, res, next) {
    if (req.session && req.session.userId) {
        next(); // User sudah login, lanjutkan
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Silakan login terlebih dahulu' 
        });
    }
}

// Middleware untuk role-based access (RBAC)
function checkRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.session.role) {
            return res.status(401).json({ 
                success: false, 
                message: 'Session tidak valid' 
            });
        }

        if (!allowedRoles.includes(req.session.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Akses ditolak - tidak memiliki permission' 
            });
        }

        next();
    };
}

module.exports = { verifySession, checkRole };