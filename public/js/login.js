const loginForm = document.getElementById('loginForm');
const alertContainer = document.getElementById('alertContainer');

// Cek apakah sudah login
checkSession();

async function checkSession() {
    try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
            window.location.href = '/dashboard.html';
        }
    } catch (error) {
        console.log('Belum login');
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        const data = await res.json();

        if (data.success) {
            showAlert('success', 'Login berhasil! Mengalihkan...');
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            showAlert('danger', data.message);
        }
    } catch (error) {
        showAlert('danger', 'Terjadi kesalahan. Silakan coba lagi.');
    }
});

function showAlert(type, message) {
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}