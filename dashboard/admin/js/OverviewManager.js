class OverviewManager {
    constructor() {
        this.api = new FacebookAPI();
        this.charts = {};
        this.updateInterval = 300000; // 5 minutos
        
        // Inicialização
        this.initializeElements();
        this.setupEventListeners();
        this.initializeCharts();
        this.startAutoUpdate();
    }

    initializeElements() {
        // Elementos de métricas
        this.metricsElements = {
            totalSpend: document.querySelector('#total-spend'),
            roi: document.querySelector('#roi'),
            ctr: document.querySelector('#ctr'),
            conversions: document.querySelector('#conversions'),
            cpc: document.querySelector('#cpc')
        };

        // Elementos de alertas e atividades
        this.alertsContainer = document.querySelector('#alerts-container');
        this.activitiesContainer = document.querySelector('#activities-container');
        
        // Elementos de filtros
        this.dateRangeFilter = document.querySelector('#date-range-filter');
        this.accountFilter = document.querySelector('#account-filter');
    }

    setupEventListeners() {
        // Listeners para filtros
        this.dateRangeFilter.addEventListener('change', () => this.updateDashboard());
        this.accountFilter.addEventListener('change', () => this.updateDashboard());

        // Listeners para ações de alerta
        document.querySelector('#configure-alerts').addEventListener('click', () => this.showAlertsConfig());
        
        // Listeners para exportação
        document.querySelector('#export-data').addEventListener('click', () => this.exportDashboardData());
    }

    initializeCharts() {
        // Gráfico de Gastos
        this.charts.spend = new Chart(
            document.querySelector('#spend-chart').getContext('2d'),
            this.getSpendChartConfig()
        );

        // Gráfico de Performance
        this.charts.performance = new Chart(
            document.querySelector('#performance-chart').getContext('2d'),
            this.getPerformanceChartConfig()
        );

        // Gráfico de Distribuição
        this.charts.distribution = new Chart(
            document.querySelector('#distribution-chart').getContext('2d'),
            this.getDistributionChartConfig()
        );
    }

    async updateDashboard() {
        try {
            this.showLoading();

            // Obter dados atualizados
            const data = await this.api.getDashboardData({
                dateRange: this.dateRangeFilter.value,
                accountId: this.accountFilter.value
            });

            // Atualizar métricas
            this.updateMetrics(data.metrics);
            
            // Atualizar gráficos
            this.updateCharts(data.charts);
            
            // Atualizar alertas
            this.updateAlerts(data.alerts);
            
            // Atualizar atividades
            this.updateActivities(data.activities);

            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao atualizar dashboard', error.message);
        }
    }

    updateMetrics(metrics) {
        // Atualizar valores com animação
        Object.entries(metrics).forEach(([key, value]) => {
            if (this.metricsElements[key]) {
                this.animateMetricValue(this.metricsElements[key], value);
            }
        });
    }

    updateCharts(data) {
        // Atualizar dados dos gráficos
        Object.entries(this.charts).forEach(([key, chart]) => {
            if (data[key]) {
                chart.data = data[key];
                chart.update();
            }
        });
    }

    updateAlerts(alerts) {
        this.alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert alert-${alert.type} alert-dismissible fade show">
                <div class="d-flex align-items-center">
                    <i class="fas fa-${this.getAlertIcon(alert.type)} me-2"></i>
                    <div>
                        <h6 class="alert-heading mb-1">${alert.title}</h6>
                        <p class="mb-0">${alert.message}</p>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `).join('');
    }

    updateActivities(activities) {
        this.activitiesContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon bg-${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h6 class="mb-1">${activity.title}</h6>
                    <p class="mb-0 text-muted">${activity.description}</p>
                    <small class="text-muted">${this.formatDate(activity.timestamp)}</small>
                </div>
            </div>
        `).join('');
    }

    showAlertsConfig() {
        // Implementar modal de configuração de alertas
        const modal = new bootstrap.Modal(document.querySelector('#alerts-config-modal'));
        modal.show();
    }

    async exportDashboardData() {
        try {
            this.showLoading();
            
            const data = await this.api.getDashboardExportData({
                dateRange: this.dateRangeFilter.value,
                accountId: this.accountFilter.value
            });

            // Gerar arquivo Excel
            const workbook = new ExcelJS.Workbook();
            
            // Adicionar planilhas
            this.addMetricsSheet(workbook, data.metrics);
            this.addChartsSheet(workbook, data.charts);
            this.addAlertsSheet(workbook, data.alerts);
            this.addActivitiesSheet(workbook, data.activities);

            // Baixar arquivo
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();

            this.hideLoading();
            this.showSuccess('Dados exportados com sucesso');
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao exportar dados', error.message);
        }
    }

    startAutoUpdate() {
        setInterval(() => this.updateDashboard(), this.updateInterval);
    }

    // Configurações de Gráficos
    getSpendChartConfig() {
        return {
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
        };
    }

    getPerformanceChartConfig() {
        return {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'CTR',
                        borderColor: '#42ba96',
                        backgroundColor: 'rgba(66, 186, 150, 0.1)',
                        data: []
                    },
                    {
                        label: 'Conversões',
                        borderColor: '#7952b3',
                        backgroundColor: 'rgba(121, 82, 179, 0.1)',
                        data: []
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => `${value}%`
                        }
                    }
                }
            }
        };
    }

    getDistributionChartConfig() {
        return {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#1877f2',
                        '#42ba96',
                        '#7952b3',
                        '#dc3545',
                        '#ffc107'
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
        };
    }

    // Utilitários
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
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

    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            danger: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'bell';
    }

    getActivityIcon(type) {
        const icons = {
            campaign: 'bullhorn',
            account: 'user-circle',
            payment: 'credit-card',
            system: 'cog',
            alert: 'bell'
        };
        return icons[type] || 'circle';
    }

    animateMetricValue(element, newValue) {
        const startValue = parseFloat(element.textContent.replace(/[^0-9.-]+/g, ''));
        const duration = 1000;
        const steps = 60;
        const increment = (newValue - startValue) / steps;
        let currentStep = 0;

        const animation = setInterval(() => {
            currentStep++;
            const currentValue = startValue + (increment * currentStep);
            element.textContent = this.formatMetricValue(currentValue);

            if (currentStep >= steps) {
                clearInterval(animation);
                element.textContent = this.formatMetricValue(newValue);
            }
        }, duration / steps);
    }

    formatMetricValue(value) {
        if (this.metricsElements.totalSpend.contains(value)) {
            return this.formatCurrency(value);
        } else if (this.metricsElements.roi.contains(value) || 
                   this.metricsElements.ctr.contains(value)) {
            return `${value.toFixed(2)}%`;
        } else {
            return this.formatNumber(value);
        }
    }

    formatNumber(value) {
        return new Intl.NumberFormat('pt-BR').format(value);
    }

    showLoading() {
        document.querySelector('#loading-overlay').style.display = 'flex';
    }

    hideLoading() {
        document.querySelector('#loading-overlay').style.display = 'none';
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
    window.overviewManager = new OverviewManager();
}); 