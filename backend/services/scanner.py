import socket
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Tuple
import time

class PortScanner:
    """Advanced port scanning service"""
    
    def __init__(self, timeout: int = 3, max_threads: int = 100):
        self.timeout = timeout
        self.max_threads = max_threads
    
    def scan_single_port(self, host: str, port: int) -> Dict:
        """Scan a single port"""
        try:
            start_time = time.time()
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(self.timeout)
            result = sock.connect_ex((host, port))
            sock.close()
            scan_time = time.time() - start_time
            
            return {
                'port': port,
                'status': 'open' if result == 0 else 'closed',
                'response_time': round(scan_time * 1000, 2)  # in milliseconds
            }
        except Exception as e:
            return {
                'port': port,
                'status': 'error',
                'error': str(e),
                'response_time': None
            }
    
    def scan_port_range(self, host: str, start_port: int, end_port: int) -> Dict:
        """Scan a range of ports using threading"""
        ports = list(range(start_port, end_port + 1))
        results = []
        
        with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
            # Submit all port scan tasks
            future_to_port = {
                executor.submit(self.scan_single_port, host, port): port 
                for port in ports
            }
            
            # Collect results as they complete
            for future in as_completed(future_to_port):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    port = future_to_port[future]
                    results.append({
                        'port': port,
                        'status': 'error',
                        'error': str(e),
                        'response_time': None
                    })
        
        # Sort results by port number
        results.sort(key=lambda x: x['port'])
        
        # Separate open and closed ports
        open_ports = [r for r in results if r['status'] == 'open']
        closed_ports = [r for r in results if r['status'] == 'closed']
        error_ports = [r for r in results if r['status'] == 'error']
        
        return {
            'host': host,
            'scan_range': f"{start_port}-{end_port}",
            'total_scanned': len(ports),
            'open_ports': open_ports,
            'closed_ports': closed_ports,
            'error_ports': error_ports,
            'summary': {
                'open_count': len(open_ports),
                'closed_count': len(closed_ports),
                'error_count': len(error_ports)
            }
        }
    
    def get_service_name(self, port: int) -> str:
        """Get common service name for a port"""
        common_services = {
            21: 'FTP',
            22: 'SSH',
            23: 'Telnet',
            25: 'SMTP',
            53: 'DNS',
            80: 'HTTP',
            110: 'POP3',
            143: 'IMAP',
            443: 'HTTPS',
            993: 'IMAPS',
            995: 'POP3S',
            3389: 'RDP',
            5432: 'PostgreSQL',
            3306: 'MySQL',
            6379: 'Redis',
            27017: 'MongoDB'
        }
        return common_services.get(port, 'Unknown')