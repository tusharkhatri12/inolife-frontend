const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Simple offline queueing for requests
const processOfflineQueue = async () => {
    const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} offline requests...`);
    const remainingQueue = [];

    for (const req of queue) {
        try {
            await fetch(`${API_BASE}${req.endpoint}`, {
                method: req.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body)
            });
            console.log(`Synced offline request: ${req.endpoint}`);
        } catch (e) {
            console.error('Failed to sync offline request, pushing back to queue', e);
            remainingQueue.push(req);
        }
    }
    localStorage.setItem('offline_queue', JSON.stringify(remainingQueue));
};

// Add listener to process queue when internet is restored
window.addEventListener('online', processOfflineQueue);

// Helper for fetch
const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        // If it's a mutation and we get a network error, queue it
        if (!navigator.onLine && options.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
            const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
            queue.push({
                endpoint,
                method: options.method,
                body: JSON.parse(options.body || '{}')
            });
            localStorage.setItem('offline_queue', JSON.stringify(queue));
            // Simulate success so UI doesn't break
            return { __offlineSaved: true, message: 'Saved offline, will sync later' };
        }
        throw error;
    }
};

export const api = {
    getDoctors: () => fetchAPI('/doctors'),
    createDoctor: (docData) => fetchAPI('/doctors', { method: 'POST', body: JSON.stringify(docData) }),
    getFollowUps: () => {
        const mrParam = localStorage.getItem('mrName') ? `?mrName=${encodeURIComponent(localStorage.getItem('mrName'))}` : '';
        return fetchAPI(`/visits/followups${mrParam}`);
    },
    getVisits: () => {
        const mrParam = localStorage.getItem('mrName') ? `mrName=${encodeURIComponent(localStorage.getItem('mrName'))}` : '';
        return fetchAPI(`/visits${mrParam ? '?'+mrParam : ''}`);
    },
    getDoctorVisits: (doctorId) => {
        const mrParam = localStorage.getItem('mrName') ? `mrName=${encodeURIComponent(localStorage.getItem('mrName'))}` : '';
        return fetchAPI(`/visits/doctor/${doctorId}${mrParam ? '?'+mrParam : ''}`);
    },
    getProducts: () => fetchAPI('/products'),
    createProduct: (prodData) => fetchAPI('/products', { method: 'POST', body: JSON.stringify(prodData) }),
    getDailyReport: () => {
        const mrParam = localStorage.getItem('mrName') ? `?mrName=${encodeURIComponent(localStorage.getItem('mrName'))}` : '';
        return fetchAPI(`/daily-report${mrParam}`);
    },
    createVisit: (visitData) => {
        visitData.mrName = localStorage.getItem('mrName') || 'Representative';
        return fetchAPI('/visits', { method: 'POST', body: JSON.stringify(visitData) });
    },
    createOrder: (orderData) => {
        orderData.mrName = localStorage.getItem('mrName') || 'Representative';
        return fetchAPI('/orders', { method: 'POST', body: JSON.stringify(orderData) });
    },
    getOrders: (period) => {
        const mrParam = localStorage.getItem('mrName') ? `mrName=${encodeURIComponent(localStorage.getItem('mrName'))}` : '';
        const periodParam = period ? `period=${period}` : '';
        const qs = [mrParam, periodParam].filter(Boolean).join('&');
        return fetchAPI(`/orders${qs ? '?'+qs : ''}`);
    },
    completeFollowUp: (id) => fetchAPI(`/visits/followups/${id}/complete`, { method: 'POST' }),
    syncOffline: processOfflineQueue
};
