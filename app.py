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
        # Usar una API para obtener ubicación por IP
        ip_response = requests.get('http://ip-api.com/json/')
        ip_data = ip_response.json()
                
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
        return jsonify({'error': 'Error del servidor'}), 500
    
if __name__ == '__main__':
    app.run(debug=True) 
