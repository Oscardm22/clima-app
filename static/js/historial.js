export function guardarEnHistorial(ciudad) {
    let historial = JSON.parse(localStorage.getItem('historialClima')) || [];
    
    // Remover si ya existe (para evitar duplicados)
    historial = historial.filter(item => item.toLowerCase() !== ciudad.toLowerCase());
    
    // Agregar al principio
    historial.unshift(ciudad);
    
    // Mantener solo las últimas 5 búsquedas
    historial = historial.slice(0, 5);
    
    // Guardar en localStorage
    localStorage.setItem('historialClima', JSON.stringify(historial));
    
    // Actualizar la interfaz
    mostrarHistorial();
}

export function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historialClima')) || [];
    const historialDiv = document.getElementById('historial');
    const container = document.getElementById('historial-container');
    
    if (historial.length > 0) {
        historialDiv.innerHTML = historial.map(ciudad => `
            <button 
                class="historial-btn px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-medium"
                data-ciudad="${ciudad}"
            >
                <i class="fas fa-history mr-1 text-gray-500"></i>${ciudad}
            </button>
        `).join('');
        
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

export function limpiarHistorial() {
    localStorage.removeItem('historialClima');
    mostrarHistorial();
}

// Para uso interno del módulo
function setupEventListenersHistorial() {
    const btnLimpiar = document.getElementById('btn-limpiar-historial');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarHistorial);
    }
    
    // Delegación de eventos para los botones del historial
    document.addEventListener('click', function(e) {
        if (e.target.closest('.historial-btn')) {
            const ciudad = e.target.closest('.historial-btn').getAttribute('data-ciudad');
            document.getElementById('ciudad').value = ciudad;
            // Este evento será manejado por app.js
            document.dispatchEvent(new CustomEvent('buscarCiudad', { detail: ciudad }));
        }
    });
}

// Inicializar cuando el módulo se carga
document.addEventListener('DOMContentLoaded', function() {
    mostrarHistorial();
    setupEventListenersHistorial();
});