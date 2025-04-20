class AdSetsManager {
    constructor() {
        // Configurações iniciais
        this.api = new FacebookAPI();
        this.currentFilters = {
            status: 'all',
            campaign: 'all',
            dateRange: 'last30days'
        };
        this.chart = null;
        this.debounceTimer = null;

        // Inicializar elementos
        this.initializeElements();
        // Configurar event listeners
        this.setupEventListeners();
        // Carregar dados iniciais
        this.loadAdSets();
        // Inicializar gráfico
        this.initializeChart();
    }

    initializeElements() {
        // Elementos da tabela
        this.tableBody = document.querySelector('#adsets-table tbody');
        this.loadingOverlay = document.querySelector('#loading-overlay');
        
        // Elementos de filtro
        this.statusFilter = document.querySelector('#status-filter');
        this.campaignFilter = document.querySelector('#campaign-filter');
        this.dateRangeFilter = document.querySelector('#date-range-filter');
        this.searchInput = document.querySelector('#search-input');
        
        // Elementos dos modais
        this.detailsModal = new bootstrap.Modal(document.querySelector('#details-modal'));
        this.editModal = new bootstrap.Modal(document.querySelector('#edit-modal'));
        this.deleteModal = new bootstrap.Modal(document.querySelector('#delete-modal'));
        
        // Elementos de métricas
        this.totalAdSetsElement = document.querySelector('#total-adsets');
        this.activeAdSetsElement = document.querySelector('#active-adsets');
        this.pausedAdSetsElement = document.querySelector('#paused-adsets');
        this.deletedAdSetsElement = document.querySelector('#deleted-adsets');
    }

    setupEventListeners() {
        // Event listeners para filtros
        this.statusFilter.addEventListener('change', () => this.handleFiltersChange());
        this.campaignFilter.addEventListener('change', () => this.handleFiltersChange());
        this.dateRangeFilter.addEventListener('change', () => this.handleFiltersChange());
        this.searchInput.addEventListener('input', () => this.handleSearch());

        // Event listeners para ações
        document.querySelector('#create-adset-btn').addEventListener('click', () => this.showCreateModal());
        document.querySelector('#export-csv-btn').addEventListener('click', () => this.exportToCSV());

        // Event listeners para formulários
        document.querySelector('#edit-form').addEventListener('submit', (e) => this.handleEditSubmit(e));
        document.querySelector('#delete-form').addEventListener('submit', (e) => this.handleDeleteSubmit(e));

        // Inicializar Select2 para campos de seleção múltipla
        $('.select2-multiple').select2({
            theme: 'bootstrap4',
            placeholder: 'Selecione as opções',
            allowClear: true
        });
    }

    async loadAdSets() {
        try {
            this.showLoading();
            
            // Obter dados da API
            const response = await this.api.getAdSets(this.currentFilters);
            
            // Atualizar métricas
            this.updateMetrics(response.metrics);
            
            // Renderizar tabela
            this.renderTable(response.adSets);
            
            // Atualizar gráfico
            this.updateChart(response.performance);
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar conjuntos de anúncios', error.message);
        }
    }

    renderTable(adSets) {
        this.tableBody.innerHTML = '';
        
        adSets.forEach(adSet => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${adSet.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${adSet.campaignImage}" alt="" class="rounded-circle" width="32" height="32">
                        <div class="ms-3">
                            <h6 class="mb-0">${adSet.name}</h6>
                            <small class="text-muted">${adSet.campaignName}</small>
                        </div>
                    </div>
                </td>
                <td><span class="status-badge status-${adSet.status.toLowerCase()}">${adSet.status}</span></td>
                <td>
                    <div class="performance-indicator">
                        <span>${this.formatCurrency(adSet.spend)}</span>
                        <div class="performance-trend ${adSet.trend > 0 ? 'trend-up' : 'trend-down'}">
                            <i class="fas fa-${adSet.trend > 0 ? 'arrow-up' : 'arrow-down'}"></i>
                            <span>${Math.abs(adSet.trend)}%</span>
                        </div>
                    </div>
                </td>
                <td>${this.formatNumber(adSet.impressions)}</td>
                <td>${this.formatNumber(adSet.clicks)}</td>
                <td>${adSet.ctr}%</td>
                <td>${this.formatCurrency(adSet.cpc)}</td>
                <td>${this.formatDate(adSet.lastUpdate)}</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="adSetsManager.showDetails('${adSet.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="adSetsManager.showEditModal('${adSet.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="adSetsManager.showDeleteModal('${adSet.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    async showDetails(adSetId) {
        try {
            this.showLoading();
            const details = await this.api.getAdSetDetails(adSetId);
            
            // Preencher informações básicas
            document.querySelector('#details-name').textContent = details.name;
            document.querySelector('#details-campaign').textContent = details.campaignName;
            document.querySelector('#details-status').className = `status-badge status-${details.status.toLowerCase()}`;
            document.querySelector('#details-status').textContent = details.status;
            
            // Preencher métricas
            document.querySelector('#details-spend').textContent = this.formatCurrency(details.spend);
            document.querySelector('#details-impressions').textContent = this.formatNumber(details.impressions);
            document.querySelector('#details-clicks').textContent = this.formatNumber(details.clicks);
            document.querySelector('#details-ctr').textContent = `${details.ctr}%`;
            document.querySelector('#details-cpc').textContent = this.formatCurrency(details.cpc);
            
            // Renderizar cards de segmentação
            this.renderTargetingCards(details.targeting);
            
            // Atualizar gráfico de performance
            this.updatePerformanceChart(details.performance);
            
            this.hideLoading();
            this.detailsModal.show();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar detalhes', error.message);
        }
    }

    renderTargetingCards(targeting) {
        const container = document.querySelector('#targeting-container');
        container.innerHTML = '';

        // Card de Demografia
        const demographicsCard = this.createTargetingCard('Demografia', [
            `Idade: ${targeting.ageRange.min} - ${targeting.ageRange.max}`,
            `Gênero: ${targeting.gender}`,
            `Localização: ${targeting.locations.join(', ')}`
        ]);
        
        // Card de Interesses
        const interestsCard = this.createTargetingCard('Interesses', 
            targeting.interests.map(interest => interest.name)
        );
        
        // Card de Comportamentos
        const behaviorsCard = this.createTargetingCard('Comportamentos',
            targeting.behaviors.map(behavior => behavior.name)
        );

        container.append(demographicsCard, interestsCard, behaviorsCard);
    }

    createTargetingCard(title, items) {
        const card = document.createElement('div');
        card.className = 'targeting-card';
        
        const cardContent = `
            <h4>${title}</h4>
            <div class="tags-container">
                ${items.map(item => `
                    <span class="tag">
                        <i class="fas fa-tag"></i>
                        ${item}
                    </span>
                `).join('')}
            </div>
        `;
        
        card.innerHTML = cardContent;
        return card;
    }

    async showEditModal(adSetId) {
        try {
            this.showLoading();
            const adSet = await this.api.getAdSetDetails(adSetId);
            
            // Preencher formulário
            document.querySelector('#edit-form-id').value = adSetId;
            document.querySelector('#edit-form-name').value = adSet.name;
            document.querySelector('#edit-form-status').value = adSet.status;
            document.querySelector('#edit-form-budget').value = adSet.budget;
            
            // Preencher campos de segmentação
            document.querySelector('#edit-form-age-min').value = adSet.targeting.ageRange.min;
            document.querySelector('#edit-form-age-max').value = adSet.targeting.ageRange.max;
            document.querySelector('#edit-form-gender').value = adSet.targeting.gender;
            
            // Atualizar campos Select2
            $('#edit-form-locations').val(adSet.targeting.locations).trigger('change');
            $('#edit-form-interests').val(adSet.targeting.interests.map(i => i.id)).trigger('change');
            $('#edit-form-behaviors').val(adSet.targeting.behaviors.map(b => b.id)).trigger('change');
            
            this.hideLoading();
            this.editModal.show();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar dados para edição', error.message);
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
                status: formData.get('status'),
                budget: formData.get('budget'),
                targeting: {
                    ageRange: {
                        min: parseInt(formData.get('age_min')),
                        max: parseInt(formData.get('age_max'))
                    },
                    gender: formData.get('gender'),
                    locations: $('#edit-form-locations').val(),
                    interests: $('#edit-form-interests').val(),
                    behaviors: $('#edit-form-behaviors').val()
                }
            };
            
            await this.api.updateAdSet(data);
            
            this.editModal.hide();
            this.showSuccess('Conjunto de anúncios atualizado com sucesso');
            this.loadAdSets();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao atualizar conjunto de anúncios', error.message);
        }
    }

    showDeleteModal(adSetId) {
        document.querySelector('#delete-form-id').value = adSetId;
        this.deleteModal.show();
    }

    async handleDeleteSubmit(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            
            const adSetId = document.querySelector('#delete-form-id').value;
            await this.api.deleteAdSet(adSetId);
            
            this.deleteModal.hide();
            this.showSuccess('Conjunto de anúncios excluído com sucesso');
            this.loadAdSets();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao excluir conjunto de anúncios', error.message);
        }
    }

    handleSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.loadAdSets();
        }, 300);
    }

    handleFiltersChange() {
        this.currentFilters = {
            status: this.statusFilter.value,
            campaign: this.campaignFilter.value,
            dateRange: this.dateRangeFilter.value
        };
        this.loadAdSets();
    }

    initializeChart() {
        const ctx = document.querySelector('#performance-chart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Gastos',
                    borderColor: '#1877f2',
                    backgroundColor: 'rgba(24, 119, 242, 0.1)',
                    data: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => this.formatCurrency(value)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => this.formatCurrency(context.raw)
                        }
                    }
                }
            }
        });
    }

    updateChart(performanceData) {
        this.chart.data.labels = performanceData.dates;
        this.chart.data.datasets[0].data = performanceData.spend;
        this.chart.update();
    }

    updateMetrics(metrics) {
        this.totalAdSetsElement.textContent = this.formatNumber(metrics.total);
        this.activeAdSetsElement.textContent = this.formatNumber(metrics.active);
        this.pausedAdSetsElement.textContent = this.formatNumber(metrics.paused);
        this.deletedAdSetsElement.textContent = this.formatNumber(metrics.deleted);
    }

    async exportToCSV() {
        try {
            this.showLoading();
            
            const response = await this.api.getAdSetsForExport(this.currentFilters);
            const csv = this.convertToCSV(response);
            
            // Criar e baixar arquivo CSV
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `conjuntos-anuncios-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao exportar dados', error.message);
        }
    }

    convertToCSV(data) {
        const headers = [
            'ID',
            'Nome',
            'Campanha',
            'Status',
            'Gasto',
            'Impressões',
            'Cliques',
            'CTR',
            'CPC',
            'Última Atualização'
        ];

        const rows = data.map(item => [
            item.id,
            item.name,
            item.campaignName,
            item.status,
            item.spend,
            item.impressions,
            item.clicks,
            `${item.ctr}%`,
            item.cpc,
            this.formatDate(item.lastUpdate)
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    // Utilitários
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('pt-BR').format(value);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
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

// Inicializar gerenciador quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.adSetsManager = new AdSetsManager();
}); 
document.addEventListener('DOMContentLoaded', () => adSetsManager.loadAdSets()); 