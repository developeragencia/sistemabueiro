class UsersManager {
    constructor() {
        this.api = new FacebookAPI();
        this.currentFilters = {
            role: 'all',
            status: 'all',
            searchTerm: ''
        };
        
        // Inicialização
        this.initializeElements();
        this.setupEventListeners();
        this.loadUsers();
    }

    initializeElements() {
        // Elementos da tabela
        this.tableBody = document.querySelector('#users-table tbody');
        this.loadingOverlay = document.querySelector('#loading-overlay');
        
        // Elementos de filtro
        this.roleFilter = document.querySelector('#role-filter');
        this.statusFilter = document.querySelector('#status-filter');
        this.searchInput = document.querySelector('#search-input');
        
        // Elementos dos modais
        this.createModal = new bootstrap.Modal(document.querySelector('#create-user-modal'));
        this.editModal = new bootstrap.Modal(document.querySelector('#edit-user-modal'));
        this.deleteModal = new bootstrap.Modal(document.querySelector('#delete-user-modal'));
        this.permissionsModal = new bootstrap.Modal(document.querySelector('#permissions-modal'));
        
        // Elementos de métricas
        this.totalUsersElement = document.querySelector('#total-users');
        this.activeUsersElement = document.querySelector('#active-users');
        this.pendingUsersElement = document.querySelector('#pending-users');
        this.blockedUsersElement = document.querySelector('#blocked-users');
    }

    setupEventListeners() {
        // Event listeners para filtros
        this.roleFilter.addEventListener('change', () => this.handleFiltersChange());
        this.statusFilter.addEventListener('change', () => this.handleFiltersChange());
        this.searchInput.addEventListener('input', () => this.handleSearch());

        // Event listeners para ações
        document.querySelector('#create-user-btn').addEventListener('click', () => this.showCreateModal());
        document.querySelector('#export-users-btn').addEventListener('click', () => this.exportToCSV());

        // Event listeners para formulários
        document.querySelector('#create-user-form').addEventListener('submit', (e) => this.handleCreateSubmit(e));
        document.querySelector('#edit-user-form').addEventListener('submit', (e) => this.handleEditSubmit(e));
        document.querySelector('#delete-user-form').addEventListener('submit', (e) => this.handleDeleteSubmit(e));
        document.querySelector('#permissions-form').addEventListener('submit', (e) => this.handlePermissionsSubmit(e));

        // Event listeners para upload de avatar
        document.querySelector('#avatar-input').addEventListener('change', (e) => this.handleAvatarUpload(e));
    }

    async loadUsers() {
        try {
            this.showLoading();
            
            const response = await this.api.getUsers(this.currentFilters);
            
            // Atualizar métricas
            this.updateMetrics(response.metrics);
            
            // Renderizar tabela
            this.renderTable(response.users);
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar usuários', error.message);
        }
    }

    renderTable(users) {
        this.tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${user.avatar || 'img/default-avatar.png'}" alt="" class="rounded-circle" width="32" height="32">
                        <div class="ms-3">
                            <h6 class="mb-0">${user.name}</h6>
                            <small class="text-muted">${user.email}</small>
                        </div>
                    </div>
                </td>
                <td><span class="role-badge role-${user.role.toLowerCase()}">${user.role}</span></td>
                <td><span class="status-badge status-${user.status.toLowerCase()}">${user.status}</span></td>
                <td>${this.formatDate(user.lastLogin)}</td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="usersManager.showPermissions('${user.id}')">
                            <i class="fas fa-key"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="usersManager.showEditModal('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="usersManager.showDeleteModal('${user.id}')">
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
            document.querySelector('#create-user-form').reset();
            
            // Carregar roles disponíveis
            const roles = await this.api.getRoles();
            this.populateRolesSelect('#create-role-select', roles);
            
            this.createModal.show();
        } catch (error) {
            this.showError('Erro ao preparar formulário', error.message);
        }
    }

    async showEditModal(userId) {
        try {
            this.showLoading();
            
            const user = await this.api.getUserDetails(userId);
            const roles = await this.api.getRoles();
            
            // Preencher formulário
            document.querySelector('#edit-user-id').value = userId;
            document.querySelector('#edit-name').value = user.name;
            document.querySelector('#edit-email').value = user.email;
            document.querySelector('#edit-role').value = user.role;
            document.querySelector('#edit-status').value = user.status;
            
            // Atualizar preview do avatar
            document.querySelector('#avatar-preview').src = user.avatar || 'img/default-avatar.png';
            
            // Preencher select de roles
            this.populateRolesSelect('#edit-role-select', roles);
            
            this.hideLoading();
            this.editModal.show();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar dados do usuário', error.message);
        }
    }

    async showPermissions(userId) {
        try {
            this.showLoading();
            
            const permissions = await this.api.getUserPermissions(userId);
            const availablePermissions = await this.api.getAvailablePermissions();
            
            // Preencher formulário de permissões
            document.querySelector('#permissions-user-id').value = userId;
            this.renderPermissionsForm(permissions, availablePermissions);
            
            this.hideLoading();
            this.permissionsModal.show();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao carregar permissões', error.message);
        }
    }

    renderPermissionsForm(userPermissions, availablePermissions) {
        const container = document.querySelector('#permissions-container');
        container.innerHTML = '';

        // Agrupar permissões por módulo
        const groupedPermissions = this.groupPermissionsByModule(availablePermissions);

        Object.entries(groupedPermissions).forEach(([module, permissions]) => {
            const moduleDiv = document.createElement('div');
            moduleDiv.className = 'permission-module mb-4';
            
            moduleDiv.innerHTML = `
                <h5 class="mb-3">${module}</h5>
                <div class="permissions-grid">
                    ${permissions.map(permission => `
                        <div class="permission-item">
                            <div class="form-check">
                                <input type="checkbox" 
                                       class="form-check-input" 
                                       id="perm-${permission.id}"
                                       name="permissions[]"
                                       value="${permission.id}"
                                       ${userPermissions.includes(permission.id) ? 'checked' : ''}>
                                <label class="form-check-label" for="perm-${permission.id}">
                                    ${permission.name}
                                    <small class="d-block text-muted">${permission.description}</small>
                                </label>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(moduleDiv);
        });
    }

    groupPermissionsByModule(permissions) {
        return permissions.reduce((groups, permission) => {
            if (!groups[permission.module]) {
                groups[permission.module] = [];
            }
            groups[permission.module].push(permission);
            return groups;
        }, {});
    }

    async handleCreateSubmit(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            
            const formData = new FormData(event.target);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role'),
                password: formData.get('password')
            };
            
            await this.api.createUser(data);
            
            this.createModal.hide();
            this.showSuccess('Usuário criado com sucesso');
            this.loadUsers();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao criar usuário', error.message);
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
                email: formData.get('email'),
                role: formData.get('role'),
                status: formData.get('status')
            };
            
            if (formData.get('password')) {
                data.password = formData.get('password');
            }
            
            await this.api.updateUser(data);
            
            this.editModal.hide();
            this.showSuccess('Usuário atualizado com sucesso');
            this.loadUsers();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao atualizar usuário', error.message);
        }
    }

    async handleDeleteSubmit(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            
            const userId = document.querySelector('#delete-user-id').value;
            await this.api.deleteUser(userId);
            
            this.deleteModal.hide();
            this.showSuccess('Usuário excluído com sucesso');
            this.loadUsers();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao excluir usuário', error.message);
        }
    }

    async handlePermissionsSubmit(event) {
        event.preventDefault();
        
        try {
            this.showLoading();
            
            const formData = new FormData(event.target);
            const data = {
                userId: formData.get('user_id'),
                permissions: formData.getAll('permissions[]')
            };
            
            await this.api.updateUserPermissions(data);
            
            this.permissionsModal.hide();
            this.showSuccess('Permissões atualizadas com sucesso');
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao atualizar permissões', error.message);
        }
    }

    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            this.showLoading();
            
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('userId', document.querySelector('#edit-user-id').value);
            
            const response = await this.api.uploadAvatar(formData);
            
            // Atualizar preview
            document.querySelector('#avatar-preview').src = response.avatarUrl;
            
            this.hideLoading();
            this.showSuccess('Avatar atualizado com sucesso');
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao atualizar avatar', error.message);
        }
    }

    handleSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.loadUsers();
        }, 300);
    }

    handleFiltersChange() {
        this.currentFilters = {
            role: this.roleFilter.value,
            status: this.statusFilter.value,
            searchTerm: this.searchInput.value
        };
        this.loadUsers();
    }

    async exportToCSV() {
        try {
            this.showLoading();
            
            const response = await this.api.getUsersForExport(this.currentFilters);
            const csv = this.convertToCSV(response);
            
            // Criar e baixar arquivo CSV
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `usuarios-${new Date().toISOString().split('T')[0]}.csv`;
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
            'Email',
            'Função',
            'Status',
            'Último Acesso',
            'Data de Criação'
        ];

        const rows = data.map(user => [
            user.id,
            user.name,
            user.email,
            user.role,
            user.status,
            this.formatDate(user.lastLogin),
            this.formatDate(user.createdAt)
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    populateRolesSelect(selectId, roles) {
        const select = document.querySelector(selectId);
        select.innerHTML = roles.map(role => `
            <option value="${role.id}">${role.name}</option>
        `).join('');
    }

    updateMetrics(metrics) {
        this.totalUsersElement.textContent = this.formatNumber(metrics.total);
        this.activeUsersElement.textContent = this.formatNumber(metrics.active);
        this.pendingUsersElement.textContent = this.formatNumber(metrics.pending);
        this.blockedUsersElement.textContent = this.formatNumber(metrics.blocked);
    }

    // Utilitários
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    formatNumber(value) {
        return new Intl.NumberFormat('pt-BR').format(value);
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
    window.usersManager = new UsersManager();
}); 