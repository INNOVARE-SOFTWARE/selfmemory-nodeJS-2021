import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Memory, MemoryRelations, Chapter} from '../models';
import {MongoDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ChapterRepository} from './chapter.repository';

export class MemoryRepository extends DefaultCrudRepository<
  Memory,
  typeof Memory.prototype.id,
  MemoryRelations
> {

  public readonly chapters: HasManyRepositoryFactory<Chapter, typeof Memory.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource, @repository.getter('ChapterRepository') protected chapterRepositoryGetter: Getter<ChapterRepository>,
  ) {
    super(Memory, dataSource);
    this.chapters = this.createHasManyRepositoryFactoryFor('chapters', chapterRepositoryGetter,);
    this.registerInclusionResolver('chapters', this.chapters.inclusionResolver);
  }
}
