export interface ShareConfig {
  port: number;
  localUrl: string;
  networkUrl?: string;
  tunnelUrl?: string;
  showQr: boolean;
  enableTunnel: boolean;
}

export interface TunnelResult {
  url: string;
  provider: 'cloudflare' | 'localhost.run' | 'pinggy';
  close: () => void;
}
