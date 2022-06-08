import fs from 'fs/promises';
import { IModel } from '../types';


export class FileModel<T> implements IModel<T> {
  private file: string;

  constructor (file: string) {
    this.file = file;
  }

  private async readData (): Promise<T[]> {
    const file = await fs.readFile(this.file);
    const data = JSON.parse(file.toString()) as T[];

    return data;
  }

  private async writeData (data: T[]): Promise<void> {
    const str = JSON.stringify(data);
    await fs.writeFile(this.file, str);
  }

  protected isMatch (entry: T, filter: Partial<T>): Boolean {
    return Object.keys(filter)
       .every((key) =>
         filter[key as keyof T] === entry[key as keyof T]
       );
   }

  protected findMatches (data: T[], filter: Partial<T>): T[] {
    return data.filter((entry: T) => this.isMatch(entry, filter));
  }

  protected updateMatches (data: T[], filter: Partial<T>, update: Partial<T>): T[] {
    return data.map((entry: T) => (
      this.isMatch(entry, filter) ? { ...entry, ...update } : entry
    ));
  }

  protected deleteMatches (data: T[], filter: Partial<T>): T[] {
    return data.filter((entry: T) => !this.isMatch(entry, filter));
  }

  async find (filter: Partial<T>): Promise<T[]> {
    const data = await this.readData();
    return this.findMatches(data, filter);
  }

  async create (newEntry: T): Promise<void> {
    const data = await this.readData();
    data.push(newEntry);

    await this.writeData(data);
  }

  async update (filter: Partial<T>, update: Partial<T>): Promise<void> {
    const data = await this.readData();

    const newData = this.updateMatches(data, filter, update);

    await this.writeData(newData);
  }

  async delete (filter: Partial<T>): Promise<void> {
    const data = await this.readData();

    const newData = this.deleteMatches(data, filter);

    await this.writeData(newData);
  }
}