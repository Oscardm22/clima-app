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
            
            <div class="grid grid-cols-2 gap-4">
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
        </div>
    `;
    
    resultadoDiv.classList.remove('hidden');
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