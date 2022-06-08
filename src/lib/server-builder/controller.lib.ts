import { ControllerHandler } from './types';


export class Controller {
  private handler: ControllerHandler;

  constructor (handler: ControllerHandler) {
    this.handler = handler;
  }

  set (handler: ControllerHandler): void {
    this.handler = handler;
  }

  get (): ControllerHandler {
    return this.handler;
  }
}
