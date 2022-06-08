import { Cluster } from '../lib';


export const cluster = new Cluster(() => {
  const { server } = require('./server');
  const { url, port } = require('../../config/default.json');

  return {
    server,
    config: {
      url,
      port,
    },
  };
});
