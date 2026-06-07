/**
 * API Helper Wrapper
 * Menangani fetch request, session cookie, dan error handling secara terpusat
 */

const API_BASE = '/api';

/**
 * Fungsi request utama
 * @param {string} endpoint - Endpoint API (contoh: '/insiden')
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise} - Response JSON
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    // Konfigurasi default fetch
    const config = {
        credentials: 'include', // Wajib untuk mengirim/menerima session cookie
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Jika body adalah FormData (upload file), hapus header Content-Type
    // agar browser otomatis menambahkan boundary yang benar
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const res = await fetch(url, config);
        const data = await res.json();

        // Jika status HTTP bukan 2xx, lempar error dengan pesan dari backend
        if (!res.ok) {
            throw new Error(data.message || 'Terjadi kesalahan pada server');
        }

        return data;
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error.message);
        throw error;
    }
}

/**
 * Export method-method standar REST
 */
export const Api = {
    /**
     * GET request
     * @param {string} endpoint - Endpoint API
     */
    get: (endpoint) => request(endpoint, { method: 'GET' }),
    
    /**
     * POST request
     * @param {string} endpoint - Endpoint API
     * @param {object|FormData} body - Data yang akan dikirim
     */
    post: (endpoint, body) => request(endpoint, { 
        method: 'POST', 
        body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
    /**
     * PUT request
     * @param {string} endpoint - Endpoint API
     * @param {object|FormData} body - Data yang akan diupdate
     */
    put: (endpoint, body) => request(endpoint, { 
        method: 'PUT', 
        body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
    /**
     * DELETE request
     * @param {string} endpoint - Endpoint API
     */
    delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};

export default Api;