import { Server } from '../server.lib';


export type ServerConfig = { url: string, port: number };

export type ClusterConfig = { server: Server, config: ServerConfig }

export type ImportClusterConfig = () => ClusterConfig;

export type ClusterProcessSend = (message: ClusterMessage) => Boolean;

export enum ClusterMessage {
  WorkerStarted = 'worker_started',
};


