export function inicializarModoOscuro() {
    const temaGuardado = localStorage.getItem('temaClima');
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema guardado o preferencia del sistema
    if (temaGuardado === 'oscuro' || (!temaGuardado && prefiereOscuro)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    actualizarIconoTema();
}

export function toggleModoOscuro() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    
    // Guardar preferencia
    const esOscuro = html.classList.contains('dark');
    localStorage.setItem('temaClima', esOscuro ? 'oscuro' : 'claro');
    
    actualizarIconoTema();
}

function actualizarIconoTema() {
    const btn = document.getElementById('btn-toggle-tema');
    if (!btn) return;
    
    const iconLuna = btn.querySelector('.fa-moon');
    const iconSol = btn.querySelector('.fa-sun');
    
    const esOscuro = document.documentElement.classList.contains('dark');
    
    if (esOscuro) {
        iconLuna.classList.add('hidden');
        iconSol.classList.remove('hidden');
    } else {
        iconLuna.classList.remove('hidden');
        iconSol.classList.add('hidden');
    }
}

// Inicializar cuando el módulo se carga
document.addEventListener('DOMContentLoaded', function() {
    const btnTema = document.getElementById('btn-toggle-tema');
    if (btnTema) {
        btnTema.addEventListener('click', toggleModoOscuro);
    }
    inicializarModoOscuro();
});