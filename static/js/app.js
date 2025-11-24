import { buscarClimaPorCiudad, obtenerClimaPorIP } from './api.js';
import { mostrarResultado, mostrarError, mostrarLoading, ocultarLoading, resetearUI } from './ui.js';
import { guardarEnHistorial } from './historial.js';
import './tema.js';
import './historial.js';

// Función principal para buscar clima
async function ejecutarBusquedaClima(ciudad) {
    resetearUI();
    mostrarLoading();
    
    try {
        const data = await buscarClimaPorCiudad(ciudad);
        guardarEnHistorial(ciudad);
        mostrarResultado(data);
    } catch (error) {
        mostrarError(error.message);
    } finally {
        ocultarLoading();
    }
}

// Función para ubicación por IP
async function ejecutarUbicacionIP() {
    resetearUI();
    mostrarLoading('Detectando tu ubicación...', 'Usando tu dirección IP');
    
    try {
        const data = await obtenerClimaPorIP();
        mostrarResultado(data);
    } catch (error) {
        mostrarError(error.message);
    } finally {
        ocultarLoading();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de búsqueda
    document.getElementById('clima-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const ciudad = document.getElementById('ciudad').value.trim();
        if (ciudad) {
            await ejecutarBusquedaClima(ciudad);
        }
    });
    
    // Botón de ubicación automática
    document.getElementById('btn-ubicacion-auto').addEventListener('click', function() {
        ejecutarUbicacionIP();
    });
    
    // Evento personalizado para búsquedas desde historial
    document.addEventListener('buscarCiudad', function(e) {
        ejecutarBusquedaClima(e.detail);
    });
});

// Hacer funciones disponibles globalmente si es necesario
window.ejecutarBusquedaClima = ejecutarBusquedaClima;
window.ejecutarUbicacionIP = ejecutarUbicacionIP;