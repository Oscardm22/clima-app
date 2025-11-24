import { buscarClimaPorCiudad, obtenerClimaPorIP, obtenerPronosticoExtendido } from './api.js';
import { mostrarResultado, mostrarError, mostrarLoading, ocultarLoading, resetearUI, mostrarPronosticoExtendido } from './ui.js';
import { guardarEnHistorial } from './historial.js';
import './tema.js';
import './historial.js';

// Estado de la aplicación
let estadoActual = {
    tipo: 'actual',
    ciudadActual: null,
    datosActuales: null
};

// Función principal para buscar clima actual
async function ejecutarBusquedaClima(ciudad) {
    resetearUI();
    mostrarLoading();
    
    try {
        const data = await buscarClimaPorCiudad(ciudad);
        guardarEnHistorial(ciudad);
        
        estadoActual = {
            tipo: 'actual',
            ciudadActual: ciudad,
            datosActuales: data
        };
        
        mostrarResultado(data);
    } catch (error) {
        mostrarError(error.message);
    } finally {
        ocultarLoading();
    }
}

// Función para obtener pronóstico extendido
async function ejecutarPronosticoExtendido(ciudad) {
    resetearUI();
    mostrarLoading('Cargando pronóstico extendido...');
    
    try {
        const data = await obtenerPronosticoExtendido(ciudad);
        estadoActual.tipo = 'pronostico';
        mostrarPronosticoExtendido(data);
    } catch (error) {
        mostrarError(error.message);
    } finally {
        ocultarLoading();
    }
}

// Función para volver al clima actual
function volverAlClimaActual() {
    if (estadoActual.datosActuales) {
        mostrarResultado(estadoActual.datosActuales);
        estadoActual.tipo = 'actual';
    }
}

// Función para ubicación por IP
async function ejecutarUbicacionIP() {
    resetearUI();
    mostrarLoading('Detectando tu ubicación...', 'Usando tu dirección IP');
    
    try {
        const data = await obtenerClimaPorIP();
        estadoActual = {
            tipo: 'actual',
            ciudadActual: data.ciudad,
            datosActuales: data
        };
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
    
    // Evento para mostrar pronóstico extendido
    document.addEventListener('mostrarPronostico', function(e) {
        ejecutarPronosticoExtendido(e.detail);
    });
    
    // Evento para volver al clima actual
    document.addEventListener('volverClimaActual', function() {
        volverAlClimaActual();
    });
});

// Hacer funciones disponibles globalmente si es necesario
window.ejecutarBusquedaClima = ejecutarBusquedaClima;
window.ejecutarUbicacionIP = ejecutarUbicacionIP;
window.ejecutarPronosticoExtendido = ejecutarPronosticoExtendido;