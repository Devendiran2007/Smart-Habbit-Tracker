// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// API Service Class
class APIService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem('authToken');
    }

    // Get auth headers
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.auth !== false),
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.detail || data.message || 'Request failed',
                    data
                };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // User Authentication & Profile APIs
    async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            auth: false
        });
    }

    async getCurrentUser() {
        return this.request('/users/me', {
            method: 'GET'
        });
    }

    async updateProfile(profileData) {
        return this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(passwordData) {
        return this.request('/users/me/password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    async login(credentials) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            auth: false
        });
    }

    // Habit APIs
    async createHabit(habitData) {
        return this.request('/habbits/create', {
            method: 'POST',
            body: JSON.stringify(habitData)
        });
    }

    async getHabits() {
        return this.request('/habbits/habbits', {
            method: 'GET'
        });
    }

    async getHabit(habitId) {
        return this.request(`/habbits/habbits/${habitId}`, {
            method: 'GET'
        });
    }

    async updateHabit(habitId, habitData) {
        return this.request(`/habbits/habbits/${habitId}`, {
            method: 'PUT',
            body: JSON.stringify(habitData)
        });
    }

    async deleteHabit(habitId) {
        return this.request(`/habbits/habbits/${habitId}`, {
            method: 'DELETE'
        });
    }

    // Completion APIs
    async completeHabit(habitId) {
        return this.request(`/completions/${habitId}`, {
            method: 'POST'
        });
    }

    async uncompleteHabit(habitId) {
        return this.request(`/completions/${habitId}`, {
            method: 'DELETE'
        });
    }

    async checkCompletedToday(habitId) {
        return this.request(`/completions/${habitId}/today`, {
            method: 'GET'
        });
    }

    async getStreak(habitId) {
        return this.request(`/completions/${habitId}/streak`, {
            method: 'GET'
        });
    }

    async getStats(habitId) {
        return this.request(`/completions/${habitId}/stats`, {
            method: 'GET'
        });
    }
}

// Export singleton instance
const api = new APIService();
