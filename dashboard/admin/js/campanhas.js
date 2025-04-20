import { FacebookAPI } from './bm-facebook-api.js';

class CampaignsManager {
    constructor() {
        this.api = new FacebookAPI();
        this.campaigns = [];
        this.accounts = [];
        this.selectedCampaignId = null;
        this.performanceChart = null;
        this.initializeEventListeners();
        this.loadData();
    }

    // Inicializa todos os event listeners
    initializeEventListeners() {
        // Filtros
        document.getElementById('account-filter').addEventListener('change', () => this.filterCampaigns());
        document.getElementById('status-filter').addEventListener('change', () => this.filterCampaigns());
        document.getElementById('objective-filter').addEventListener('change', () => this.filterCampaigns());
        document.getElementById('search-input').addEventListener('input', () => this.filterCampaigns());

        // Botões de ação
        document.getElementById('add-campaign').addEventListener('click', () => this.showEditModal());
        document.getElementById('export-campaigns').addEventListener('click', () => this.exportCampaigns());

        // Modais
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        document.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Form de edição
        document.getElementById('edit-campaign-form').addEventListener('submit', (e) => this.handleCampaignSubmit(e));

        // Botão de confirmação de exclusão
        document.getElementById('confirm-delete').addEventListener('click', () => this.deleteCampaign());
    }

    // Carrega os dados iniciais
    async loadData() {
        try {
            this.showLoading();
            const [accounts, campaigns] = await Promise.all([
                this.api.getAdAccounts(),
                this.api.getAdAccountCampaigns()
            ]);
            this.accounts = accounts;
            this.campaigns = campaigns;
            this.updateAccountsFilter();
            this.updateCampaignsTable();
            this.updateStatistics();
            this.hideLoading();
        } catch (error) {
            this.showAlert('Erro ao carregar dados: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    // Atualiza o filtro de contas
    updateAccountsFilter() {
        const select = document.getElementById('account-filter');
        select.innerHTML = '<option value="">Conta de Anúncio</option>';
        this.accounts.forEach(account => {
            select.innerHTML += `<option value="${account.id}">${account.name}</option>`;
        });

        // Atualiza também o select do formulário de edição
        const editSelect = document.getElementById('edit-account');
        editSelect.innerHTML = this.accounts.map(account => 
            `<option value="${account.id}">${account.name}</option>`
        ).join('');
    }

    // Atualiza a tabela de campanhas
    updateCampaignsTable(campaigns = this.campaigns) {
        const tbody = document.getElementById('campaigns-table-body');
        tbody.innerHTML = '';

        campaigns.forEach(campaign => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${campaign.name}</td>
                <td>${this.getAccountName(campaign.accountId)}</td>
                <td><span class="badge badge-${campaign.status.toLowerCase()}">${this.formatStatus(campaign.status)}</span></td>
                <td><span class="objective-badge objective-${campaign.objective}">${this.formatObjective(campaign.objective)}</span></td>
                <td>R$ ${this.formatNumber(campaign.spend)}</td>
                <td>
                    <div class="performance-indicator performance-${this.getPerformanceLevel(campaign.performance)}">
                        <span>${campaign.performance}%</span>
                        <div class="performance-bar">
                            <div class="performance-bar-fill" style="width: ${campaign.performance}%"></div>
                        </div>
                    </div>
                </td>
                <td>${this.formatDate(campaign.startTime)}</td>
                <td class="actions">
                    <button class="btn-icon" onclick="campaignManager.showDetailsModal('${campaign.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="campaignManager.showEditModal('${campaign.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="campaignManager.showDeleteModal('${campaign.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Atualiza as estatísticas
    updateStatistics() {
        const stats = {
            total: this.campaigns.length,
            active: this.campaigns.filter(c => c.status === 'ACTIVE').length,
            totalSpend: this.campaigns.reduce((sum, c) => sum + c.spend, 0),
            avgPerformance: this.campaigns.reduce((sum, c) => sum + c.performance, 0) / this.campaigns.length || 0
        };

        document.getElementById('total-campaigns').textContent = stats.total;
        document.getElementById('active-campaigns').textContent = stats.active;
        document.getElementById('total-spend').textContent = `R$ ${this.formatNumber(stats.totalSpend)}`;
        document.getElementById('avg-performance').textContent = `${this.formatNumber(stats.avgPerformance)}%`;
    }

    // Filtra as campanhas
    filterCampaigns() {
        const accountFilter = document.getElementById('account-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        const objectiveFilter = document.getElementById('objective-filter').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();

        const filtered = this.campaigns.filter(campaign => {
            const matchesAccount = !accountFilter || campaign.accountId === accountFilter;
            const matchesStatus = !statusFilter || campaign.status === statusFilter;
            const matchesObjective = !objectiveFilter || campaign.objective === objectiveFilter;
            const matchesSearch = !searchTerm || 
                campaign.name.toLowerCase().includes(searchTerm) || 
                campaign.id.toLowerCase().includes(searchTerm);

            return matchesAccount && matchesStatus && matchesObjective && matchesSearch;
        });

        this.updateCampaignsTable(filtered);
    }

    // Exibe o modal de detalhes
    async showDetailsModal(campaignId) {
        try {
            this.showLoading();
            const [campaign, metrics, adsets] = await Promise.all([
                this.api.getCampaignDetails(campaignId),
                this.api.getCampaignMetrics(campaignId),
                this.api.getCampaignAdSets(campaignId)
            ]);

            // Preenche as informações básicas
            document.getElementById('detail-name').textContent = campaign.name;
            document.getElementById('detail-campaign-id').textContent = campaign.id;
            document.getElementById('detail-status').textContent = this.formatStatus(campaign.status);
            document.getElementById('detail-objective').textContent = this.formatObjective(campaign.objective);
            document.getElementById('detail-account').textContent = this.getAccountName(campaign.accountId);
            document.getElementById('detail-start-date').textContent = this.formatDate(campaign.startTime);
            document.getElementById('detail-end-date').textContent = campaign.endTime ? this.formatDate(campaign.endTime) : 'Não definido';

            // Preenche as métricas
            document.getElementById('detail-spend').textContent = `R$ ${this.formatNumber(metrics.spend)}`;
            document.getElementById('detail-impressions').textContent = this.formatNumber(metrics.impressions);
            document.getElementById('detail-clicks').textContent = this.formatNumber(metrics.clicks);
            document.getElementById('detail-ctr').textContent = `${this.formatNumber(metrics.ctr)}%`;

            // Preenche a lista de conjuntos de anúncios
            const adsetsList = document.getElementById('detail-adsets-list');
            adsetsList.innerHTML = adsets.map(adset => `
                <div class="adset-item">
                    <div class="adset-header">
                        <span class="adset-name">${adset.name}</span>
                        <span class="badge badge-${adset.status.toLowerCase()}">${this.formatStatus(adset.status)}</span>
                    </div>
                    <div class="adset-metrics">
                        <div class="adset-metric">
                            <span class="adset-metric-value">R$ ${this.formatNumber(adset.spend)}</span>
                            <span class="adset-metric-label">Gasto</span>
                        </div>
                        <div class="adset-metric">
                            <span class="adset-metric-value">${this.formatNumber(adset.impressions)}</span>
                            <span class="adset-metric-label">Impressões</span>
                        </div>
                        <div class="adset-metric">
                            <span class="adset-metric-value">${this.formatNumber(adset.clicks)}</span>
                            <span class="adset-metric-label">Cliques</span>
                        </div>
                        <div class="adset-metric">
                            <span class="adset-metric-value">${this.formatNumber(adset.ctr)}%</span>
                            <span class="adset-metric-label">CTR</span>
                        </div>
                    </div>
                </div>
            `).join('');

            // Atualiza o gráfico de performance
            this.updatePerformanceChart(metrics.dailyStats);

            this.showModal('campaign-details-modal');
            this.hideLoading();
        } catch (error) {
            this.showAlert('Erro ao carregar detalhes da campanha: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    // Atualiza o gráfico de performance
    updatePerformanceChart(dailyStats) {
        const ctx = document.getElementById('performance-chart').getContext('2d');
        
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }

        const dates = dailyStats.map(stat => this.formatDate(stat.date));
        const spends = dailyStats.map(stat => stat.spend);
        const impressions = dailyStats.map(stat => stat.impressions);
        const clicks = dailyStats.map(stat => stat.clicks);

        this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Gasto (R$)',
                        data: spends,
                        borderColor: '#1890ff',
                        backgroundColor: 'rgba(24, 144, 255, 0.1)',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Impressões',
                        data: impressions,
                        borderColor: '#52c41a',
                        backgroundColor: 'rgba(82, 196, 26, 0.1)',
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Cliques',
                        data: clicks,
                        borderColor: '#722ed1',
                        backgroundColor: 'rgba(114, 46, 209, 0.1)',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Gasto (R$)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Impressões/Cliques'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // Exibe o modal de edição
    async showEditModal(campaignId = null) {
        const form = document.getElementById('edit-campaign-form');
        if (campaignId) {
            try {
                this.showLoading();
                const campaign = await this.api.getCampaignDetails(campaignId);
                form.querySelector('#edit-name').value = campaign.name;
                form.querySelector('#edit-account').value = campaign.accountId;
                form.querySelector('#edit-objective').value = campaign.objective;
                form.querySelector('#edit-status').value = campaign.status;
                form.querySelector('#edit-start-date').value = this.formatDateTimeLocal(campaign.startTime);
                form.querySelector('#edit-end-date').value = campaign.endTime ? this.formatDateTimeLocal(campaign.endTime) : '';
                form.querySelector('#edit-budget').value = campaign.dailyBudget;
                this.selectedCampaignId = campaignId;
                this.hideLoading();
            } catch (error) {
                this.showAlert('Erro ao carregar dados da campanha: ' + error.message, 'error');
                this.hideLoading();
                return;
            }
        } else {
            form.reset();
            this.selectedCampaignId = null;
        }
        this.showModal('edit-campaign-modal');
    }

    // Exibe o modal de confirmação de exclusão
    showDeleteModal(campaignId) {
        this.selectedCampaignId = campaignId;
        this.showModal('delete-confirm-modal');
    }

    // Manipula o envio do formulário de edição
    async handleCampaignSubmit(event) {
        event.preventDefault();
        const formData = {
            name: document.getElementById('edit-name').value,
            accountId: document.getElementById('edit-account').value,
            objective: document.getElementById('edit-objective').value,
            status: document.getElementById('edit-status').value,
            startTime: new Date(document.getElementById('edit-start-date').value).toISOString(),
            endTime: document.getElementById('edit-end-date').value ? 
                new Date(document.getElementById('edit-end-date').value).toISOString() : null,
            dailyBudget: parseFloat(document.getElementById('edit-budget').value)
        };

        try {
            this.showLoading();
            if (this.selectedCampaignId) {
                await this.api.updateCampaign(this.selectedCampaignId, formData);
                this.showAlert('Campanha atualizada com sucesso!', 'success');
            } else {
                await this.api.createCampaign(formData);
                this.showAlert('Campanha criada com sucesso!', 'success');
            }
            await this.loadData();
            this.closeModal(document.getElementById('edit-campaign-modal'));
            this.hideLoading();
        } catch (error) {
            this.showAlert('Erro ao salvar campanha: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    // Exclui a campanha selecionada
    async deleteCampaign() {
        if (!this.selectedCampaignId) return;

        try {
            this.showLoading();
            await this.api.deleteCampaign(this.selectedCampaignId);
            this.showAlert('Campanha excluída com sucesso!', 'success');
            await this.loadData();
            this.closeModal(document.getElementById('delete-confirm-modal'));
            this.hideLoading();
        } catch (error) {
            this.showAlert('Erro ao excluir campanha: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    // Exporta as campanhas para CSV
    exportCampaigns() {
        const headers = ['Nome', 'Conta', 'Status', 'Objetivo', 'Gasto', 'Performance', 'Data de Início'];
        const csvContent = [
            headers.join(','),
            ...this.campaigns.map(campaign => [
                campaign.name,
                this.getAccountName(campaign.accountId),
                this.formatStatus(campaign.status),
                this.formatObjective(campaign.objective),
                campaign.spend,
                `${campaign.performance}%`,
                this.formatDate(campaign.startTime)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `campanhas-${this.formatDate(new Date())}.csv`;
        link.click();
    }

    // Utilitários
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    showLoading() {
        document.getElementById('loading-spinner').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading-spinner').style.display = 'none';
    }

    showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alertContainer.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }

    getAccountName(accountId) {
        const account = this.accounts.find(a => a.id === accountId);
        return account ? account.name : accountId;
    }

    formatStatus(status) {
        const statusMap = {
            ACTIVE: 'Ativa',
            PAUSED: 'Pausada',
            DELETED: 'Excluída',
            ARCHIVED: 'Arquivada'
        };
        return statusMap[status] || status;
    }

    formatObjective(objective) {
        const objectiveMap = {
            AWARENESS: 'Reconhecimento',
            TRAFFIC: 'Tráfego',
            ENGAGEMENT: 'Engajamento',
            CONVERSIONS: 'Conversões',
            SALES: 'Vendas'
        };
        return objectiveMap[objective] || objective;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTimeLocal(date) {
        return new Date(date).toISOString().slice(0, 16);
    }

    formatNumber(number) {
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    getPerformanceLevel(performance) {
        if (performance >= 70) return 'high';
        if (performance >= 40) return 'medium';
        return 'low';
    }
}

// Inicializa o gerenciador de campanhas
const campaignManager = new CampaignsManager();
window.campaignManager = campaignManager; // Expõe para uso global 