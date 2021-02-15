import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,

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
import {Memory} from '../models';
import {MemoryRepository} from '../repositories';
import {MemoryService} from '../services';

@authenticate('jwt')
export class MemoryController {
  constructor(
    @repository(MemoryRepository)
    public memoryRepository: MemoryRepository,
    @service(MemoryService)
    public memoryService: MemoryService,
  ) { }

  @post('/memories', {
    responses: {
      '200': {
        description: 'Memory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Memory)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Memory, {
            title: 'NewMemory',
            exclude: ['id'],
          }),
        },
      },
    })
    memory: Omit<Memory, 'id'>,
  ): Promise<Memory> {
    return this.memoryRepository.create(memory);
  }

  @get('/memories/count', {
    responses: {
      '200': {
        description: 'Memory model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Memory) where?: Where<Memory>,
  ): Promise<Count> {
    return this.memoryRepository.count(where);
  }

  //we change this for userID support
  @get('/memories/user/{userID}', {
    responses: {
      '200': {
        description: 'Array of Memory model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Memory, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('userID') userID: string
  ): Promise<Memory> {
    return await this.memoryService.readAndCreateMemory(userID)
  }

  @patch('/memories', {
    responses: {
      '200': {
        description: 'Memory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Memory, {partial: true}),
        },
      },
    })
    memory: Memory,
    @param.where(Memory) where?: Where<Memory>,
  ): Promise<Count> {
    return this.memoryRepository.updateAll(memory, where);
  }

  @get('/memories/{id}', {
    responses: {
      '200': {
        description: 'Memory model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Memory, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Memory, {exclude: 'where'}) filter?: FilterExcludingWhere<Memory>
  ): Promise<Memory> {
    return this.memoryRepository.findById(id, filter);
  }

  @patch('/memories/{id}', {
    responses: {
      '204': {
        description: 'Memory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Memory, {partial: true}),
        },
      },
    })
    memory: Memory,
  ): Promise<void> { //void return
    console.log(memory)
    await this.memoryRepository.updateById(id, memory);
  }

  @put('/memories/{id}', {
    responses: {
      '204': {
        description: 'Memory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() memory: Memory,
  ): Promise<void> {
    await this.memoryRepository.replaceById(id, memory);
  }

  @del('/memories/{id}', {
    responses: {
      '204': {
        description: 'Memory DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.memoryRepository.deleteById(id);
  }

  //export book
  @get('/memories/book/{userid}', {
    responses: {
      '200': {
        description: 'Memory model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Memory, {includeRelations: true}),
          },
        },
      },
    },
  })
  async book(
    @param.path.string('userid') userid: string,
  ): Promise<any> {
    return await this.memoryService.exportBook(userid)
  }
}
