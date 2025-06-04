'use client';

import { useState, useEffect } from 'react';
import type { ServerConfig, ServerStatus } from '../types/server';

export default function Home() {
  const [serverData, setServerData] = useState<{
    servers: ServerConfig[];
    statuses: ServerStatus[];
    timestamp: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkServersStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cron');
      const data = await response.json();
      setServerData(data);
    } catch (error) {
      console.error('Failed to check servers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServersStatus();
    // Check status every minute
    const interval = setInterval(checkServersStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getServerStatus = (serverId: string) => {
    return serverData?.statuses.find(status => status.serverId === serverId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Multi-Server Monitor
        </h1>
        
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Status Monitor</h2>
            <button
              onClick={checkServersStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check All Servers'}
            </button>
          </div>

          {serverData ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {serverData.servers.map((server) => {
                const status = getServerStatus(server.id);
                return (
                  <div key={server.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{server.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${status?.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300 break-all">
                        <span className="font-semibold">URL:</span> {server.url}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-semibold">Status:</span> {status?.message}
                      </p>
                      {status?.error && (
                        <p className="text-sm text-red-400">
                          <span className="font-semibold">Error:</span> {status.error}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold">Last Check:</span>{' '}
                        {status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading servers status...</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-700 rounded-md">
            <h3 className="text-white font-semibold mb-2">Cron Schedule</h3>
            <p className="text-gray-300">All servers are pinged every day at 1:00 AM.</p>
            <code className="block mt-2 text-sm bg-gray-800 p-2 rounded text-green-400">
              0 1 * * *
            </code>
          </div>
        </div>
      </div>
    </main>
  );
} 