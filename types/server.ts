export interface ServerConfig {
  id: string;
  name: string;
  url: string;
}

export interface ServerStatus {
  success: boolean;
  message: string;
  timestamp: string;
  error?: string;
  serverId: string;
} 