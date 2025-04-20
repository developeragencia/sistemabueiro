import { FacebookBusinessAPI, BMDataCache } from './bm-facebook-api.js';

// Estado global da aplicação
let bmData = [];
let currentFilters = {
    search: '',
    status: '',
    sortBy: 'name'
};

// Instâncias das classes
const fbApi = new FacebookBusinessAPI(process.env.FB_ACCESS_TOKEN);
const dataCache = new BMDataCache();

// Funções de inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadBMData();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('searchBM').addEventListener('input', debounce(applyFilters, 300));
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
}

// Funções de gerenciamento de dados
async function loadBMData() {
    try {
        showLoading();
        
        // Tentar carregar do cache primeiro
        const cachedData = dataCache.load();
        if (cachedData) {
            bmData = cachedData;
            updateDashboard();
            return;
        }

        // Se não houver cache, carregar da API
        const response = await fbApi.getBusinessManager('me');
        bmData = response.data;
        
        // Salvar no cache
        dataCache.save(bmData);
        
        updateDashboard();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showAlert(error.message || 'Erro ao carregar dados dos BMs', 'error');
    } finally {
        hideLoading();
    }
}

function updateDashboard() {
    updateStats();
    renderBMTable();
}

function updateStats() {
    const stats = {
        total: bmData.length,
        active: bmData.filter(bm => bm.status === 'active').length,
        pending: bmData.filter(bm => bm.status === 'pending').length,
        blocked: bmData.filter(bm => bm.status === 'blocked').length
    };

    document.getElementById('totalBMs').textContent = stats.total;
    document.getElementById('activeBMs').textContent = stats.active;
    document.getElementById('pendingBMs').textContent = stats.pending;
    document.getElementById('blockedBMs').textContent = stats.blocked;
}

// Funções de renderização da tabela
function renderBMTable() {
    const filteredData = filterBMData();
    const tbody = document.getElementById('bmTableBody');
    tbody.innerHTML = '';

    filteredData.forEach(bm => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${bm.id}</td>
            <td>${bm.name}</td>
            <td><span class="status-badge ${bm.status}">${getStatusLabel(bm.status)}</span></td>
            <td>${bm.accounts || 0}</td>
            <td>${formatDate(bm.lastAccess)}</td>
            <td class="actions">
                <button class="bm-btn bm-btn-small" onclick="editBM('${bm.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="bm-btn bm-btn-small bm-btn-danger" onclick="deleteBM('${bm.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterBMData() {
    let filtered = [...bmData];

    // Aplicar filtro de busca
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filtered = filtered.filter(bm => 
            bm.name.toLowerCase().includes(searchTerm) || 
            bm.id.toString().includes(searchTerm)
        );
    }

    // Aplicar filtro de status
    if (currentFilters.status) {
        filtered = filtered.filter(bm => bm.status === currentFilters.status);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
        switch (currentFilters.sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'id':
                return a.id - b.id;
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });

    return filtered;
}

// Funções do Modal
function openAddBMModal() {
    document.getElementById('modalTitle').textContent = 'Adicionar BM';
    document.getElementById('bmForm').reset();
    document.getElementById('bmModal').classList.add('show');
}

function editBM(bmId) {
    const bm = bmData.find(b => b.id === bmId);
    if (!bm) return;

    document.getElementById('modalTitle').textContent = 'Editar BM';
    document.getElementById('bmId').value = bm.id;
    document.getElementById('bmName').value = bm.name;
    document.getElementById('bmStatus').value = bm.status;
    document.getElementById('bmModal').classList.add('show');
}

function closeModal() {
    document.getElementById('bmModal').classList.remove('show');
}

async function saveBM() {
    const form = document.getElementById('bmForm');
    
    if (!form.checkValidity()) {
        showAlert('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    const formData = {
        id: document.getElementById('bmId').value,
        name: document.getElementById('bmName').value,
        status: document.getElementById('bmStatus').value,
        lastUpdate: new Date().toISOString()
    };

    try {
        showLoading();
        
        if (formData.id) {
            // Atualizar BM existente
            await fbApi.updateBusinessManager(formData.id, formData);
        } else {
            // Criar novo BM
            await fbApi.createBusinessManager(formData);
        }

        await loadBMData();
        closeModal();
        showAlert('BM salvo com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar:', error);
        showAlert(error.message || 'Erro ao salvar BM', 'error');
    } finally {
        hideLoading();
    }
}

async function deleteBM(bmId) {
    showConfirmDialog('Tem certeza que deseja excluir este BM?', async () => {
        try {
            showLoading();
            await fbApi.deleteBusinessManager(bmId);
            await loadBMData();
            showAlert('BM excluído com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir:', error);
            showAlert(error.message || 'Erro ao excluir BM', 'error');
        } finally {
            hideLoading();
        }
    });
}

// Funções utilitárias
function applyFilters() {
    currentFilters = {
        search: document.getElementById('searchBM').value,
        status: document.getElementById('statusFilter').value,
        sortBy: document.getElementById('sortBy').value
    };
    renderBMTable();
}

function getStatusLabel(status) {
    const labels = {
        active: 'Ativo',
        pending: 'Pendente',
        blocked: 'Bloqueado'
    };
    return labels[status] || status;
}

function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleString('pt-BR');
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `bm-alert ${type}`;
    alert.textContent = message;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading-spinner';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading-spinner');
    if (loading) loading.remove();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para exportar dados
async function exportToCSV() {
    try {
        showLoading();
        const filteredData = filterBMData();
        
        // Buscar dados adicionais para cada BM
        const enrichedData = await Promise.all(filteredData.map(async (bm) => {
            try {
                const [accounts, users] = await Promise.all([
                    fbApi.getBusinessAccounts(bm.id),
                    fbApi.getBusinessUsers(bm.id)
                ]);
                
                return {
                    ...bm,
                    totalAccounts: accounts.data.length,
                    totalUsers: users.data.length
                };
            } catch (error) {
                console.warn(`Erro ao buscar dados adicionais para BM ${bm.id}:`, error);
                return bm;
            }
        }));

        const headers = [
            'ID',
            'Nome',
            'Status',
            'Total de Contas',
            'Total de Usuários',
            'Último Acesso',
            'Última Atualização'
        ];
        
        const csvContent = [
            headers.join(','),
            ...enrichedData.map(bm => [
                bm.id,
                `"${bm.name}"`,
                getStatusLabel(bm.status),
                bm.totalAccounts || 0,
                bm.totalUsers || 0,
                formatDate(bm.lastAccess),
                formatDate(bm.lastUpdate)
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bm-facebook-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        showAlert('Dados exportados com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        showAlert('Erro ao exportar dados', 'error');
    } finally {
        hideLoading();
    }
}

function showConfirmDialog(message, onConfirm) {
    const dialog = document.createElement('div');
    dialog.className = 'bm-modal active';
    dialog.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Confirmação</h2>
                <button class="modal-close" onclick="this.closest('.bm-modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="bm-btn" onclick="this.closest('.bm-modal').remove()">Cancelar</button>
                <button class="bm-btn bm-btn-primary" onclick="handleConfirm(this)">Confirmar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    function handleConfirm(button) {
        button.closest('.bm-modal').remove();
        onConfirm();
    }
} 