import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Config} from '../models';
import {ConfigRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ConfigService {
  constructor(
    @repository(ConfigRepository)
    public configRepository: ConfigRepository
  ) { }

  async readAndCreateConfig(userId: string): Promise<Config> {
    //if not config, then create it
    const data = await this.configRepository.find({
      where: {
        userId: userId
      }
    })
    if (data && data.length > 0) {
      return data[0]
    } else {
      var config = new Config()
      config.userId = userId
      config.email1 = 'any@email.com'
      var saved = this.configRepository.save(config)
      return saved
    }

  }
}
