import path from 'path';
import { FileModel } from '../lib'
import { SpaceDoor } from './types';


const file = path.join(__dirname, 'space-time-continuum.js');
export const SpaceDoorModel = new FileModel<SpaceDoor>(file);
