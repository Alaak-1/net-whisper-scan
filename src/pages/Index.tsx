
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ScannerInterface from '../components/ScannerInterface';
import ScanResults from '../components/ScanResults';
import ScanHeader from '../components/ScanHeader';
import GeoIPLookup from '../components/GeoIPLookup';
import ThreatIntelligence from '../components/ThreatIntelligence';
import EducationalMode from '../components/EducationalMode';
import { Scan, Globe, Shield, BookOpen, Activity } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('scanner');
  const [targetHost, setTargetHost] = useState('');

  const handleStartScan = async (config: ScanConfig) => {
    setIsScanning(true);
    setScanResults([]);
    setScanProgress(0);
    setCurrentPort(null);
    setTargetHost(config.target);

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

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'scanner': return <Scan className="w-4 h-4" />;
      case 'geoip': return <Globe className="w-4 h-4" />;
      case 'threat': return <Shield className="w-4 h-4" />;
      case 'education': return <BookOpen className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getResultsSummary = () => {
    if (!scanResults.length) return null;
    const open = scanResults.filter(r => r.status === 'open').length;
    const closed = scanResults.filter(r => r.status === 'closed').length;
    const filtered = scanResults.filter(r => r.status === 'filtered').length;
    return { open, closed, filtered };
  };

  const summary = getResultsSummary();

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-7xl mx-auto">
        <ScanHeader />
        
        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Scan className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Advanced Scanner</h3>
              <p className="text-sm text-muted-foreground">Multi-threaded port scanning</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">GeoIP Lookup</h3>
              <p className="text-sm text-muted-foreground">Geographic IP information</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <h3 className="font-medium">Threat Intelligence</h3>
              <p className="text-sm text-muted-foreground">Malicious IP detection</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">Educational Mode</h3>
              <p className="text-sm text-muted-foreground">Learn about ports & security</p>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        {summary && (
          <Card className="mt-6 bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Scan Summary for {targetHost}</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">
                      {summary.open} Open
                    </Badge>
                    <Badge variant="secondary" className="bg-red-500/20 text-red-600 border-red-500/30">
                      {summary.closed} Closed
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                      {summary.filtered} Filtered
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabbed Interface */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                {getTabIcon('scanner')}
                Scanner
              </TabsTrigger>
              <TabsTrigger value="geoip" className="flex items-center gap-2">
                {getTabIcon('geoip')}
                GeoIP
              </TabsTrigger>
              <TabsTrigger value="threat" className="flex items-center gap-2">
                {getTabIcon('threat')}
                Threat Intel
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                {getTabIcon('education')}
                Education
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
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
            </TabsContent>

            <TabsContent value="geoip" className="mt-6">
              <GeoIPLookup target={targetHost} />
            </TabsContent>

            <TabsContent value="threat" className="mt-6">
              <ThreatIntelligence target={targetHost} />
            </TabsContent>

            <TabsContent value="education" className="mt-6">
              <EducationalMode results={scanResults} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
