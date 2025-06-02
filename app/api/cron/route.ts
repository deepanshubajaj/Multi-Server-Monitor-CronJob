import { NextResponse } from 'next/server';
import type { ServerConfig, ServerStatus } from '../../../types/server';

// Configure your servers here or load from environment variables
const SERVERS: ServerConfig[] = [
  {
    id: 'server1',
    name: 'Server-1',
    url: process.env.SERVER_URL_1 || 'https://your-production-server.com'
  },
  {
    id: 'server2',
    name: 'Server-2',
    url: process.env.SERVER_URL_2 || 'https://your-staging-server.com'
  },
  {
    id: 'server3',
    name: 'Server-3',
    url: process.env.SERVER_URL_3 || 'https://your-development-server.com'
  }
];

export const runtime = 'edge';

async function pingServer(server: ServerConfig): Promise<ServerStatus> {
  try {
    const response = await fetch(server.url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    
    return {
      success: true,
      message: 'Server pinged successfully',
      timestamp: new Date().toISOString(),
      serverId: server.id
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to ping server',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      serverId: server.id
    };
  }
}

export async function GET() {
  try {
    // Ping all servers concurrently
    const results = await Promise.all(SERVERS.map(server => pingServer(server)));
    
    return NextResponse.json({
      servers: SERVERS,
      statuses: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to check servers',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 