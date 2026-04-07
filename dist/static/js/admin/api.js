// static/js/admin/api.js
const api = {
    async get(url) {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    },

    async post(url, data) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    },

    async delete(url) {
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    },

    async upload(url, formData) {
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json();
    }
};