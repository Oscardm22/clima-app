from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Cargar variables de entorno

app = Flask(__name__)

# Clave de API
API_KEY = os.getenv('OPENWEATHER_API_KEY')
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/clima', methods=['POST'])
def obtener_clima():
    try:
        ciudad = request.form.get('ciudad')
        
        if not ciudad:
            return jsonify({'error': 'Por favor ingresa una ciudad'}), 400
        
        params = {
            'q': ciudad,
            'appid': API_KEY,
            'units': 'metric',
            'lang': 'es'
        }
        
        respuesta = requests.get(BASE_URL, params=params)
        datos = respuesta.json()
        
        if respuesta.status_code == 200:
            clima_info = {
                'ciudad': datos['name'],
                'pais': datos['sys']['country'],
                'temperatura': round(datos['main']['temp']),
                'sensacion_termica': round(datos['main']['feels_like']),
                'humedad': datos['main']['humidity'],
                'descripcion': datos['weather'][0]['description'].title(),
                'icono': datos['weather'][0]['icon'],
                'viento': datos['wind']['speed']
            }
            return jsonify(clima_info)
        else:
            error_msg = datos.get('message', 'Error desconocido')
            return jsonify({'error': 'Ciudad no encontrada'}), 404
            
    except Exception as e:
        return jsonify({'error': 'Error del servidor'}), 500

@app.route('/clima_por_ip', methods=['GET'])
def obtener_clima_por_ip():
    try:
        if request.headers.get('X-Forwarded-For'):
            # En producción (Render, etc.)
            user_ip = request.headers.get('X-Forwarded-For').split(',')[0]
        else:
            # En desarrollo local
            user_ip = request.remote_addr
        
        print(f"📍 IP del usuario: {user_ip}")
        
        # Usar la IP del usuario para geolocalización
        ip_response = requests.get(f'http://ip-api.com/json/{user_ip}')
        ip_data = ip_response.json()
        
        print(f"📍 Ubicación detectada: {ip_data.get('city', 'Desconocida')}")
        
        if ip_data['status'] == 'success':
            ciudad = ip_data['city']
            
            # Usar OpenWeatherMap con la ciudad obtenida por IP
            params = {
                'q': ciudad,
                'appid': API_KEY,
                'units': 'metric',
                'lang': 'es'
            }
            
            respuesta = requests.get(BASE_URL, params=params)
            datos = respuesta.json()
            
            if respuesta.status_code == 200:
                clima_info = {
                    'ciudad': datos['name'],
                    'pais': datos['sys']['country'],
                    'temperatura': round(datos['main']['temp']),
                    'sensacion_termica': round(datos['main']['feels_like']),
                    'humedad': datos['main']['humidity'],
                    'descripcion': datos['weather'][0]['description'].title(),
                    'icono': datos['weather'][0]['icon'],
                    'viento': datos['wind']['speed'],
                    'por_ubicacion': True,
                    'por_ip': True
                }
                return jsonify(clima_info)
        
        return jsonify({'error': 'No se pudo determinar tu ubicación'}), 404
            
    except Exception as e:
        print(f"💥 Error en ubicación por IP: {str(e)}")
        return jsonify({'error': 'Error del servidor'}), 500
    
@app.route('/pronostico', methods=['POST'])
def obtener_pronostico():
    try:
        ciudad = request.form.get('ciudad')
        
        if not ciudad:
            return jsonify({'error': 'Por favor ingresa una ciudad'}), 400
        
        # API de pronóstico extendido (5 días)
        params = {
            'q': ciudad,
            'appid': API_KEY,
            'units': 'metric',
            'lang': 'es',
            'cnt': 40  # 5 días * 8 mediciones por día = 40
        }
        
        respuesta = requests.get('http://api.openweathermap.org/data/2.5/forecast', params=params)
        datos = respuesta.json()
        
        if respuesta.status_code == 200:
            # Procesar datos para agrupar por día
            pronostico = procesar_pronostico(datos)
            return jsonify(pronostico)
        else:
            return jsonify({'error': 'Ciudad no encontrada'}), 404
            
    except Exception as e:
        return jsonify({'error': 'Error del servidor'}), 500

def procesar_pronostico(datos):
    """Procesa los datos del pronóstico para agrupar por día"""
    pronostico_por_dia = {}
    
    for item in datos['list']:
        # Obtener la fecha (sin hora)
        fecha = item['dt_txt'].split(' ')[0]
        
        if fecha not in pronostico_por_dia:
            pronostico_por_dia[fecha] = {
                'temp_min': item['main']['temp_min'],
                'temp_max': item['main']['temp_max'],
                'temps': [],
                'descripciones': [],
                'iconos': []
            }
        
        # Actualizar mínimas y máximas
        pronostico_por_dia[fecha]['temp_min'] = min(pronostico_por_dia[fecha]['temp_min'], item['main']['temp_min'])
        pronostico_por_dia[fecha]['temp_max'] = max(pronostico_por_dia[fecha]['temp_max'], item['main']['temp_max'])
        
        # Guardar datos para promedios
        pronostico_por_dia[fecha]['temps'].append(item['main']['temp'])
        pronostico_por_dia[fecha]['descripciones'].append(item['weather'][0]['description'])
        pronostico_por_dia[fecha]['iconos'].append(item['weather'][0]['icon'])
    
    # Convertir a lista y calcular promedios
    pronostico_final = []
    for fecha, datos_dia in list(pronostico_por_dia.items())[:5]:  # Solo 5 días
        # Encontrar la descripción más común
        descripcion_comun = max(set(datos_dia['descripciones']), key=datos_dia['descripciones'].count)
        icono_comun = max(set(datos_dia['iconos']), key=datos_dia['iconos'].count)
        
        pronostico_final.append({
            'fecha': fecha,
            'temp_min': round(datos_dia['temp_min']),
            'temp_max': round(datos_dia['temp_max']),
            'temp_promedio': round(sum(datos_dia['temps']) / len(datos_dia['temps'])),
            'descripcion': descripcion_comun.title(),
            'icono': icono_comun,
            'dia_semana': obtener_dia_semana(fecha)
        })
    
    return {
        'ciudad': datos['city']['name'],
        'pais': datos['city']['country'],
        'pronostico': pronostico_final
    }

def obtener_dia_semana(fecha_str):
    """Convierte fecha string a nombre del día"""
    from datetime import datetime
    fecha = datetime.strptime(fecha_str, '%Y-%m-%d')
    
    dias = {
        0: 'Lun', 1: 'Mar', 2: 'Mié', 3: 'Jue', 
        4: 'Vie', 5: 'Sáb', 6: 'Dom'
    }
    
    # Si es hoy, mostrar "Hoy"
    hoy = datetime.now().date()
    if fecha.date() == hoy:
        return 'Hoy'
    elif fecha.date() == hoy.replace(day=hoy.day + 1):
        return 'Mañana'
    else:
        return dias[fecha.weekday()]
    
if __name__ == '__main__':
    app.run(debug=True) 
