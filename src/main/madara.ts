import { ChildProcessWithoutNullStreams, spawn, fork } from 'child_process';
import { BrowserWindow, app } from 'electron';
import { download } from 'electron-dl';
import fs from 'fs';

const MADARA_ROOT_FOLDER = '.madara-app';
const RELEASES_FOLDER = `${app.getPath('home')}/${MADARA_ROOT_FOLDER}/releases`;

// TODO: update this once we have binary releases on Madara
const GIT_RELEASE_BASE_PATH =
  'https://raw.githubusercontent.com/apoorvsadana/madara-app/main/config/releases';

export type MadaraConfig = {
  git_tag: string;
  name?: string;
};

export function releaseExists(config: MadaraConfig): boolean {
  const fileDir = RELEASES_FOLDER;
  return fs.existsSync(`${fileDir}/${config.git_tag}`);
}

export async function setup(window: BrowserWindow, config: MadaraConfig) {
  if (releaseExists(config)) {
    return;
  }

  await download(window, `${GIT_RELEASE_BASE_PATH}/${config.git_tag}`, {
    directory: RELEASES_FOLDER,
    onProgress: (progress) => {
      window.webContents.send('download-progress', progress);
    },
  });
}

// this is a global variable that stores the latest childProcess
let childProcess: ChildProcessWithoutNullStreams | undefined;
export async function start(window: BrowserWindow, config: MadaraConfig) {
  if (childProcess !== undefined) {
    // we already have node running, it must be killed before we start a new one
    throw Error('Node is already running!');
  }

  const args = [
    '--testnet',
    'sharingan',
    '--telemetry-url',
    'wss://telemetry.madara.zone/submit 0',
  ];
  if (config.name) {
    args.push('--name');
    args.push(config.name);
  }
  childProcess = spawn(`${RELEASES_FOLDER}/${config.git_tag}`, args);

  // BY DEFAULT SUBSTRATE LOGS TO STDERR SO WE USE THIS
  childProcess.stderr.on('data', (data) => {
    window.webContents.send('node-logs', data.toString());
  });

  // Update the react state when the node is stopped
  childProcess.on('close', () => {
    try {
      window.webContents.send('node-stop');
    } catch (err) {
      // if the user has closed the window then this emit won't work and it throws an error dialog, hence try catch
    }
  });
}

export async function stop() {
  // stop the child process
  if (!childProcess) {
    throw Error('No child process is running!');
  }
  childProcess.kill();
  childProcess = undefined;
}

export function childProcessInMemory(): boolean {
  return childProcess !== undefined;
}
