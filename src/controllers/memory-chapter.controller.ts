import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Chapter, Memory
} from '../models';
import {MemoryRepository} from '../repositories';

@authenticate('jwt')
export class MemoryChapterController {
  constructor(
    @repository(MemoryRepository) protected memoryRepository: MemoryRepository,
  ) { }

  @get('/memories/{id}/chapters', {
    responses: {
      '200': {
        description: 'Array of Memory has many Chapter',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Chapter)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Chapter>,
  ): Promise<Chapter[]> {
    return this.memoryRepository.chapters(id).find(filter);
  }

  @post('/memories/{id}/chapters', {
    responses: {
      '200': {
        description: 'Memory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Chapter)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Memory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Chapter, {
            title: 'NewChapterInMemory',
            exclude: ['id'],
            optional: ['memoryId']
          }),
        },
      },
    }) chapter: Omit<Chapter, 'id'>,
  ): Promise<Chapter> {
    return this.memoryRepository.chapters(id).create(chapter);
  }

  @patch('/memories/{id}/chapters', {
    responses: {
      '200': {
        description: 'Memory.Chapter PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Chapter, {partial: true}),
        },
      },
    })
    chapter: Partial<Chapter>,
    @param.query.object('where', getWhereSchemaFor(Chapter)) where?: Where<Chapter>,
  ): Promise<Count> {
    return this.memoryRepository.chapters(id).patch(chapter, where);
  }

  @del('/memories/{id}/chapters', {
    responses: {
      '200': {
        description: 'Memory.Chapter DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Chapter)) where?: Where<Chapter>,
  ): Promise<Count> {
    return this.memoryRepository.chapters(id).delete(where);
  }
}
