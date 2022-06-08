import { App } from '../lib';
import { v1App } from './v1';



export const app = new App()
  .use('/v1', v1App);
