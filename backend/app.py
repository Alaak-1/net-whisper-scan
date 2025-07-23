from flask import Flask, jsonify, request
from flask_cors import CORS
import socket
import threading
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'WHIS TECH ALLIANCE Scanner API'
    })

@app.route('/api/scan-port', methods=['POST'])
def scan_port():
    """Scan a single port on a target host"""
    data = request.get_json()
    host = data.get('host')
    port = data.get('port')
    
    if not host or not port:
        return jsonify({'error': 'Host and port are required'}), 400
    
    try:
        # Create socket and attempt connection
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(3)  # 3 second timeout
        result = sock.connect_ex((host, port))
        sock.close()
        
        is_open = result == 0
        
        return jsonify({
            'host': host,
            'port': port,
            'status': 'open' if is_open else 'closed',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scan-range', methods=['POST'])
def scan_port_range():
    """Scan a range of ports on a target host"""
    data = request.get_json()
    host = data.get('host')
    start_port = data.get('start_port')
    end_port = data.get('end_port')
    
    if not all([host, start_port, end_port]):
        return jsonify({'error': 'Host, start_port, and end_port are required'}), 400
    
    try:
        open_ports = []
        closed_ports = []
        
        for port in range(start_port, end_port + 1):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)  # 1 second timeout for range scans
            result = sock.connect_ex((host, port))
            sock.close()
            
            if result == 0:
                open_ports.append(port)
            else:
                closed_ports.append(port)
        
        return jsonify({
            'host': host,
            'scan_range': f"{start_port}-{end_port}",
            'open_ports': open_ports,
            'closed_ports': closed_ports,
            'total_scanned': end_port - start_port + 1,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/geo-lookup', methods=['POST'])
def geo_lookup():
    """Get geographical information for an IP address"""
    data = request.get_json()
    ip = data.get('ip')
    
    if not ip:
        return jsonify({'error': 'IP address is required'}), 400
    
    try:
        # Mock geo data - in production, you'd use a real GeoIP service
        return jsonify({
            'ip': ip,
            'country': 'United States',
            'region': 'California',
            'city': 'San Francisco',
            'latitude': 37.7749,
            'longitude': -122.4194,
            'isp': 'Example ISP',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)