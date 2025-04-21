class AdSetsManager {
    constructor(facebookAPI) {
        this.facebookAPI = facebookAPI;
        this.adSets = [];
    }

    async loadAdSets(accountId) {
        try {
            const response = await this.facebookAPI.request(`/${accountId}/adsets`);
            this.adSets = response.data;
            return this.adSets;
        } catch (error) {
            console.error('Erro ao carregar conjuntos de anúncios:', error);
            throw error;
        }
    }

    async getAdSet(adSetId) {
        try {
            const adSet = await this.facebookAPI.request(`/${adSetId}`);
            return adSet;
        } catch (error) {
            console.error('Erro ao obter conjunto de anúncios:', error);
            throw error;
        }
    }

    async createAdSet(accountId, data) {
        try {
            const adSet = await this.facebookAPI.request(`/${accountId}/adsets`, 'POST', data);
            this.adSets.push(adSet);
            return adSet;
        } catch (error) {
            console.error('Erro ao criar conjunto de anúncios:', error);
            throw error;
        }
    }

    async updateAdSet(adSetId, data) {
        try {
            const adSet = await this.facebookAPI.request(`/${adSetId}`, 'POST', data);
            const index = this.adSets.findIndex(set => set.id === adSetId);
            if (index !== -1) {
                this.adSets[index] = adSet;
            }
            return adSet;
        } catch (error) {
            console.error('Erro ao atualizar conjunto de anúncios:', error);
            throw error;
        }
    }

    async deleteAdSet(adSetId) {
        try {
            await this.facebookAPI.request(`/${adSetId}`, 'DELETE');
            this.adSets = this.adSets.filter(set => set.id !== adSetId);
            return true;
        } catch (error) {
            console.error('Erro ao deletar conjunto de anúncios:', error);
            throw error;
        }
    }

    async getAdSetInsights(adSetId, metrics, dateRange) {
        try {
            const insights = await this.facebookAPI.getAdInsights(adSetId, metrics, dateRange);
            return insights.data;
        } catch (error) {
            console.error('Erro ao obter insights do conjunto de anúncios:', error);
            throw error;
        }
    }

    async updateAdSetStatus(adSetId, status) {
        try {
            const adSet = await this.updateAdSet(adSetId, { status });
            return adSet;
        } catch (error) {
            console.error('Erro ao atualizar status do conjunto de anúncios:', error);
            throw error;
        }
    }

    async getAdSetAds(adSetId) {
        try {
            const response = await this.facebookAPI.request(`/${adSetId}/ads`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter anúncios do conjunto:', error);
            throw error;
        }
    }

    async getAdSetTargeting(adSetId) {
        try {
            const adSet = await this.getAdSet(adSetId);
            return adSet.targeting;
        } catch (error) {
            console.error('Erro ao obter targeting do conjunto de anúncios:', error);
            throw error;
        }
    }

    async updateAdSetBudget(adSetId, budget) {
        try {
            const adSet = await this.updateAdSet(adSetId, { budget });
            return adSet;
        } catch (error) {
            console.error('Erro ao atualizar orçamento do conjunto de anúncios:', error);
            throw error;
        }
    }

    async getAdSetSchedule(adSetId) {
        try {
            const adSet = await this.getAdSet(adSetId);
            return adSet.schedule;
        } catch (error) {
            console.error('Erro ao obter agendamento do conjunto de anúncios:', error);
            throw error;
        }
    }
}

export default AdSetsManager; 