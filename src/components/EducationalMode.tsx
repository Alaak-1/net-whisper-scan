import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { PortResult } from '../pages/Index';

interface EducationalModeProps {
  results: PortResult[];
}

const EducationalMode = ({ results }: EducationalModeProps) => {
  const [selectedPort, setSelectedPort] = useState<number | null>(null);

  const portEducation: { [key: number]: { 
    description: string; 
    security: string; 
    commonUse: string;
    risks: string[];
    recommendations: string[];
  }} = {
    22: {
      description: "SSH (Secure Shell) - Encrypted remote access protocol",
      security: "Generally secure when properly configured",
      commonUse: "Remote server administration, secure file transfers",
      risks: ["Brute force attacks", "Weak passwords", "Outdated SSH versions"],
      recommendations: ["Use key-based authentication", "Change default port", "Disable root login"]
    },
    23: {
      description: "Telnet - Unencrypted remote access protocol",
      security: "Highly insecure - transmits data in plaintext",
      commonUse: "Legacy remote access (mostly deprecated)",
      risks: ["Password sniffing", "Session hijacking", "Man-in-the-middle attacks"],
      recommendations: ["Replace with SSH", "Disable if not needed", "Use only on isolated networks"]
    },
    80: {
      description: "HTTP - Hypertext Transfer Protocol for web traffic",
      security: "Unencrypted - vulnerable to eavesdropping",
      commonUse: "Web servers, API endpoints",
      risks: ["Data interception", "Session hijacking", "Injection attacks"],
      recommendations: ["Migrate to HTTPS", "Implement proper authentication", "Use security headers"]
    },
    443: {
      description: "HTTPS - Secure HTTP with TLS/SSL encryption",
      security: "Secure when properly configured",
      commonUse: "Secure web traffic, APIs",
      risks: ["Weak cipher suites", "Certificate issues", "Protocol vulnerabilities"],
      recommendations: ["Use strong TLS versions", "Valid certificates", "HSTS headers"]
    },
    3389: {
      description: "RDP - Remote Desktop Protocol for Windows",
      security: "Medium security - often targeted by attackers",
      commonUse: "Remote Windows desktop access",
      risks: ["Brute force attacks", "BlueKeep vulnerabilities", "Weak passwords"],
      recommendations: ["Use VPN", "Strong passwords", "Network Level Authentication"]
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return {
          icon: CheckCircle,
          description: "Port is accessible and responding to connections",
          security: "May expose services - review if necessary",
          color: "text-green-500"
        };
      case 'closed':
        return {
          icon: XCircle,
          description: "Port is not accepting connections",
          security: "Generally secure - service not exposed",
          color: "text-red-500"
        };
      case 'filtered':
        return {
          icon: AlertCircle,
          description: "Port is filtered by firewall or security device",
          security: "Good security practice - filtered access",
          color: "text-yellow-500"
        };
      default:
        return {
          icon: Info,
          description: "Unknown port status",
          security: "Status unclear",
          color: "text-muted-foreground"
        };
    }
  };

  const openPorts = results.filter(r => r.status === 'open');
  const closedPorts = results.filter(r => r.status === 'closed');
  const filteredPorts = results.filter(r => r.status === 'filtered');

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BookOpen className="w-5 h-5" />
          Educational Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ports">Port Details</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Open Ports</span>
                </div>
                <p className="text-2xl font-bold text-green-500">{openPorts.length}</p>
                <p className="text-sm text-muted-foreground">Services exposed</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium">Closed Ports</span>
                </div>
                <p className="text-2xl font-bold text-red-500">{closedPorts.length}</p>
                <p className="text-sm text-muted-foreground">Not responding</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Filtered</span>
                </div>
                <p className="text-2xl font-bold text-yellow-500">{filteredPorts.length}</p>
                <p className="text-sm text-muted-foreground">Firewall protected</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">What do these statuses mean?</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Open:</strong> The port is accepting connections and a service is running</p>
                <p><strong>Closed:</strong> The port is not accepting connections (no service running)</p>
                <p><strong>Filtered:</strong> A firewall or security device is blocking access</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ports" className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Port Information</h4>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {results.map((result, index) => {
                  const statusInfo = getStatusInfo(result.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 border border-border rounded cursor-pointer hover:bg-accent/50"
                      onClick={() => setSelectedPort(result.port)}
                    >
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        <span className="font-medium">Port {result.port}</span>
                        {result.service && (
                          <Badge variant="secondary">{result.service}</Badge>
                        )}
                      </div>
                      <Badge variant="outline">{result.status}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedPort && portEducation[selectedPort] && (
              <div className="space-y-3 border-t border-border pt-4">
                <h5 className="font-medium">Port {selectedPort} Details</h5>
                <div className="space-y-2 text-sm">
                  <p><strong>Description:</strong> {portEducation[selectedPort].description}</p>
                  <p><strong>Common Use:</strong> {portEducation[selectedPort].commonUse}</p>
                  <p><strong>Security Level:</strong> {portEducation[selectedPort].security}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Security Insights</h4>
              
              {openPorts.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-yellow-600">⚠️ Open Ports Detected</h5>
                  <p className="text-sm text-muted-foreground">
                    {openPorts.length} open port(s) found. Each open port represents a potential entry point.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {openPorts.slice(0, 5).map((port, index) => (
                      <Badge key={index} variant="outline">
                        {port.port} ({port.service || 'Unknown'})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-green-600">✅ Security Best Practices</h5>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Close unnecessary ports and services</li>
                  <li>• Use firewalls to filter traffic</li>
                  <li>• Keep services updated</li>
                  <li>• Monitor for suspicious activity</li>
                  <li>• Use strong authentication</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Recommendations</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                  <h5 className="text-sm font-medium text-blue-600">Network Security</h5>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Implement network segmentation</li>
                    <li>• Use intrusion detection systems</li>
                    <li>• Regular security audits</li>
                  </ul>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <h5 className="text-sm font-medium text-green-600">Service Hardening</h5>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Disable unused services</li>
                    <li>• Configure service-specific security</li>
                    <li>• Use principle of least privilege</li>
                  </ul>
                </div>

                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-md">
                  <h5 className="text-sm font-medium text-purple-600">Monitoring</h5>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Log and monitor port activity</li>
                    <li>• Set up alerting for suspicious scans</li>
                    <li>• Regular vulnerability assessments</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EducationalMode;