
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Download, Monitor, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PortResult } from '../pages/Index';

interface ScanResultsProps {
  results: PortResult[];
  isScanning: boolean;
  progress: number;
  currentPort: number | null;
}

const ScanResults = ({ results, isScanning, progress, currentPort }: ScanResultsProps) => {
  const openPorts = results.filter(r => r.status === 'open');
  const closedPorts = results.filter(r => r.status === 'closed');
  const filteredPorts = results.filter(r => r.status === 'filtered');

  const exportResults = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `port_scan_results_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'filtered':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'port-open';
      case 'closed':
        return 'port-closed';
      case 'filtered':
        return 'port-filtered';
      default:
        return '';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-primary">
            <Monitor className="w-6 h-6" />
            <span>Scan Results</span>
          </div>
          {results.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportResults}
              className="border-border hover:bg-accent/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Scanning progress...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {currentPort && (
              <div className="text-sm text-muted-foreground">
                Current port: <span className="text-accent font-mono">{currentPort}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-900/20 border border-green-500/30 rounded">
            <div className="text-2xl font-bold port-open">{openPorts.length}</div>
            <div className="text-sm text-muted-foreground">Open</div>
          </div>
          <div className="text-center p-3 bg-red-900/20 border border-red-500/30 rounded">
            <div className="text-2xl font-bold port-closed">{closedPorts.length}</div>
            <div className="text-sm text-muted-foreground">Closed</div>
          </div>
          <div className="text-center p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
            <div className="text-2xl font-bold port-filtered">{filteredPorts.length}</div>
            <div className="text-sm text-muted-foreground">Filtered</div>
          </div>
        </div>

        <ScrollArea className="h-96">
          <div className="space-y-2">
            {results.length === 0 && !isScanning && (
              <div className="text-center py-8 text-muted-foreground">
                No scan results yet. Configure and start a scan to see results.
              </div>
            )}
            
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary/30 border border-border rounded font-mono text-sm"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <span className="font-bold">Port {result.port}</span>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusClass(result.status)} border-current`}
                  >
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 text-right">
                  {result.service && (
                    <Badge variant="secondary" className="text-xs">
                      {result.service}
                    </Badge>
                  )}
                  {result.version && (
                    <span className="text-xs text-muted-foreground">
                      {result.version}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ScanResults;
