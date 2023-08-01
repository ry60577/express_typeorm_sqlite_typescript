import { DataSource, DataSourceOptions } from 'typeorm';

// const options: DataSourceOptions = {
//   type: 'sqlite',
//   database: './database/nodeDB',
//   synchronize: true, // option for migrate
//   logging: false,
//   entities: ['dist/entity/*.js'],
//   subscribers: [],
// };

const options: DataSourceOptions = {
  type: 'sqlite',
  database: './database/nodeDB',
  driver: {
    type: 'sqlite',
    storage: 'database/nodeDB.db',
  },
  synchronize: true, // option for migrate
  logging: false,
  entities: ['dist/entity/*.js'],
  subscribers: [],
};

export const dataSource = new DataSource(options);

export const repository = (entity: any) => dataSource.getRepository(entity);
