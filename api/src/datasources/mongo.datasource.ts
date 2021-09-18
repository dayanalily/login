import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  // name: 'mongo',
  // connector: 'mongodb',
  // url: 'mongodb://localhost:27017/visorrecurso',
  // host: 'localhost',
  // port: 27017,
  // user: '',
  // password: '',
  // database: 'visorrecurso',
  // useNewUrlParser: true
  name: 'mongo',
  connector: 'mongodb',
  url: process.env.BDD_URI,
  host: process.env.BDD_HOST,
  port: process.env.BDD_PORT,
  user: process.env.BDD_USER,
  roles: [{ role: "userAdminAnyDatabase", db: "ecomerce" }],
  password: process.env.BDD_PWD,
  database: process.env.BDD_DATABASE,
  useNewUrlParser: true
};



// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongo', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
