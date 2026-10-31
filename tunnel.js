// tunnel.js - Robust public SSH tunnel with auto-reconnect for EXAMVERSE
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let publicUrl = null;
let reconnectTimer = null;

function startTunnel() {
  console.log('[EXAMVERSE Tunnel] Connecting public host tunnel via localhost.run...');

  const ssh = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=20',
    '-o', 'ServerAliveCountMax=3',
    '-o', 'ExitOnForwardFailure=yes',
    '-R', '80:localhost:5000',
    'nokey@localhost.run'
  ]);

  ssh.stdout.on('data', (data) => {
    const text = data.toString();

    // Extract https://*.lhr.life URL
    const match = text.match(/https:\/\/[a-zA-Z0-9.-]+\.lhr\.life/);
    if (match && match[0] !== publicUrl) {
      publicUrl = match[0];
      console.log('\n============================================================');
      console.log(`🌐 EXAMVERSE IS NOW LIVE PUBLICLY AT:`);
      console.log(`   ${publicUrl}`);
      console.log('============================================================\n');
      fs.writeFileSync(path.join(__dirname, 'public_url.txt'), publicUrl, 'utf-8');
    }
  });

  ssh.stderr.on('data', (data) => {
    const text = data.toString();
    if (!text.includes('Welcome to localhost.run') && !text.includes('Pseudo-terminal')) {
      console.log('[tunnel stderr]', text.trim());
    }
  });

  ssh.on('close', (code) => {
    console.log(`[EXAMVERSE Tunnel] Process closed with code ${code}. Reconnecting in 3s...`);
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        startTunnel();
      }, 3000);
    }
  });

  ssh.on('error', (err) => {
    console.error('[EXAMVERSE Tunnel] Process error:', err.message);
  });
}

startTunnel();
