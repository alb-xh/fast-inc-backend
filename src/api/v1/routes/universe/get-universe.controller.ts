import { Controller } from '../../../../lib';
import { SpaceDoorModel } from '../../../../models';


export const getUniverseController = new Controller(async (req, res) => {
  console.log('HEY');
  const spaceDoors = await SpaceDoorModel.find({});
  res.send(spaceDoors);
});
