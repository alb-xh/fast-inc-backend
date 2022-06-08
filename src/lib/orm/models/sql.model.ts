import { IModel } from '../types';


export class SqlModel<T> implements IModel<T> {
  private tableName: string;
  private host: string;

  constructor (tableName: string, host: string) {
    this.tableName = tableName;
    this.host = host;
  }

  async find (filter: Partial<T>): Promise<T[]> {
    return [];
  }

  async create (newEntry: T): Promise<void> {}

  async update (filter: Partial<T>, update: Partial<T>): Promise<void> {}

  async delete (filter: Partial<T>): Promise<void> {}
}
