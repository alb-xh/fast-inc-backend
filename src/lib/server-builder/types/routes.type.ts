import { Controller } from '../controller.lib';

export enum RouteMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
};

export type MethodControllerHash = { [key in RouteMethod]?: Controller };