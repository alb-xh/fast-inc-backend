import http from 'http';
import https from 'https';


export type ServerLibrary = typeof http | typeof https;

export type ServerType = http.Server | https.Server;