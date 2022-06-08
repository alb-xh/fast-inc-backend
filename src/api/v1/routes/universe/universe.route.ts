import { getUniverseController } from './get-universe.controller';
import { Route } from '../../../../lib';


export const universeRoute = new Route('/universe')
  .get(getUniverseController);
