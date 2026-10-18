import { spawn } from 'node:child_process';
import type { TunnelResult } from './types.js';

export function startTunnel(port: number, timeoutMs: number = 10000): Promise<TunnelResult> {
  return new Promise((resolve, reject) => {
    let resolved = false;

    // Use OpenSSH reverse tunnel to localhost.run
    const sshProcess = spawn(
      'ssh',
      [
        '-R',
        `80:127.0.0.1:${port}`,
        'nokey@localhost.run',
        '-o',
        'StrictHostKeyChecking=no',
        '-o',
        'UserKnownHostsFile=/dev/null',
        '-o',
        'ServerAliveInterval=30'
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try {
          sshProcess.kill('SIGTERM');
        } catch {}
        reject(new Error('Tunnel connection timed out. Check your internet connection.'));
      }
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timeout);
      try {
        sshProcess.kill('SIGTERM');
      } catch {}
    };

    const handleOutput = (data: Buffer) => {
      const text = data.toString();
      const urlMatch = text.match(/https:\/\/[a-zA-Z0-9.-]+\.localhost\.run/);
      if (urlMatch && !resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({
          url: urlMatch[0],
          provider: 'localhost.run',
          close: cleanup
        });
      }
    };

    sshProcess.stdout?.on('data', handleOutput);
    sshProcess.stderr?.on('data', handleOutput);

    sshProcess.on('error', (err: Error) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(err);
      }
    });

    sshProcess.on('exit', (code: number | null) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(new Error(`Tunnel process exited with code ${code}`));
      }
    });
  });
}
