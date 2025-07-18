import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Database } from 'lucide-react';

interface ThreatInfo {
  ip: string;
  isMalicious: boolean;
  threatScore: number;
  categories: string[];
  lastSeen: string;
  sources: string[];
  description: string;
}

interface ThreatIntelligenceProps {
  target: string;
}

const ThreatIntelligence = ({ target }: ThreatIntelligenceProps) => {
  const [threatInfo, setThreatInfo] = useState<ThreatInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performThreatCheck = async () => {
    if (!target) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different threat scenarios
      const isMalicious = Math.random() < 0.2; // 20% chance of being malicious
      
      const mockData: ThreatInfo = {
        ip: target.includes('.') ? target : '192.168.1.1',
        isMalicious,
        threatScore: isMalicious ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30),
        categories: isMalicious 
          ? ['Botnet', 'Malware C&C', 'Suspicious Activity']
          : ['Clean', 'Legitimate Traffic'],
        lastSeen: isMalicious ? '2024-07-15' : 'Never',
        sources: ['VirusTotal', 'AbuseIPDB', 'ThreatCrowd', 'OTX AlienVault'],
        description: isMalicious 
          ? 'This IP has been reported for malicious activities including botnet communication and malware distribution.'
          : 'No malicious activity detected for this IP address.'
      };
      
      setThreatInfo(mockData);
    } catch (err) {
      setError('Failed to check threat intelligence');
    } finally {
      setIsLoading(false);
    }
  };

  const getThreatLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'destructive', icon: XCircle };
    if (score >= 60) return { level: 'High', color: 'destructive', icon: AlertTriangle };
    if (score >= 40) return { level: 'Medium', color: 'warning', icon: AlertTriangle };
    if (score >= 20) return { level: 'Low', color: 'secondary', icon: AlertTriangle };
    return { level: 'Clean', color: 'success', icon: CheckCircle };
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Shield className="w-5 h-5" />
          Threat Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={performThreatCheck}
          disabled={!target || isLoading}
          className="w-full"
        >
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? 'Checking threat databases...' : 'Check Threat Intelligence'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {threatInfo && (
          <div className="space-y-4">
            {threatInfo.isMalicious && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> This IP is flagged as malicious!
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {(() => {
                    const IconComponent = getThreatLevel(threatInfo.threatScore).icon;
                    return <IconComponent className="w-4 h-4 text-muted-foreground" />;
                  })()}
                  <span className="text-sm font-medium">Threat Level</span>
                </div>
                <div className="pl-6">
                  <Badge variant={getThreatLevel(threatInfo.threatScore).color as any}>
                    {getThreatLevel(threatInfo.threatScore).level} ({threatInfo.threatScore}/100)
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Seen</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm">{threatInfo.lastSeen}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Categories</h4>
              <div className="flex gap-2 flex-wrap">
                {threatInfo.categories.map((category, index) => (
                  <Badge 
                    key={index} 
                    variant={threatInfo.isMalicious ? "destructive" : "secondary"}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Intelligence Sources</h4>
              <div className="flex gap-2 flex-wrap">
                {threatInfo.sources.map((source, index) => (
                  <Badge key={index} variant="outline">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">{threatInfo.description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreatIntelligence;