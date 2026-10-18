#!/usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';
import boxen from 'boxen';
import ora from 'ora';

import { getNetworkIp, isPortListening } from './network.js';
import { generateQrCode } from './qr.js';
import { startTunnel } from './tunnel.js';
import type { TunnelResult } from './types.js';

const program = new Command();

program
  .name('sharelocal')
  .description('⚡ Instantly share localhost with a mobile-friendly terminal QR code and zero-config public tunnels.')
  .version('1.0.0')
  .argument('[port]', 'Local port to share (e.g. 3000, 5173, 8080)', '3000')
  .option('-t, --tunnel', 'Create a public internet tunnel (HTTPS) to share outside local Wi-Fi')
  .option('--no-qr', 'Do not display QR code in terminal')
  .action(async (portArg: string, options) => {
    const port = parseInt(portArg, 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      console.log(pc.red(`✖ Invalid port number: ${portArg}`));
      process.exit(1);
    }

    console.log(
      boxen(
        `${pc.bold(pc.cyan('⚡ SHARELOCAL'))}\n${pc.gray('Test on mobile or share your localhost instantly.')}`,
        {
          padding: 1,
          margin: { top: 1, bottom: 1 },
          borderStyle: 'round',
          borderColor: 'cyan'
        }
      )
    );

    const isListening = await isPortListening(port);
    if (!isListening) {
      console.log(
        pc.yellow(`⚠️  Notice: Nothing appears to be listening on port ${pc.bold(port)} yet.\n   Start your dev server (e.g. npm run dev) so requests can load!`) + '\n'
      );
    }

    const networkIp = getNetworkIp();
    const localUrl = `http://localhost:${port}`;
    const networkUrl = networkIp ? `http://${networkIp}:${port}` : undefined;

    let tunnelResult: TunnelResult | undefined;
    let targetQrUrl = networkUrl || localUrl;

    if (options.tunnel) {
      const spinner = ora(pc.blue('Opening secure public tunnel...')).start();
      try {
        tunnelResult = await startTunnel(port);
        spinner.succeed(pc.green(`Public tunnel connected via ${pc.bold(tunnelResult.provider)}!`));
        targetQrUrl = tunnelResult.url;
      } catch (err: any) {
        spinner.warn(pc.yellow(`Could not establish public tunnel: ${err.message}`));
        console.log(pc.gray('Falling back to local Wi-Fi network sharing.\n'));
      }
    }

    // Render URLs
    const infoLines: string[] = [
      `${pc.bold('Local:')}    ${pc.cyan(localUrl)}`
    ];

    if (networkUrl) {
      infoLines.push(`${pc.bold('Network:')}  ${pc.bold(pc.green(networkUrl))} ${pc.dim('(same Wi-Fi)')}`);
    }

    if (tunnelResult) {
      infoLines.push(`${pc.bold('Public:')}   ${pc.bold(pc.magenta(tunnelResult.url))} ${pc.dim('(world-accessible)')}`);
    }

    console.log(
      boxen(infoLines.join('\n'), {
        padding: 1,
        borderColor: 'green',
        borderStyle: 'round'
      })
    );

    // Render QR Code
    if (options.qr) {
      console.log('\n' + pc.bold('📱 Scan with your phone camera to open instantly:'));
      const qrCode = await generateQrCode(targetQrUrl);
      console.log(qrCode);
      console.log(pc.dim(`QR Code pointing to: ${targetQrUrl}\n`));
    }

    if (!options.tunnel) {
      console.log(
        pc.dim(`Tip: Run with ${pc.cyan('sharelocal ' + port + ' --tunnel')} to get a public URL for people outside your Wi-Fi.`)
      );
    }

    console.log(pc.gray('Ready! Press Ctrl+C anytime to stop sharing.'));

    const cleanup = () => {
      if (tunnelResult) {
        tunnelResult.close();
      }
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  });

program.parse(process.argv);
