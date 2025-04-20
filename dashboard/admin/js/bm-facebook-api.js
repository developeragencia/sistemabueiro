// Configuração da API do Facebook
const FB_API_CONFIG = {
    version: 'v18.0',
    baseUrl: 'https://graph.facebook.com',
    endpoints: {
        businessManager: '/business',
        accounts: '/owned_ad_accounts',
        users: '/business_users',
        roles: '/assigned_users'
    }
};

// Classe principal para gerenciamento da API
class FacebookBusinessAPI {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl = FB_API_CONFIG.baseUrl;
        this.version = FB_API_CONFIG.version;
    }

    // Método para construir URLs da API
    buildUrl(endpoint, id = '') {
        return `${this.baseUrl}/${this.version}${id}${endpoint}`;
    }

    // Método genérico para requisições
    async makeRequest(url, options = {}) {
        try {
            const defaultOptions = {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                const error = await response.json();
                throw new FacebookAPIError(error);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // Métodos específicos para Business Manager
    async getBusinessManager(bmId) {
        const url = this.buildUrl(FB_API_CONFIG.endpoints.businessManager, `/${bmId}`);
        return await this.makeRequest(url);
    }

    async getBusinessAccounts(bmId) {
        const url = this.buildUrl(FB_API_CONFIG.endpoints.accounts, `/${bmId}`);
        return await this.makeRequest(url);
    }

    async getBusinessUsers(bmId) {
        const url = this.buildUrl(FB_API_CONFIG.endpoints.users, `/${bmId}`);
        return await this.makeRequest(url);
    }

    async getUserRoles(bmId, userId) {
        const url = this.buildUrl(FB_API_CONFIG.endpoints.roles, `/${bmId}`);
        return await this.makeRequest(url, {
            params: { user_id: userId }
        });
    }

    // Métodos para gerenciamento de BM
    async createBusinessManager(data) {
        const url = this.buildUrl(FB_API_CONFIG.endpoints.businessManager);
        return await this.makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateBusinessManager(bmId, data) {
        const url = this.buildUrl(FB_API_CONFIG.endpoints.businessManager, `/${bmId}`);
        return await this.makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async deleteBusinessManager(bmId) {
        const url = this.buildUrl(FB_API_CONFIG.endpoints.businessManager, `/${bmId}`);
        return await this.makeRequest(url, {
            method: 'DELETE'
        });
    }
}

// Classe para tratamento de erros da API
class FacebookAPIError extends Error {
    constructor(error) {
        super(error.message);
        this.name = 'FacebookAPIError';
        this.code = error.code;
        this.subcode = error.error_subcode;
        this.type = error.type;
        this.fbtrace_id = error.fbtrace_id;
    }
}

// Classe para cache de dados
class BMDataCache {
    constructor() {
        this.storageKey = 'bm_facebook_data';
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    }

    save(data) {
        const cacheData = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
    }

    load() {
        const cached = localStorage.getItem(this.storageKey);
        if (!cached) return null;

        const { timestamp, data } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > this.cacheTimeout;

        if (isExpired) {
            this.clear();
            return null;
        }

        return data;
    }

    clear() {
        localStorage.removeItem(this.storageKey);
    }
}

// Classe para interação com a API do Facebook
export class FacebookAPI {
    constructor() {
        this.baseUrl = '/api/facebook'; // URL base para as requisições à API
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    // Método auxiliar para fazer requisições HTTP
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    ...this.headers,
                    ...options.headers
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro na requisição à API do Facebook');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API do Facebook:', error);
            throw error;
        }
    }

    // Busca todas as contas de anúncio
    async getAdAccounts() {
        return this.request('/ad-accounts');
    }

    // Busca detalhes de uma conta de anúncio específica
    async getAdAccountDetails(accountId) {
        return this.request(`/ad-accounts/${accountId}`);
    }

    // Cria uma nova conta de anúncio
    async createAdAccount(accountData) {
        return this.request('/ad-accounts', {
            method: 'POST',
            body: JSON.stringify(accountData)
        });
    }

    // Atualiza uma conta de anúncio existente
    async updateAdAccount(accountId, accountData) {
        return this.request(`/ad-accounts/${accountId}`, {
            method: 'PUT',
            body: JSON.stringify(accountData)
        });
    }

    // Exclui uma conta de anúncio
    async deleteAdAccount(accountId) {
        return this.request(`/ad-accounts/${accountId}`, {
            method: 'DELETE'
        });
    }

    // Busca métricas de uma conta de anúncio
    async getAdAccountMetrics(accountId) {
        return this.request(`/ad-accounts/${accountId}/metrics`);
    }

    // Busca histórico de uma conta de anúncio
    async getAdAccountHistory(accountId) {
        return this.request(`/ad-accounts/${accountId}/history`);
    }

    // Busca usuários associados a uma conta de anúncio
    async getAdAccountUsers(accountId) {
        return this.request(`/ad-accounts/${accountId}/users`);
    }

    // Adiciona um usuário a uma conta de anúncio
    async addAdAccountUser(accountId, userData) {
        return this.request(`/ad-accounts/${accountId}/users`, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Remove um usuário de uma conta de anúncio
    async removeAdAccountUser(accountId, userId) {
        return this.request(`/ad-accounts/${accountId}/users/${userId}`, {
            method: 'DELETE'
        });
    }

    // Atualiza as permissões de um usuário em uma conta de anúncio
    async updateAdAccountUserPermissions(accountId, userId, permissions) {
        return this.request(`/ad-accounts/${accountId}/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ permissions })
        });
    }

    // Busca insights de uma conta de anúncio
    async getAdAccountInsights(accountId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/ad-accounts/${accountId}/insights?${queryString}`);
    }

    // Busca campanhas de uma conta de anúncio
    async getAdAccountCampaigns(accountId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/ad-accounts/${accountId}/campaigns?${queryString}`);
    }

    // Busca conjuntos de anúncios de uma conta
    async getAdAccountAdSets(accountId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/ad-accounts/${accountId}/adsets?${queryString}`);
    }

    // Busca anúncios de uma conta
    async getAdAccountAds(accountId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/ad-accounts/${accountId}/ads?${queryString}`);
    }

    // Busca o limite de gastos de uma conta
    async getAdAccountSpendingLimit(accountId) {
        return this.request(`/ad-accounts/${accountId}/spending-limit`);
    }

    // Atualiza o limite de gastos de uma conta
    async updateAdAccountSpendingLimit(accountId, limit) {
        return this.request(`/ad-accounts/${accountId}/spending-limit`, {
            method: 'PUT',
            body: JSON.stringify({ limit })
        });
    }

    // Busca as faturas de uma conta
    async getAdAccountBilling(accountId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/ad-accounts/${accountId}/billing?${queryString}`);
    }

    // Busca o método de pagamento de uma conta
    async getAdAccountPaymentMethod(accountId) {
        return this.request(`/ad-accounts/${accountId}/payment-method`);
    }

    // Atualiza o método de pagamento de uma conta
    async updateAdAccountPaymentMethod(accountId, paymentData) {
        return this.request(`/ad-accounts/${accountId}/payment-method`, {
            method: 'PUT',
            body: JSON.stringify(paymentData)
        });
    }

    // Busca as notificações de uma conta
    async getAdAccountNotifications(accountId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/ad-accounts/${accountId}/notifications?${queryString}`);
    }

    // Marca uma notificação como lida
    async markNotificationAsRead(accountId, notificationId) {
        return this.request(`/ad-accounts/${accountId}/notifications/${notificationId}`, {
            method: 'PUT',
            body: JSON.stringify({ read: true })
        });
    }

    // Busca todas as campanhas de uma conta de anúncio
    async getAdAccountCampaigns(accountId = null) {
        const queryString = accountId ? `?account_id=${accountId}` : '';
        return this.request(`/campaigns${queryString}`);
    }

    // Busca detalhes de uma campanha específica
    async getCampaignDetails(campaignId) {
        return this.request(`/campaigns/${campaignId}`);
    }

    // Cria uma nova campanha
    async createCampaign(campaignData) {
        return this.request('/campaigns', {
            method: 'POST',
            body: JSON.stringify(campaignData)
        });
    }

    // Atualiza uma campanha existente
    async updateCampaign(campaignId, campaignData) {
        return this.request(`/campaigns/${campaignId}`, {
            method: 'PUT',
            body: JSON.stringify(campaignData)
        });
    }

    // Exclui uma campanha
    async deleteCampaign(campaignId) {
        return this.request(`/campaigns/${campaignId}`, {
            method: 'DELETE'
        });
    }

    // Busca métricas de uma campanha
    async getCampaignMetrics(campaignId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/campaigns/${campaignId}/metrics?${queryString}`);
    }

    // Busca conjuntos de anúncios de uma campanha
    async getCampaignAdSets(campaignId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/campaigns/${campaignId}/adsets?${queryString}`);
    }

    // Busca anúncios de uma campanha
    async getCampaignAds(campaignId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/campaigns/${campaignId}/ads?${queryString}`);
    }

    // Busca insights de uma campanha
    async getCampaignInsights(campaignId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/campaigns/${campaignId}/insights?${queryString}`);
    }

    // Pausa uma campanha
    async pauseCampaign(campaignId) {
        return this.request(`/campaigns/${campaignId}/pause`, {
            method: 'POST'
        });
    }

    // Ativa uma campanha
    async activateCampaign(campaignId) {
        return this.request(`/campaigns/${campaignId}/activate`, {
            method: 'POST'
        });
    }

    // Arquiva uma campanha
    async archiveCampaign(campaignId) {
        return this.request(`/campaigns/${campaignId}/archive`, {
            method: 'POST'
        });
    }

    // Duplica uma campanha
    async duplicateCampaign(campaignId, newCampaignData) {
        return this.request(`/campaigns/${campaignId}/duplicate`, {
            method: 'POST',
            body: JSON.stringify(newCampaignData)
        });
    }

    // Busca o histórico de alterações de uma campanha
    async getCampaignHistory(campaignId) {
        return this.request(`/campaigns/${campaignId}/history`);
    }

    // Busca as notificações de uma campanha
    async getCampaignNotifications(campaignId) {
        return this.request(`/campaigns/${campaignId}/notifications`);
    }
}

// Exportar classes e configurações
export {
    FacebookBusinessAPI,
    FacebookAPIError,
    BMDataCache,
    FB_API_CONFIG
}; 