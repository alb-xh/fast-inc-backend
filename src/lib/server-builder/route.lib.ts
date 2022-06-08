import { MethodControllerHash, RouteMethod, ControllerHandler } from './types';
import { Controller } from './controller.lib';


export class Route {
  public readonly path: string;
  private methodCotrollerHash: MethodControllerHash = {};

  constructor (path: string) {
    this.path = path;
  }

  private setController (method: RouteMethod, controller: Controller): Route {
    this.methodCotrollerHash[method] = controller;
    return this;
  }

  get actions (): [ RouteMethod, ControllerHandler ][] {
    const actions = Object.entries(this.methodCotrollerHash) as [ RouteMethod, Controller ][];
    return actions
      .map(([ method, controller ]) => [ method, controller.get() ]);
  }

  get (controller: Controller): Route {
    return this.setController(RouteMethod.Get, controller);
  }

  post (controller: Controller): Route {
    return this.setController(RouteMethod.Post, controller);
  }

  put (controller: Controller): Route {
    return this.setController(RouteMethod.Put, controller);
  }

  delete (controller: Controller): Route {
    return this.setController(RouteMethod.Delete, controller);
  }
}