# WHIS TECH ALLIANCE - Python Backend API

This is the Python backend API for the WHIS TECH ALLIANCE network scanner application.

## Setup Instructions

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the API server:**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns the health status of the API

### Single Port Scan
- **POST** `/api/scan-port`
- Body: `{"host": "example.com", "port": 80}`
- Scans a single port on the target host

### Port Range Scan
- **POST** `/api/scan-range`
- Body: `{"host": "example.com", "start_port": 80, "end_port": 100}`
- Scans a range of ports on the target host

### Geo IP Lookup
- **POST** `/api/geo-lookup`
- Body: `{"ip": "8.8.8.8"}`
- Returns geographical information for an IP address

## Integration with React Frontend

The React frontend should make requests to these endpoints. Update your frontend to use:
- Base URL: `http://localhost:5000/api`
- Enable CORS (already configured in the Flask app)

## Production Deployment

For production, consider:
1. Using Gunicorn or uWSGI as WSGI server
2. Setting up proper environment variables
3. Using a real GeoIP database
4. Implementing proper error handling and logging
5. Adding authentication and rate limiting