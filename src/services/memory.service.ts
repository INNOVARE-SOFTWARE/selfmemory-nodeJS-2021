import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Memory} from '../models';
import {ChapterRepository, MemoryRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class MemoryService {
  constructor(@repository(MemoryRepository) public memoryRepository: MemoryRepository,
    @repository(ChapterRepository) public chapterRepository: ChapterRepository) { }


  async readAndCreateMemory(userId: string): Promise<Memory> {
    //if not config, then create it
    const data = await this.memoryRepository.find({
      where: {
        userId: userId
      }
    })
    if (data && data.length > 0) {
      return data[0]
    } else {
      var memory = new Memory()
      memory.userId = userId
      memory.created = new Date()
      memory.title = 'My Great Book'
      memory.subtitle = 'Read my great book'
      var saved = this.memoryRepository.save(memory)
      return saved
    }

  }

  async exportBook(userId: string) {
    const memory = await this.memoryRepository.findOne({
      where: {
        userId: userId
      },
      include: ['chapters']
    })
    var book = ''


    if (memory) {
      book += memory.title
      book += '\n'
      book += memory.subtitle
      book += '\n'
      book += '-----------------------'
      book += '\n'

      if (memory.chapters) {
        memory.chapters.forEach(c => {
          book += '\n'
          book += c.title
          book += '\n'
          book += c.text
          book += '\n'
          book += '-----------------------'
        })
      }
      return book
    }
    return ''

  }
}
