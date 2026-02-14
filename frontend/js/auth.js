// Authentication State Management

class Auth {
    constructor() {
        this.tokenKey = 'authToken';
        this.userKey = 'userData';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }

    // Get stored token
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    // Get stored user data
    getUser() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    // Store auth data
    setAuth(token, userData = null) {
        localStorage.setItem(this.tokenKey, token);
        if (userData) {
            localStorage.setItem(this.userKey, JSON.stringify(userData));
        }
    }

    // Clear auth data
    clearAuth() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    // Login
    async login(credentials) {
        try {
            const response = await api.login(credentials);
            this.setAuth(response.access_token, {
                username: credentials.username
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Register
    async register(userData) {
        try {
            const response = await api.register(userData);
            // Auto-login after registration
            const loginResponse = await this.login({
                username: userData.username,
                password: userData.password
            });
            return loginResponse;
        } catch (error) {
            throw error;
        }
    }

    // Logout
    logout() {
        this.clearAuth();
        window.location.href = '/frontend/html/home_page.html';
    }

    // Require authentication (redirect if not authenticated)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/frontend/html/login.html';
            return false;
        }
        return true;
    }

    // Redirect if already authenticated
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = '/frontend/html/dashboard.html';
            return true;
        }
        return false;
    }
}

// Export singleton instance
const auth = new Auth();
