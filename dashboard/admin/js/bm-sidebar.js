// Gerenciamento do Menu Lateral
class SidebarManager {
    constructor() {
        this.body = document.body;
        this.sidebar = document.querySelector('.bm-sidebar');
        this.toggleBtn = document.getElementById('sidebarToggle');
        this.mediaQuery = window.matchMedia('(max-width: 768px)');
        
        this.setupEventListeners();
        this.loadSidebarState();
    }

    setupEventListeners() {
        // Toggle do menu
        this.toggleBtn.addEventListener('click', () => this.toggleSidebar());

        // Responsividade
        this.mediaQuery.addListener(() => this.handleResponsive());
        
        // Fechar menu no mobile ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.mediaQuery.matches && 
                !this.sidebar.contains(e.target) && 
                !this.toggleBtn.contains(e.target)) {
                this.closeSidebar();
            }
        });

        // Gerenciar estado do menu
        window.addEventListener('beforeunload', () => this.saveSidebarState());
    }

    toggleSidebar() {
        if (this.mediaQuery.matches) {
            // Mobile: toggle visibilidade
            this.body.classList.toggle('sidebar-visible');
            this.createOverlay();
        } else {
            // Desktop: toggle collapsed
            this.body.classList.toggle('sidebar-collapsed');
        }
    }

    closeSidebar() {
        this.body.classList.remove('sidebar-visible');
        this.removeOverlay();
    }

    createOverlay() {
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', () => this.closeSidebar());
            document.body.appendChild(overlay);
        }
    }

    removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    handleResponsive() {
        if (this.mediaQuery.matches) {
            // Mobile
            this.body.classList.remove('sidebar-collapsed');
            this.body.classList.remove('sidebar-visible');
        } else {
            // Desktop
            this.removeOverlay();
            this.loadSidebarState();
        }
    }

    saveSidebarState() {
        if (!this.mediaQuery.matches) {
            localStorage.setItem('sidebarCollapsed', 
                this.body.classList.contains('sidebar-collapsed'));
        }
    }

    loadSidebarState() {
        if (!this.mediaQuery.matches) {
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            this.body.classList.toggle('sidebar-collapsed', isCollapsed);
        }
    }
}

// Gerenciamento do Usuário
class UserManager {
    constructor() {
        this.userInfo = document.querySelector('.user-info');
        this.logoutBtn = document.querySelector('.logout-btn');
        
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    async loadUserData() {
        try {
            // Simular chamada à API (substituir por chamada real)
            const userData = {
                name: 'João Silva',
                role: 'Administrador',
                avatar: 'img/user-avatar.png'
            };

            this.updateUserInterface(userData);
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }

    updateUserInterface(userData) {
        const nameElement = this.userInfo.querySelector('.user-name');
        const roleElement = this.userInfo.querySelector('.user-role');
        const avatarElement = this.userInfo.querySelector('.user-avatar');

        if (nameElement) nameElement.textContent = userData.name;
        if (roleElement) roleElement.textContent = userData.role;
        if (avatarElement) avatarElement.src = userData.avatar;
    }

    async handleLogout() {
        try {
            // Simular chamada à API (substituir por chamada real)
            await fetch('/api/auth/logout', { method: 'POST' });
            
            // Limpar dados locais
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirecionar para login
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Tente novamente.');
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
    window.userManager = new UserManager();
}); 