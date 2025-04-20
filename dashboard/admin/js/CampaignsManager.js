class CampaignsManager {
    constructor() {
        this.api = new FacebookAPI();
        this.currentFilters = {
            account: 'all',
            status: 'all',
            dateRange: {
                start: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                end: moment().format('YYYY-MM-DD')
            },
            searchTerm: ''
        };
        
        // Inicialização
        this.initializeElements();
        this.setupEventListeners();
        this.initializeDateRangePicker();
        this.loadCampaigns();
    }

    initializeElements() {
        // Elementos da tabela
        this.tableBody = document.querySelector('#campaigns-table tbody');
        this.loadingOverlay = document.querySelector('#loading-overlay');
        
        // Elementos de filtro
        this.accountFilter = document.querySelector('#account-filter');
        this.statusFilter = document.querySelector('#status-filter');
        this.dateRangeInput = document.querySelector('#date-range');
        this.searchInput = document.querySelector('#search-input');
        
        // Elementos dos modais
        this.createModal = new bootstrap.Modal(document.querySelector('#create-campaign-modal'));
        this.editModal = new bootstrap.Modal(document.querySelector('#edit-campaign-modal'));
        this.deleteModal = new bootstrap.Modal(document.querySelector('#delete-campaign-modal'));
        this.insightsModal = new bootstrap.Modal(document.querySelector('#insights-modal'));
        
        // Elementos de métricas
        this.totalCampaignsElement = document.querySelector('#total-campaigns');
        this.activeCampaignsElement = document.querySelector('#active-campaigns');
        this.pausedCampaignsElement = document.querySelector('#paused-campaigns');
        this.totalSpendElement = document.querySelector('#total-spend');
    }

    setupEventListeners() {
        // Event listeners para filtros
        this.accountFilter.addEventListener('change', () => this.handleFiltersChange());
        this.statusFilter.addEventListener('change', () => this.handleFiltersChange());
        this.searchInput.addEventListener('input', () => this.handleSearch());

        // Event listeners para ações
        document.querySelector('#create-campaign-btn').addEventListener('click', () => this.showCreateModal());
        document.querySelector('#export-campaigns-btn').addEventListener('click', () => this.exportToCSV());

        // Event listeners para formulários
        document.querySelector('#create-campaign-form').addEventListener('submit', (e) => this.handleCreateSubmit(e));
        document.querySelector('#edit-campaign-form').addEventListener('submit', (e) => this.handleEditSubmit(e));
        document.querySelector('#delete-campaign-form').addEventListener('submit', (e) => this.handleDeleteSubmit(e));
    }

    initializeDateRangePicker() {
        $(this.dateRangeInput).daterangepicker({
            startDate: moment().subtract(30, 'days'),
            endDate: moment(),
            ranges: {
                'Hoje': [moment(), moment()],
                'Ontem': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Últimos 7 dias': [moment().subtract(6, 'days'), moment()],
                'Últimos 30 dias': [moment().subtract(29, 'days'), moment()],
                'Este mês': [moment().startOf('month'), moment().endOf('month')],
                'Mês passado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            locale: {
                format: 'DD/MM/YYYY',
                separator: ' - ',
                applyLabel: 'Aplicar',
                cancelLabel: 'Cancelar',
                fromLabel: 'De',
                toLabel: 'Até',
                customRangeLabel: 'Personalizado',
                weekLabel: 'S',
                daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                firstDay: 0
            }
        }, (start, end) => {
            this.currentFilters.dateRange = {
                start: start.format('YYYY-MM-DD'),
                end: end.format('YYYY-MM-DD')
            };
            this.loadCampaigns();
        });
    }

    async loadCampaigns() {
        try {
            this.showLoading();
            
            const response = await this.api.getCampaigns(this.currentFilters);
            
            // Atualizar métricas
            this.updateMetrics(response.metrics);
            
            // Renderizar tabela
            this.renderTable(response.campaigns);
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar campanhas', error.message);
        }
    }

    renderTable(campaigns) {
        this.tableBody.innerHTML = '';
        
        campaigns.forEach(campaign => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="campaign-info">
                        <div class="campaign-icon ${campaign.objective}">
                            <i class="fas ${this.getObjectiveIcon(campaign.objective)}"></i>
                        </div>
                        <div class="campaign-details">
                            <h6>${campaign.name}</h6>
                            <small>${campaign.id}</small>
                        </div>
                    </div>
                </td>
                <td><span class="status-badge status-${campaign.status.toLowerCase()}">${this.formatStatus(campaign.status)}</span></td>
                <td>${this.formatCurrency(campaign.budget)}/dia</td>
                <td>
                    <span class="metric-value">${this.formatCurrency(campaign.spend)}</span>
                    ${this.renderTrendIndicator(campaign.spendTrend)}
                </td>
                <td>
                    <span class="metric-value">${this.formatNumber(campaign.impressions)}</span>
                    ${this.renderTrendIndicator(campaign.impressionsTrend)}
                </td>
                <td>
                    <span class="metric-value">${this.formatNumber(campaign.clicks)}</span>
                    ${this.renderTrendIndicator(campaign.clicksTrend)}
                </td>
                <td>
                    <span class="metric-value">${campaign.ctr.toFixed(2)}%</span>
                    ${this.renderTrendIndicator(campaign.ctrTrend)}
                </td>
                <td>
                    <span class="metric-value">${this.formatCurrency(campaign.cpc)}</span>
                    ${this.renderTrendIndicator(campaign.cpcTrend, true)}
                </td>
                <td>
                    <span class="metric-value">${this.formatNumber(campaign.conversions)}</span>
                    ${this.renderTrendIndicator(campaign.conversionsTrend)}
                </td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-info" onclick="campaignsManager.showInsights('${campaign.id}')">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="campaignsManager.showEditModal('${campaign.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="campaignsManager.showDeleteModal('${campaign.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    async showCreateModal() {
        try {
            // Limpar formulário
            document.querySelector('#create-campaign-form').reset();
            
            // Carregar contas disponíveis
            const accounts = await this.api.getAdAccounts();
            this.populateAccountsSelect('#campaign-account', accounts);
            
            // Definir data mínima como hoje
            document.querySelector('#campaign-start-date').min = moment().format('YYYY-MM-DD');
            
            this.createModal.show();
        } catch (error) {
            this.showError('Erro ao preparar formulário', error.message);
        }
    }

    async showEditModal(campaignId) {
        try {
            this.showLoading();
            
            const campaign = await this.api.getCampaignDetails(campaignId);
            
            // Preencher formulário
            document.querySelector('#edit-campaign-id').value = campaignId;
            document.querySelector('#edit-name').value = campaign.name;
            document.querySelector('#edit-objective').value = campaign.objective;
            document.querySelector('#edit-budget').value = campaign.budget;
            document.querySelector('#edit-start-date').value = campaign.startDate;
            document.querySelector('#edit-end-date').value = campaign.endDate || '';
            document.querySelector('#edit-status').value = campaign.status;
            
            this.hideLoading();
            this.editModal.show();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar dados da campanha', error.message);
        }
    }

    async showInsights(campaignId) {
        try {
            this.showLoading();
            
            const insights = await this.api.getCampaignInsights(campaignId);
            
            // Renderizar gráficos
            this.renderPerformanceChart(insights.performance);
            this.renderDemographicsChart(insights.demographics);
            this.renderTimelineChart(insights.timeline);
            
            this.hideLoading();
            this.insightsModal.show();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar insights', error.message);
        }
    }

    async handleCreateSubmit(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            
            const formData = new FormData(event.target);
            const data = {
                name: formData.get('name'),
                objective: formData.get('objective'),
                budget: formData.get('budget'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate') || null,
                status: formData.get('status')
            };
            
            await this.api.createCampaign(data);
            
            this.createModal.hide();
            this.showSuccess('Campanha criada com sucesso');
            this.loadCampaigns();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao criar campanha', error.message);
        }
    }

    async handleEditSubmit(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            
            const formData = new FormData(event.target);
            const data = {
                id: formData.get('id'),
                name: formData.get('name'),
                objective: formData.get('objective'),
                budget: formData.get('budget'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate') || null,
                status: formData.get('status')
            };
            
            await this.api.updateCampaign(data);
            
            this.editModal.hide();
            this.showSuccess('Campanha atualizada com sucesso');
            this.loadCampaigns();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao atualizar campanha', error.message);
        }
    }

    async handleDeleteSubmit(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            
            const campaignId = document.querySelector('#delete-campaign-id').value;
            await this.api.deleteCampaign(campaignId);
            
            this.deleteModal.hide();
            this.showSuccess('Campanha excluída com sucesso');
            this.loadCampaigns();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao excluir campanha', error.message);
        }
    }

    handleSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.currentFilters.searchTerm = this.searchInput.value;
            this.loadCampaigns();
        }, 300);
    }

    handleFiltersChange() {
        this.currentFilters = {
            ...this.currentFilters,
            account: this.accountFilter.value,
            status: this.statusFilter.value
        };
        this.loadCampaigns();
    }

    async exportToCSV() {
        try {
            this.showLoading();
            
            const response = await this.api.getCampaignsForExport(this.currentFilters);
            const csv = this.convertToCSV(response);
            
            // Criar e baixar arquivo CSV
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `campanhas-${moment().format('YYYY-MM-DD')}.csv`;
            link.click();
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao exportar dados', error.message);
        }
    }

    // Gráficos
    renderPerformanceChart(data) {
        const ctx = document.querySelector('#performance-chart').getContext('2d');
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }
        
        this.performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'CTR',
                        data: data.ctr,
                        backgroundColor: 'rgba(33, 150, 243, 0.5)',
                        borderColor: '#2196f3',
                        borderWidth: 1
                    },
                    {
                        label: 'Conversões',
                        data: data.conversions,
                        backgroundColor: 'rgba(76, 175, 80, 0.5)',
                        borderColor: '#4caf50',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderDemographicsChart(data) {
        const ctx = document.querySelector('#demographics-chart').getContext('2d');
        if (this.demographicsChart) {
            this.demographicsChart.destroy();
        }
        
        this.demographicsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#2196f3',
                        '#4caf50',
                        '#ff9800',
                        '#f44336',
                        '#9c27b0'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    renderTimelineChart(data) {
        const ctx = document.querySelector('#timeline-chart').getContext('2d');
        if (this.timelineChart) {
            this.timelineChart.destroy();
        }
        
        this.timelineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Impressões',
                        data: data.impressions,
                        borderColor: '#2196f3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        fill: true
                    },
                    {
                        label: 'Cliques',
                        data: data.clicks,
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Utilitários
    getObjectiveIcon(objective) {
        const icons = {
            awareness: 'fa-eye',
            traffic: 'fa-exchange-alt',
            engagement: 'fa-comments',
            conversions: 'fa-shopping-cart'
        };
        return icons[objective] || 'fa-bullseye';
    }

    formatStatus(status) {
        const labels = {
            active: 'Ativa',
            paused: 'Pausada',
            deleted: 'Excluída'
        };
        return labels[status.toLowerCase()] || status;
    }

    renderTrendIndicator(trend, inverse = false) {
        if (!trend) return '';
        
        const isPositive = inverse ? trend < 0 : trend > 0;
        const icon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
        const className = isPositive ? 'trend-up' : 'trend-down';
        
        return `<i class="fas ${icon} trend-indicator ${className}"></i>`;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('pt-BR').format(value);
    }

    convertToCSV(data) {
        const headers = [
            'ID',
            'Nome',
            'Objetivo',
            'Status',
            'Orçamento',
            'Gasto',
            'Impressões',
            'Cliques',
            'CTR',
            'CPC',
            'Conversões',
            'Data de Início',
            'Data de Término'
        ];

        const rows = data.map(campaign => [
            campaign.id,
            campaign.name,
            this.formatStatus(campaign.objective),
            this.formatStatus(campaign.status),
            campaign.budget,
            campaign.spend,
            campaign.impressions,
            campaign.clicks,
            `${campaign.ctr}%`,
            campaign.cpc,
            campaign.conversions,
            campaign.startDate,
            campaign.endDate || ''
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    updateMetrics(metrics) {
        this.totalCampaignsElement.textContent = this.formatNumber(metrics.total);
        this.activeCampaignsElement.textContent = this.formatNumber(metrics.active);
        this.pausedCampaignsElement.textContent = this.formatNumber(metrics.paused);
        this.totalSpendElement.textContent = this.formatCurrency(metrics.totalSpend);
    }

    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    showSuccess(message) {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: message,
            timer: 3000,
            showConfirmButton: false
        });
    }

    showError(title, message) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message
        });
    }
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.campaignsManager = new CampaignsManager();
}); 