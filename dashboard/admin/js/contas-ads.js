// Classes e funções para gerenciamento de contas de anúncio
import { FacebookAPI } from './bm-facebook-api.js';

class AdAccountsManager {
    constructor() {
        this.api = new FacebookAPI();
        this.accounts = [];
        this.selectedAccountId = null;
        this.initializeEventListeners();
        this.loadAccounts();
    }

    initializeEventListeners() {
        // Filtros
        document.getElementById('status-filter').addEventListener('change', () => this.filterAccounts());
        document.getElementById('spend-filter').addEventListener('change', () => this.filterAccounts());
        document.getElementById('search-input').addEventListener('input', () => this.filterAccounts());

        // Botões de ação
        document.getElementById('add-account').addEventListener('click', () => this.showEditModal());
        document.getElementById('export-accounts').addEventListener('click', () => this.exportAccounts());

        // Modais
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        document.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Form de edição
        document.getElementById('edit-account-form').addEventListener('submit', (e) => this.handleAccountSubmit(e));

        // Botão de confirmação de exclusão
        document.getElementById('confirm-delete').addEventListener('click', () => this.deleteAccount());
    }

    async loadAccounts() {
        try {
            this.showLoading();
            const accounts = await this.api.getAdAccounts();
            this.accounts = accounts;
            this.updateAccountsTable();
            this.updateStatistics();
            this.hideLoading();
        } catch (error) {
            this.showAlert('Erro ao carregar contas: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    updateAccountsTable() {
        const tbody = document.getElementById('accounts-table-body');
        tbody.innerHTML = '';

        this.accounts.forEach(account => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${account.id}</td>
                <td>${account.name}</td>
                <td><span class="badge badge-${account.status}">${this.formatStatus(account.status)}</span></td>
                <td>R$ ${this.formatNumber(account.totalSpend)}</td>
                <td>R$ ${this.formatNumber(account.spendLimit)}</td>
                <td>${this.formatDate(account.lastUpdate)}</td>
                <td class="actions">
                    <button class="btn-icon" onclick="accountManager.showDetailsModal('${account.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="accountManager.showEditModal('${account.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="accountManager.showDeleteModal('${account.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateStatistics() {
        const stats = {
            total: this.accounts.length,
            active: this.accounts.filter(a => a.status === 'active').length,
            pending: this.accounts.filter(a => a.status === 'pending').length,
            blocked: this.accounts.filter(a => a.status === 'blocked').length
        };

        document.getElementById('total-accounts').textContent = stats.total;
        document.getElementById('active-accounts').textContent = stats.active;
        document.getElementById('pending-accounts').textContent = stats.pending;
        document.getElementById('blocked-accounts').textContent = stats.blocked;
    }

    filterAccounts() {
        const statusFilter = document.getElementById('status-filter').value;
        const spendFilter = document.getElementById('spend-filter').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();

        const filtered = this.accounts.filter(account => {
            const matchesStatus = !statusFilter || account.status === statusFilter;
            const matchesSearch = !searchTerm || 
                account.name.toLowerCase().includes(searchTerm) || 
                account.id.toLowerCase().includes(searchTerm);
            
            let matchesSpend = true;
            if (spendFilter) {
                const spend = account.totalSpend;
                switch (spendFilter) {
                    case 'low':
                        matchesSpend = spend < 1000;
                        break;
                    case 'medium':
                        matchesSpend = spend >= 1000 && spend <= 5000;
                        break;
                    case 'high':
                        matchesSpend = spend > 5000;
                        break;
                }
            }

            return matchesStatus && matchesSearch && matchesSpend;
        });

        this.updateAccountsTable(filtered);
    }

    async showDetailsModal(accountId) {
        try {
            this.showLoading();
            const account = await this.api.getAdAccountDetails(accountId);
            const metrics = await this.api.getAdAccountMetrics(accountId);
            const users = await this.api.getAdAccountUsers(accountId);

            // Preenche as informações básicas
            document.getElementById('detail-account-id').textContent = account.id;
            document.getElementById('detail-name').textContent = account.name;
            document.getElementById('detail-status').textContent = this.formatStatus(account.status);
            document.getElementById('detail-created-date').textContent = this.formatDate(account.createdAt);

            // Preenche as métricas
            document.getElementById('detail-total-spend').textContent = `R$ ${this.formatNumber(metrics.totalSpend)}`;
            document.getElementById('detail-spend-limit').textContent = `R$ ${this.formatNumber(metrics.spendLimit)}`;
            document.getElementById('detail-active-campaigns').textContent = metrics.activeCampaigns;
            document.getElementById('detail-avg-performance').textContent = `${metrics.avgPerformance}%`;

            // Preenche a lista de usuários
            const usersList = document.getElementById('detail-users-list');
            usersList.innerHTML = users.map(user => `
                <div class="user-item">
                    <span class="user-name">${user.name}</span>
                    <span class="user-role">${user.role}</span>
                </div>
            `).join('');

            this.showModal('account-details-modal');
            this.hideLoading();
        } catch (error) {
            this.showAlert('Erro ao carregar detalhes da conta: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    async showEditModal(accountId = null) {
        const form = document.getElementById('edit-account-form');
        if (accountId) {
            try {
                this.showLoading();
                const account = await this.api.getAdAccountDetails(accountId);
                form.querySelector('#edit-name').value = account.name;
                form.querySelector('#edit-status').value = account.status;
                form.querySelector('#edit-spend-limit').value = account.spendLimit;
                this.selectedAccountId = accountId;
                this.hideLoading();
            } catch (error) {
                this.showAlert('Erro ao carregar dados da conta: ' + error.message, 'error');
                this.hideLoading();
                return;
            }
        } else {
            form.reset();
            this.selectedAccountId = null;
        }
        this.showModal('edit-account-modal');
    }

    showDeleteModal(accountId) {
        this.selectedAccountId = accountId;
        this.showModal('delete-confirm-modal');
    }

    async handleAccountSubmit(event) {
        event.preventDefault();
        const formData = {
            name: document.getElementById('edit-name').value,
            status: document.getElementById('edit-status').value,
            spendLimit: parseFloat(document.getElementById('edit-spend-limit').value)
        };

        try {
            this.showLoading();
            if (this.selectedAccountId) {
                await this.api.updateAdAccount(this.selectedAccountId, formData);
                this.showAlert('Conta atualizada com sucesso!', 'success');
            } else {
                await this.api.createAdAccount(formData);
                this.showAlert('Conta criada com sucesso!', 'success');
            }
            await this.loadAccounts();
            this.closeModal(document.getElementById('edit-account-modal'));
            this.hideLoading();
        } catch (error) {
            this.showAlert('Erro ao salvar conta: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    async deleteAccount() {
        if (!this.selectedAccountId) return;

        try {
            this.showLoading();
            await this.api.deleteAdAccount(this.selectedAccountId);
            this.showAlert('Conta excluída com sucesso!', 'success');
            await this.loadAccounts();
            this.closeModal(document.getElementById('delete-confirm-modal'));
            this.hideLoading();
        } catch (error) {
            this.showAlert('Erro ao excluir conta: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    exportAccounts() {
        const headers = ['ID', 'Nome', 'Status', 'Gasto Total', 'Limite', 'Última Atualização'];
        const csvContent = [
            headers.join(','),
            ...this.accounts.map(account => [
                account.id,
                account.name,
                this.formatStatus(account.status),
                account.totalSpend,
                account.spendLimit,
                this.formatDate(account.lastUpdate)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `contas-ads-${this.formatDate(new Date())}.csv`;
        link.click();
    }

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

    formatStatus(status) {
        const statusMap = {
            active: 'Ativa',
            pending: 'Pendente',
            blocked: 'Bloqueada'
        };
        return statusMap[status] || status;
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

    formatNumber(number) {
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// Inicializa o gerenciador de contas
const accountManager = new AdAccountsManager();
window.accountManager = accountManager; // Expõe para uso global 