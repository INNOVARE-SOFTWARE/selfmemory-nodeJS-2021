import {DefaultCrudRepository} from '@loopback/repository';
import {Config, ConfigRelations} from '../models';
import {MongoDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ConfigRepository extends DefaultCrudRepository<
  Config,
  typeof Config.prototype.id,
  ConfigRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Config, dataSource);
  }
}
