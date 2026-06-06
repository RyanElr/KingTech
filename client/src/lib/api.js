const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Send cookies
      ...options,
    };

    // Add auth token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, config);

      // Handle token expiration
      if (response.status === 401) {
        const data = await response.json();
        if (data.expired) {
          // Try to refresh token
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry original request with new token
            const newToken = localStorage.getItem('accessToken');
            config.headers.Authorization = `Bearer ${newToken}`;
            const retryResponse = await fetch(url, config);
            return await retryResponse.json();
          }
        }
        return data;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'Erreur de connexion au serveur.' };
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }
      // Refresh failed - clear auth
      localStorage.removeItem('accessToken');
      return false;
    } catch {
      localStorage.removeItem('accessToken');
      return false;
    }
  }

  // Auth
  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Products
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  getFeaturedProducts() {
    return this.request('/products/featured');
  }

  getProductBySlug(slug) {
    return this.request(`/products/${slug}`);
  }

  getProductsByCategory(category) {
    return this.request(`/products/category/${category}`);
  }

  // Cart
  getCart() {
    return this.request('/cart');
  }

  addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  updateCartItem(productId, quantity) {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  removeFromCart(productId) {
    return this.request(`/cart/remove/${productId}`, { method: 'DELETE' });
  }

  clearCart() {
    return this.request('/cart/clear', { method: 'DELETE' });
  }

  // Orders
  createOrder(shippingAddress) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress }),
    });
  }

  getMyOrders() {
    return this.request('/orders');
  }

  getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  // User
  getProfile() {
    return this.request('/users/profile');
  }

  updateProfile(data) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  updatePassword(data) {
    return this.request('/users/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

const api = new ApiClient();
export default api;
