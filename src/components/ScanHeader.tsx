
import { Shield, Terminal, Wifi } from 'lucide-react';

const ScanHeader = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <Shield className="w-12 h-12 text-primary terminal-glow" />
        <Terminal className="w-12 h-12 text-accent terminal-glow" />
        <Wifi className="w-12 h-12 text-primary terminal-glow" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold terminal-glow bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        NetWhisper Scanner
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Advanced Network Port Scanner • Penetration Testing Tool • Security Audit
      </p>
      
      <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span>TCP/UDP Scanning</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span>Service Detection</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span>Real-time Results</span>
        </div>
      </div>
    </div>
  );
};

export default ScanHeader;
