import './FacebookAPI.js';
import './AdSetsManager.js';
import '../css/style.scss';

// Inicialização do aplicativo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicativo inicializado');
    
    // Inicialização do Select2
    $('.select2').select2({
        theme: 'bootstrap-5'
    });

    // Inicialização dos tooltips do Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}); 