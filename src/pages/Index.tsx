
import { useState } from 'react';
import ScannerInterface from '../components/ScannerInterface';
import ScanResults from '../components/ScanResults';
import ScanHeader from '../components/ScanHeader';

export interface ScanConfig {
  target: string;
  portRange: string;
  scanType: string;
  timeout: number;
}

export interface PortResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service?: string;
  version?: string;
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<PortResult[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPort, setCurrentPort] = useState<number | null>(null);

  const handleStartScan = async (config: ScanConfig) => {
    setIsScanning(true);
    setScanResults([]);
    setScanProgress(0);
    setCurrentPort(null);

    // Parse port range
    const [startPort, endPort] = config.portRange.includes('-') 
      ? config.portRange.split('-').map(Number)
      : [parseInt(config.portRange), parseInt(config.portRange)];

    const totalPorts = endPort - startPort + 1;
    const results: PortResult[] = [];

    // Simulate scanning with realistic timing
    for (let port = startPort; port <= endPort; port++) {
      setCurrentPort(port);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      
      // Simulate port detection with weighted probabilities
      const rand = Math.random();
      let status: 'open' | 'closed' | 'filtered';
      let service: string | undefined;
      
      // Common ports are more likely to be open
      const commonPorts = [22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306];
      const isCommonPort = commonPorts.includes(port);
      
      if (isCommonPort && rand < 0.3) {
        status = 'open';
        service = getServiceName(port);
      } else if (rand < 0.05) {
        status = 'open';
        service = getServiceName(port);
      } else if (rand < 0.85) {
        status = 'closed';
      } else {
        status = 'filtered';
      }

      const result: PortResult = {
        port,
        status,
        service,
        version: status === 'open' ? getVersionInfo(port) : undefined
      };

      results.push(result);
      setScanResults([...results]);
      setScanProgress(((port - startPort + 1) / totalPorts) * 100);
    }

    setIsScanning(false);
    setCurrentPort(null);
  };

  const getServiceName = (port: number): string => {
    const services: { [key: number]: string } = {
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
      3306: 'MySQL'
    };
    return services[port] || 'Unknown';
  };

  const getVersionInfo = (port: number): string => {
    const versions = [
      'OpenSSH 8.9',
      'Apache 2.4.52',
      'nginx 1.18.0',
      'MySQL 8.0.30',
      'PostgreSQL 14.5',
      'Microsoft RDP',
      'Postfix 3.6.4'
    ];
    return versions[Math.floor(Math.random() * versions.length)];
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-7xl mx-auto">
        <ScanHeader />
        
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <ScannerInterface 
            onStartScan={handleStartScan}
            isScanning={isScanning}
          />
          
          <ScanResults 
            results={scanResults}
            isScanning={isScanning}
            progress={scanProgress}
            currentPort={currentPort}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
