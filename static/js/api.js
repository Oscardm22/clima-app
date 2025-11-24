export async function buscarClimaPorCiudad(ciudad) {
    const response = await fetch('/clima', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `ciudad=${encodeURIComponent(ciudad)}`
    });
    
    if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
    }
    
    return await response.json();
}

export async function obtenerClimaPorIP() {
    const response = await fetch('/clima_por_ip');
    
    if (!response.ok) {
        throw new Error('No se pudo determinar tu ubicación automáticamente');
    }
    
    const data = await response.json();
    data.por_ubicacion = true;
    data.por_ip = true;
    
    return data;
}

export async function obtenerPronosticoExtendido(ciudad) {
    const response = await fetch('/pronostico', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `ciudad=${encodeURIComponent(ciudad)}`
    });
    
    if (!response.ok) {
        throw new Error('Error al obtener el pronóstico extendido');
    }
    
    return await response.json();
}