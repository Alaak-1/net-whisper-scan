
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, Settings } from 'lucide-react';
import { ScanConfig } from '../pages/Index';
import VoiceRecorder from './VoiceRecorder';

interface ScannerInterfaceProps {
  onStartScan: (config: ScanConfig) => void;
  isScanning: boolean;
}

const ScannerInterface = ({ onStartScan, isScanning }: ScannerInterfaceProps) => {
  const [config, setConfig] = useState<ScanConfig>({
    target: '192.168.1.1',
    portRange: '1-1000',
    scanType: 'tcp',
    timeout: 1000
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartScan(config);
  };

  const presetRanges = [
    { label: 'Top 100 Ports', value: '1-100' },
    { label: 'Top 1000 Ports', value: '1-1000' },
    { label: 'All Ports', value: '1-65535' },
    { label: 'Web Ports', value: '80,443,8080,8443' },
    { label: 'Common Services', value: '21,22,23,25,53,80,110,143,443,993,995' }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Settings className="w-6 h-6" />
          <span>Scan Configuration</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="target" className="text-foreground">Target Host</Label>
            <div className="flex space-x-2">
              <Input
                id="target"
                type="text"
                value={config.target}
                onChange={(e) => setConfig({ ...config, target: e.target.value })}
                placeholder="192.168.1.1 or example.com"
                className="bg-input border-border text-foreground font-mono flex-1"
                disabled={isScanning}
              />
              <VoiceRecorder 
                onTranscript={(text) => setConfig({ ...config, target: text.trim() })}
                className="shrink-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portRange" className="text-foreground">Port Range</Label>
            <Input
              id="portRange"
              type="text"
              value={config.portRange}
              onChange={(e) => setConfig({ ...config, portRange: e.target.value })}
              placeholder="1-1000 or 80,443,8080"
              className="bg-input border-border text-foreground font-mono"
              disabled={isScanning}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {presetRanges.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConfig({ ...config, portRange: preset.value })}
                  disabled={isScanning}
                  className="text-xs border-border hover:bg-accent/10"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scanType" className="text-foreground">Scan Type</Label>
            <Select 
              value={config.scanType} 
              onValueChange={(value) => setConfig({ ...config, scanType: value })}
              disabled={isScanning}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="tcp">TCP Connect Scan</SelectItem>
                <SelectItem value="syn">SYN Stealth Scan</SelectItem>
                <SelectItem value="udp">UDP Scan</SelectItem>
                <SelectItem value="fin">FIN Scan</SelectItem>
                <SelectItem value="xmas">XMAS Scan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeout" className="text-foreground">Timeout (ms)</Label>
            <Input
              id="timeout"
              type="number"
              value={config.timeout}
              onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
              min="100"
              max="10000"
              step="100"
              className="bg-input border-border text-foreground font-mono"
              disabled={isScanning}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground terminal-glow"
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Scanning... (Stop)
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Scan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScannerInterface;
