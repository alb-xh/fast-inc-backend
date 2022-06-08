import express from 'express';
import { AppType } from './types'
import { Route } from './route.lib';


export class App {
  private app: AppType;

  constructor (routes?: Route[]) {
    this.app = express();
    if (routes) this.setRoutes(routes);
  }

  setRoute (route: Route): void {
    const { path, actions } = route;

    const newRoute = this.app.route(path);
    actions.forEach(([ method, handler ]) => {
      newRoute[method](handler);
    });
  }

  setRoutes (routes: Route[]): void {
    routes.forEach((route) => {
      this.setRoute(route);
    });
  }

  get (): AppType {
    return this.app;
  }

  use (path: string, app: App): App {
    this.app.use(path, app.get());
    return this;
  }
};
