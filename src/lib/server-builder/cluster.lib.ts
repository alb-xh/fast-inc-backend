import cluster, { Worker } from 'cluster';
import os from 'os';

import { ClusterConfig, ImportClusterConfig, ClusterMessage, ClusterProcessSend } from './types';


export class Cluster {
  private importClusterConfig: ImportClusterConfig

  constructor (importClusterConfig: ImportClusterConfig) {
    this.importClusterConfig = importClusterConfig;
  }

  private getNumberOfCpus (): number {
    return os.cpus().length;
  }

  private getWorkers (): Worker[] {
    const workers = cluster.workers ? Object.values(cluster.workers) : [];
    return workers as Worker[];
  }

  private sendMessage (message: ClusterMessage): Boolean {
    return (process.send as ClusterProcessSend)(message);
  }

  private async listenForMessage (worker: Worker, message: ClusterMessage, timeout?: number): Promise<void> {
    const listenFor = (expectedMessage: ClusterMessage) => new Promise<void>((resolve, reject) => {
      if (timeout) setTimeout(reject, timeout);

      worker.on('message', (incomingMessage: ClusterMessage) => {
        if (expectedMessage === incomingMessage) resolve();
      });
    });

    await listenFor(message);
  }

  private async startWorker (): Promise<void> {
    const createWorker = async () => {
      const timeout = 30 * 1000;
      const worker = cluster.fork();
      await this.listenForMessage(worker, ClusterMessage.WorkerStarted, timeout);
    };

    try {
      await createWorker();
    } catch (error) {
      console.log(error);
    }
  }

  private stopWorker (worker: Worker): void {
    // Server should hanlde this signal and close gracefully
    worker.process.kill('SIGTERM');
  }

  private async restartCluster (): Promise<void> {
    console.log('\nRestarting cluster...\n');

    const workers = this.getWorkers();

    for (let worker of workers) {
      this.stopWorker(worker);
      await this.startWorker();
    }

    console.log(`\n${workers.length} workers restarted!\n`);
  }

  private setWorkerRestartListener (): void {
    const exitEvent = 'exit';

    cluster.on(exitEvent, async (worker, code) => {
      const isCausedByError = code !== 0;
      const isNotDeliberatelyDisconnected = !worker.exitedAfterDisconnect;

      if (isCausedByError && isNotDeliberatelyDisconnected) {
        console.log(`\nWorker ${worker.id} crashed. Starting a new worker...\n`);
        await this.startWorker();
      }
    });
  }

  private getClusterConfig (): ClusterConfig {
    const { server, config } = this.importClusterConfig();
    return { server, config };
  }

  private async setWorkerNode (): Promise<void> {
    const { server, config } = this.getClusterConfig();
    const { url, port } = config;

    await server.listen(url, port);
    this.sendMessage(ClusterMessage.WorkerStarted);
  }

  private setClusterRestartListener (): void {
    const restartSignal = 'SIGUSR2';

    process.on(restartSignal, () => {
      this.restartCluster();
    });
  };

  private async setPrimaryNode (): Promise<void> {
    console.log(`Primary node process id: ${process.pid}\n`);

    const cpus = this.getNumberOfCpus();
    const workers = [ ...Array(cpus) ]
      .map(() => this.startWorker());

    this.setWorkerRestartListener();
    this.setClusterRestartListener();

    await Promise.all(workers);

    console.log(`\nWorkers started: ${workers.length}\n`);
  }

  async init (): Promise<void> {
    if (cluster.isPrimary) await this.setPrimaryNode();
    else await this.setWorkerNode();
  }
}