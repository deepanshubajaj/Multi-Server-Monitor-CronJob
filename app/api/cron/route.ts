import { NextResponse } from 'next/server';
import type { ServerConfig, ServerStatus } from '../../../types/server';

// Configure your servers here or load from environment variables
const SERVERS: ServerConfig[] = [
  {
    id: 'server-1',
    name: 'GeekyShop Backend',
    url: process.env.SERVER_URL_1 as string
  },
  {
    id: 'server-2',
    name: 'ContactForm Backend',
    url: process.env.SERVER_URL_2 as string
  },
  {
    id: 'server-3',
    name: 'SecretVault Backend',
    url: process.env.SERVER_URL_3 as string
  }
];

export const runtime = 'edge';

async function pingServer(server: ServerConfig): Promise<ServerStatus> {
  try {
    const response = await fetch(server.url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    const text = await response.text();

    if (response.ok) {
      return {
        success: true,
        message: `Server is running: ${text}`,
        timestamp: new Date().toISOString(),
        serverId: server.id
      };
    }

    return {
      success: false,
      message: 'Server returned an error',
      error: `HTTP ${response.status}: ${text}`,
      timestamp: new Date().toISOString(),
      serverId: server.id
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to server',
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