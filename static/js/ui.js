export function mostrarResultado(data) {
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error');
    
    errorDiv.classList.add('hidden');
    
    // Indicador de ubicación automática
    const ubicacionIndicator = data.por_ubicacion ? 
        '<div class="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-2 mb-4 text-center"><i class="fas fa-map-marker-alt text-green-500 mr-2"></i><span class="text-green-700 dark:text-green-300 text-sm">Clima de tu ubicación actual</span></div>' : 
        '';
    
    resultadoDiv.innerHTML = `
        ${ubicacionIndicator}
        <div class="text-center">
            <div class="flex items-center justify-center space-x-4 mb-4">
                <img src="http://openweathermap.org/img/wn/${data.icono}@2x.png" 
                     alt="${data.descripcion}" 
                     class="w-16 h-16">
                <div class="text-left">
                    <div class="text-4xl font-bold text-gray-800 dark:text-white">${data.temperatura}°C</div>
                    <div class="text-gray-600 dark:text-gray-300">Sensación: ${data.sensacion_termica}°C</div>
                </div>
            </div>
            
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">${data.ciudad}, ${data.pais}</h2>
            <p class="text-gray-600 dark:text-gray-300 capitalize mb-6">${data.descripcion}</p>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-white/50 dark:bg-gray-600/50 rounded-lg p-3 text-center">
                    <i class="fas fa-tint text-blue-500 mb-1"></i>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Humedad</div>
                    <div class="font-semibold text-gray-800 dark:text-white">${data.humedad}%</div>
                </div>
                <div class="bg-white/50 dark:bg-gray-600/50 rounded-lg p-3 text-center">
                    <i class="fas fa-wind text-green-500 mb-1"></i>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Viento</div>
                    <div class="font-semibold text-gray-800 dark:text-white">${data.viento} m/s</div>
                </div>
            </div>
            
            <!-- Botón de pronóstico extendido -->
            <button id="btn-pronostico-extendido" class="px-6 py-3 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg transition-all font-semibold flex items-center justify-center space-x-2 mx-auto">
                <i class="fas fa-calendar-alt"></i>
                <span>Ver pronóstico 5 días</span>
            </button>
        </div>
    `;
    
    resultadoDiv.classList.remove('hidden');
    
    // Event listener para el botón de pronóstico extendido
    document.getElementById('btn-pronostico-extendido').addEventListener('click', function() {
        document.dispatchEvent(new CustomEvent('mostrarPronostico', { detail: data.ciudad }));
    });
}

export function mostrarError(mensaje) {
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

export function mostrarLoading(mensaje = 'Buscando información del clima...') {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.innerHTML = `
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-300 mt-3">${mensaje}</p>
    `;
    loadingDiv.classList.remove('hidden');
}

export function ocultarLoading() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.add('hidden');
}

export function resetearUI() {
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.getElementById('loading');
    
    resultadoDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingDiv.classList.add('hidden');
}

export function mostrarPronosticoExtendido(data) {
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error');
    
    errorDiv.classList.add('hidden');
    
    const pronosticoHTML = data.pronostico.map(dia => `
        <div class="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-600/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-500/50 transition-all">
            <div class="flex items-center space-x-3">
                <img src="http://openweathermap.org/img/wn/${dia.icono}.png" 
                     alt="${dia.descripcion}" 
                     class="w-10 h-10">
                <div>
                    <div class="font-semibold text-gray-800 dark:text-white">${dia.dia_semana}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300 capitalize">${dia.descripcion}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="flex items-center space-x-2">
                    <span class="text-lg font-bold text-blue-600 dark:text-blue-400">${dia.temp_max}°</span>
                    <span class="text-lg text-gray-500 dark:text-gray-400">${dia.temp_min}°</span>
                </div>
            </div>
        </div>
    `).join('');
    
    resultadoDiv.innerHTML = `
        <div class="text-center mb-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Pronóstico 5 días</h2>
            <p class="text-gray-600 dark:text-gray-300">${data.ciudad}, ${data.pais}</p>
        </div>
        
        <div class="space-y-2">
            ${pronosticoHTML}
        </div>
        
        <div class="mt-6 text-center">
            <button id="btn-volver-actual" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium">
                ← Volver al clima actual
            </button>
        </div>
    `;
    
    resultadoDiv.classList.remove('hidden');
    
    // Event listener para el botón volver
    document.getElementById('btn-volver-actual').addEventListener('click', function() {
        // Este evento será manejado por app.js
        document.dispatchEvent(new CustomEvent('volverClimaActual'));
    });
}