
export type SqlConnection = { host: string };

export type FileConnection = { file: string };

export type Connection = SqlConnection | FileConnection;
