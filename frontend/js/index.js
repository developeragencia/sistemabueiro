import React from 'react';
import ReactDOM from 'react-dom/client';
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

const App = () => {
  return (
    <div className="container">
      <h1>Bueiro2029</h1>
      <p>Sistema de monitoramento de bueiros</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 