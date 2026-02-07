'use client';

import { useState, useEffect } from 'react';
import { log } from '@/lib/logger';

export default function DebugPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>('all');

    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    useEffect(() => {
        if (isOpen) {
            const interval = setInterval(() => {
                setLogs(log.getRecent(100));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const filteredLogs = logs.filter(logEntry =>
        filter === 'all' || logEntry.level === filter
    );

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg"
                title="Debug Panel"
            >
                🐛
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 z-50 w-96 h-96 bg-black/90 text-white rounded-lg shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold">Debug Console</h3>
                        <div className="flex gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="text-xs bg-gray-800 rounded px-2 py-1"
                            >
                                <option value="all">All</option>
                                <option value="debug">Debug</option>
                                <option value="info">Info</option>
                                <option value="warn">Warn</option>
                                <option value="error">Error</option>
                            </select>
                            <button
                                onClick={() => log.clear()}
                                className="text-xs bg-red-600 hover:bg-red-700 rounded px-2 py-1"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => {
                                    const data = log.export();
                                    const blob = new Blob([data], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `bitroute-logs-${Date.now()}.json`;
                                    a.click();
                                }}
                                className="text-xs bg-blue-600 hover:bg-blue-700 rounded px-2 py-1"
                            >
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1">
                        {filteredLogs.length === 0 && (
                            <div className="text-gray-500 text-center py-8">
                                No logs yet
                            </div>
                        )}
                        {filteredLogs.map((entry, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded ${entry.level === 'error' ? 'bg-red-900/30' :
                                        entry.level === 'warn' ? 'bg-yellow-900/30' :
                                            entry.level === 'info' ? 'bg-blue-900/30' :
                                                'bg-gray-800/30'
                                    }`}
                            >
                                <div className="flex gap-2 items-start">
                                    <span className={`font-bold ${entry.level === 'error' ? 'text-red-400' :
                                            entry.level === 'warn' ? 'text-yellow-400' :
                                                entry.level === 'info' ? 'text-blue-400' :
                                                    'text-gray-400'
                                        }`}>
                                        {entry.level.toUpperCase()}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        {new Date(entry.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="mt-1">{entry.message}</div>
                                {entry.context && (
                                    <details className="mt-1">
                                        <summary className="cursor-pointer text-gray-400">Context</summary>
                                        <pre className="mt-1 text-xs text-gray-300 overflow-x-auto">
                                            {JSON.stringify(entry.context, null, 2)}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
