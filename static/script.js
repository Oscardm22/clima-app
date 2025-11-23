// Función para buscar por ciudad
async function buscarClimaPorCiudad(ciudad) {
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.getElementById('loading');
    
    // Resetear estados
    resultadoDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    
    try {
        const response = await fetch('/clima', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `ciudad=${encodeURIComponent(ciudad)}`
        });
        
        const data = await response.json();
        
        loadingDiv.classList.add('hidden');
        
        if (response.ok) {
            guardarEnHistorial(ciudad);
            mostrarResultado(data);
        } else {
            mostrarError(data.error || 'Error desconocido');
        }
        
    } catch (error) {
        loadingDiv.classList.add('hidden');
        mostrarError('Error de conexión con el servidor');
    }
}

// Buscar clima por ciudad
document.getElementById('clima-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const ciudad = document.getElementById('ciudad').value.trim();
    if (ciudad) {
        await buscarClimaPorCiudad(ciudad);
    }
});

// Ubicación automática por IP
document.getElementById('btn-ubicacion-auto').addEventListener('click', function() {
    obtenerClimaPorIP();
});

// Función para obtener clima por IP
async function obtenerClimaPorIP() {
    const loadingDiv = document.getElementById('loading');
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error');
    
    // Resetear estados
    resultadoDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    
    loadingDiv.innerHTML = `
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p class="text-gray-600 mt-3">Detectando tu ubicación...</p>
        <p class="text-sm text-gray-500">Usando tu dirección IP</p>
    `;
    
    try {
        const response = await fetch('/clima_por_ip');
        const data = await response.json();
        
        loadingDiv.classList.add('hidden');
        
        if (response.ok) {
            data.por_ubicacion = true;
            data.por_ip = true;
            mostrarResultado(data);
        } else {
            mostrarError('No se pudo determinar tu ubicación automáticamente');
        }
    } catch (error) {
        loadingDiv.classList.add('hidden');
        mostrarError('Error de conexión al obtener ubicación');
    }
}

// Historial de búsquedas
function guardarEnHistorial(ciudad) {
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

function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historialClima')) || [];
    const historialDiv = document.getElementById('historial');
    const container = document.getElementById('historial-container');
    
    if (historial.length > 0) {
        historialDiv.innerHTML = historial.map(ciudad => `
            <button 
                class="historial-btn px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                data-ciudad="${ciudad}"
            >
                <i class="fas fa-history mr-1 text-gray-500"></i>${ciudad}
            </button>
        `).join('');
        
        container.classList.remove('hidden');
        
        // Agregar event listeners a los botones del historial
        document.querySelectorAll('.historial-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ciudad = this.getAttribute('data-ciudad');
                document.getElementById('ciudad').value = ciudad;
                buscarClimaPorCiudad(ciudad);
            });
        });
    } else {
        container.classList.add('hidden');
    }
}

function limpiarHistorial() {
    localStorage.removeItem('historialClima');
    mostrarHistorial();
}

// Event listener para el botón limpiar
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar historial al cargar la página
    mostrarHistorial();
    
    // Event listener para limpiar historial
    const btnLimpiar = document.getElementById('btn-limpiar-historial');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarHistorial);
    }
});

function mostrarResultado(data) {
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error');
    
    errorDiv.classList.add('hidden');
    
    // Indicador de ubicación automática
    const ubicacionIndicator = data.por_ubicacion ? 
        '<div class="bg-green-100 border border-green-200 rounded-lg p-2 mb-4 text-center"><i class="fas fa-map-marker-alt text-green-500 mr-2"></i><span class="text-green-700 text-sm">Clima de tu ubicación actual</span></div>' : 
        '';
    
    resultadoDiv.innerHTML = `
        ${ubicacionIndicator}
        <div class="text-center">
            <div class="flex items-center justify-center space-x-4 mb-4">
                <img src="http://openweathermap.org/img/wn/${data.icono}@2x.png" 
                     alt="${data.descripcion}" 
                     class="w-16 h-16">
                <div class="text-left">
                    <div class="text-4xl font-bold text-gray-800">${data.temperatura}°C</div>
                    <div class="text-gray-600">Sensación: ${data.sensacion_termica}°C</div>
                </div>
            </div>
            
            <h2 class="text-xl font-semibold text-gray-800 mb-2">${data.ciudad}, ${data.pais}</h2>
            <p class="text-gray-600 capitalize mb-6">${data.descripcion}</p>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/50 rounded-lg p-3 text-center">
                    <i class="fas fa-tint text-blue-500 mb-1"></i>
                    <div class="text-sm text-gray-600">Humedad</div>
                    <div class="font-semibold text-gray-800">${data.humedad}%</div>
                </div>
                <div class="bg-white/50 rounded-lg p-3 text-center">
                    <i class="fas fa-wind text-green-500 mb-1"></i>
                    <div class="text-sm text-gray-600">Viento</div>
                    <div class="font-semibold text-gray-800">${data.viento} m/s</div>
                </div>
            </div>
        </div>
    `;
    
    resultadoDiv.classList.remove('hidden');
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error');
    const resultadoDiv = document.getElementById('resultado');
    
    resultadoDiv.classList.add('hidden');
    errorDiv.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
            <div>
                <p class="font-semibold text-red-800">Error</p>
                <p class="text-red-600">${mensaje}</p>
            </div>
        </div>
    `;
    errorDiv.classList.remove('hidden');
}