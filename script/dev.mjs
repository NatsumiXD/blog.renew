import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, closeSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const stateDir = join(root, '.dev-server');
const pidFile = join(stateDir, 'pid');
const logFile = join(stateDir, 'dev.log');
const action = process.argv[2] ?? 'start';
const allowed = ['start', 'background', 'stop', 'status', 'logs'];
if (!allowed.includes(action) || process.argv.length > 3) {
  console.error('Usage: rundev [start|background|stop|status|logs]');
  process.exit(1);
}

function runningPid() {
  if (!existsSync(pidFile)) return null;
  const pid = Number(readFileSync(pidFile, 'utf8').trim());
  if (!Number.isSafeInteger(pid) || pid <= 0) throw new Error('Invalid dev server PID file.');
  try { process.kill(pid, 0); return pid; }
  catch (error) {
    if (error.code !== 'ESRCH') throw error;
    unlinkSync(pidFile);
    return null;
  }
}

if (action === 'start') {
  const pid = runningPid();
  if (pid) {
    console.error(`Background server already running (PID ${pid}). Run rundev stop first.`);
    process.exit(1);
  }
  const astro = join(root, 'node_modules', 'astro', 'astro.js');
  if (!existsSync(astro)) throw new Error('Dependencies missing. Run the install script first.');
  const child = spawn(process.execPath, [astro, 'dev'], {
    cwd: root, stdio: 'inherit',
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => { child.kill(signal); });
  }
  child.on('error', error => { console.error(error.message); process.exitCode = 1; });
  child.on('exit', (code, signal) => {
    process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1);
  });
} else if (action === 'logs') {
  console.log(existsSync(logFile) ? readFileSync(logFile, 'utf8') : 'No dev server logs yet.');
} else {
  const pid = runningPid();
  if (action === 'status') {
    console.log(pid ? `Dev server process running (PID ${pid}). Logs: ${logFile}` : 'Dev server stopped.');
  } else if (action === 'stop') {
    if (pid) { process.kill(pid); unlinkSync(pidFile); }
    console.log('Dev server stopped.');
  } else if (pid) {
    console.log(`Dev server already running (PID ${pid}).`);
  } else {
    const astro = join(root, 'node_modules', 'astro', 'astro.js');
    if (!existsSync(astro)) throw new Error('Dependencies missing. Run the install script first.');
    mkdirSync(stateDir, { recursive: true });
    const output = openSync(logFile, 'a');
    // Astro 5 ignores --background, so detach the process to provide background mode.
    const child = spawn(process.execPath, [astro, 'dev', '--background'], {
      cwd: root, detached: true, windowsHide: true, stdio: ['ignore', output, output],
    });
    closeSync(output);
    await new Promise((resolve, reject) => { child.once('spawn', resolve); child.once('error', reject); });
    writeFileSync(pidFile, String(child.pid));
    child.unref();
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (!runningPid()) throw new Error(`Dev server failed to start. See ${logFile}`);
    console.log(`Dev server started in background (PID ${child.pid}). See logs for its URL: ${logFile}`);
  }
}
