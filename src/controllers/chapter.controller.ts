import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import {Chapter} from '../models';
import {ChapterRepository} from '../repositories';

@authenticate('jwt')
export class ChapterController {
  constructor(
    @repository(ChapterRepository)
    public chapterRepository: ChapterRepository,
  ) { }

  @post('/chapters', {
    responses: {
      '200': {
        description: 'Chapter model instance',
        content: {'application/json': {schema: getModelSchemaRef(Chapter)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Chapter, {
            title: 'NewChapter',
            exclude: ['id'],
          }),
        },
      },
    })
    chapter: Omit<Chapter, 'id'>,
  ): Promise<Chapter> {
    return this.chapterRepository.create(chapter);
  }

  @get('/chapters/count', {
    responses: {
      '200': {
        description: 'Chapter model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Chapter) where?: Where<Chapter>,
  ): Promise<Count> {
    return this.chapterRepository.count(where);
  }

  @get('/chapters', {
    responses: {
      '200': {
        description: 'Array of Chapter model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Chapter, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Chapter) filter?: Filter<Chapter>,
  ): Promise<Chapter[]> {
    return this.chapterRepository.find(filter);
  }

  @patch('/chapters', {
    responses: {
      '200': {
        description: 'Chapter PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Chapter, {partial: true}),
        },
      },
    })
    chapter: Chapter,
    @param.where(Chapter) where?: Where<Chapter>,
  ): Promise<Count> {
    return this.chapterRepository.updateAll(chapter, where);
  }

  @get('/chapters/{id}', {
    responses: {
      '200': {
        description: 'Chapter model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Chapter, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Chapter, {exclude: 'where'}) filter?: FilterExcludingWhere<Chapter>
  ): Promise<Chapter> {
    return this.chapterRepository.findById(id, filter);
  }

  @patch('/chapters/{id}', {
    responses: {
      '204': {
        description: 'Chapter PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Chapter, {partial: true}),
        },
      },
    })
    chapter: Chapter,
  ): Promise<void> {
    await this.chapterRepository.updateById(id, chapter);
  }

  @put('/chapters/{id}', {
    responses: {
      '204': {
        description: 'Chapter PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() chapter: Chapter,
  ): Promise<void> {
    await this.chapterRepository.replaceById(id, chapter);
  }

  @del('/chapters/{id}', {
    responses: {
      '204': {
        description: 'Chapter DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.chapterRepository.deleteById(id);
  }
}
