class FacebookAPI {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl = 'https://graph.facebook.com/v18.0';
    }

    async request(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseUrl}${endpoint}?access_token=${this.accessToken}`;
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Erro na requisição');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // Métodos para Contas de Anúncios
    async listAdAccounts() {
        return this.request('/me/adaccounts');
    }

    async getAdAccount(accountId) {
        return this.request(`/${accountId}`);
    }

    async createAdAccount(data) {
        return this.request('/me/adaccounts', 'POST', data);
    }

    async updateAdAccount(accountId, data) {
        return this.request(`/${accountId}`, 'POST', data);
    }

    async deleteAdAccount(accountId) {
        return this.request(`/${accountId}`, 'DELETE');
    }

    // Métodos para Métricas
    async getAccountMetrics(accountId, metrics, dateRange) {
        const endpoint = `/${accountId}/insights?fields=${metrics.join(',')}&time_range=${JSON.stringify(dateRange)}`;
        return this.request(endpoint);
    }

    // Métodos para Usuários
    async listAccountUsers(accountId) {
        return this.request(`/${accountId}/users`);
    }

    async addUserToAccount(accountId, userId, role) {
        return this.request(`/${accountId}/users`, 'POST', {
            user: userId,
            role: role
        });
    }

    async removeUserFromAccount(accountId, userId) {
        return this.request(`/${accountId}/users`, 'DELETE', {
            user: userId
        });
    }

    // Métodos para Insights
    async getAdInsights(adId, metrics, dateRange) {
        const endpoint = `/${adId}/insights?fields=${metrics.join(',')}&time_range=${JSON.stringify(dateRange)}`;
        return this.request(endpoint);
    }

    // Métodos para Faturamento
    async getBillingInfo(accountId) {
        return this.request(`/${accountId}/billing_info`);
    }

    async updateBillingInfo(accountId, data) {
        return this.request(`/${accountId}/billing_info`, 'POST', data);
    }
}

export default FacebookAPI; 