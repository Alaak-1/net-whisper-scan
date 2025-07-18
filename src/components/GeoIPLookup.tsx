import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Flag, Building, Wifi, Shield } from 'lucide-react';

interface GeoIPInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  organization: string;
  latitude: number;
  longitude: number;
  timezone: string;
  asn: string;
}

interface GeoIPLookupProps {
  target: string;
}

const GeoIPLookup = ({ target }: GeoIPLookupProps) => {
  const [geoInfo, setGeoInfo] = useState<GeoIPInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performGeoLookup = async () => {
    if (!target) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call with realistic data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: GeoIPInfo = {
        ip: target.includes('.') ? target : '8.8.8.8',
        country: 'United States',
        region: 'California',
        city: 'Mountain View',
        isp: 'Google LLC',
        organization: 'Google Public DNS',
        latitude: 37.4056,
        longitude: -122.0775,
        timezone: 'America/Los_Angeles',
        asn: 'AS15169'
      };
      
      setGeoInfo(mockData);
    } catch (err) {
      setError('Failed to lookup GeoIP information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Globe className="w-5 h-5" />
          GeoIP Lookup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={performGeoLookup}
          disabled={!target || isLoading}
          className="w-full"
        >
          {isLoading ? 'Looking up...' : 'Lookup GeoIP Information'}
        </Button>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {geoInfo && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="text-sm">{geoInfo.city}, {geoInfo.region}</p>
                  <p className="text-sm text-muted-foreground">{geoInfo.country}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Coordinates</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm">{geoInfo.latitude}, {geoInfo.longitude}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">ISP</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm">{geoInfo.isp}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Organization</span>
                </div>
                <div className="pl-6">
                  <p className="text-sm">{geoInfo.organization}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">
                {geoInfo.timezone}
              </Badge>
              <Badge variant="outline">
                {geoInfo.asn}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeoIPLookup;