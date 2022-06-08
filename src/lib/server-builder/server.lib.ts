import http from 'http';
import https from 'https';
import { URL } from 'url';
import { App } from './app.lib';
import { ServerLibrary, ServerType } from './types'


export class Server {
  private app: App;

  constructor (app: App) {
    this.app = app;
  }

  private getServerLibrary (protocol: string): ServerLibrary {
    const httpProtocol = 'http:';
    const httpsProtocol = 'https:';

    if (protocol === httpProtocol) return http;
    if (protocol === httpsProtocol) return https;

    throw new Error('Invalid protocol!');
  }

  private getServer (protocol: string): ServerType {
    const serverLibrary = this.getServerLibrary(protocol);
    const server = serverLibrary.createServer(this.app.get());

    return server;
  }

  private async stopServer (server: ServerType): Promise<void> {
    const closeServer = () => new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        resolve();
      });
    });

    try {
      await closeServer();
    } catch (error) {
      throw error;
    }
  }

  private addStopListeners (server: ServerType): void {
    const onProcessSignals = (signals: string[], cb: (...args: any[]) => void) => {
      signals.forEach((signal) => {
        process.once(signal, cb);
      });
    };

    const TERMINATE_SIGNALS = [ 'SIGINT', 'SIGTERM' ];
    onProcessSignals(TERMINATE_SIGNALS, async () => {
      try {
        await this.stopServer(server);
        console.log('Server stopped!');

        process.exit(0);
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    });
  }

  async listen (url: string, port: number): Promise<void> {
    const { protocol, hostname } = new URL(url);

    const server = this.getServer(protocol);
    this.addStopListeners(server);

    const startServer = () => new Promise<void>((resolve, reject) => {
      const timeout = 30 * 1000;
      setTimeout(reject, timeout);

      server.listen(port, hostname, resolve);
    });

    await startServer();
    console.log(`Server started at ${url}:${port}`);
  }
}
