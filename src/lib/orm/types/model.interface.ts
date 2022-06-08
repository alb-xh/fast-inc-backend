
export interface IModel<T> {
  find (filter: Partial<T>): Promise<T[]>;

  create (newEntry: T): Promise<void>;

  update (filter: Partial<T>, update: Partial<T>): Promise<void>

  delete (entry: Partial<T>): Promise<void>;
};
