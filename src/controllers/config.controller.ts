import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param,

  patch,

  requestBody
} from '@loopback/rest';
import {Config} from '../models';
import {ConfigRepository} from '../repositories';
import {ConfigService} from '../services';

/*
1- only need create, save and read
2- read need userID for each config
3- We move to service the logic
*/

@authenticate('jwt')
export class ConfigController {
  constructor(
    @repository(ConfigRepository)
    public configRepository: ConfigRepository,
    @service(ConfigService) private configService: ConfigService
  ) { }

  @get('/configs/{userId}', {
    responses: {
      '200': {
        description: 'Array of Config model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Config, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('userId') userId: string,
  ): Promise<Config> {
    return await this.configService.readAndCreateConfig(userId)
  }


  @patch('/configs/{id}', {
    responses: {
      '204': {
        description: 'Config PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() config: Config,
  ): Promise<void> {
    await this.configRepository.replaceById(id, config);
  }
}
