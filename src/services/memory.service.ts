import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Memory} from '../models';
import {ChapterRepository, ConfigRepository, MemoryRepository} from '../repositories';


let MAILGUN_API_KEY = 'key-6c26133f71600c088ac81b102f6233ec' //replace for you key
let MAILGUN_DOMAIN = 'sandbox54f649cf47f543d599bd458567d9cb18.mailgun.org'  //replace for you domain
let MAILGUN_EMAIL_FROM = 'admin@innovare.com.ar'  //replace for you email


@injectable({scope: BindingScope.TRANSIENT})
export class MemoryService {
  constructor(
    @repository(ConfigRepository) public configRepository: ConfigRepository,
    @repository(MemoryRepository) public memoryRepository: MemoryRepository,
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
        memory.chapters.forEach(c => { //every chapter
          book += '\n'
          book += c.title
          book += '\n'
          book += c.text
          book += '\n'
          book += '-----------------------'
        })
      }

      const config = await this.configRepository.findOne({
        where: {
          userId: userId
        }
      })
      if (config) {
        this.sendEmail(config.email1, book)
        if (config.email2)
          this.sendEmail(config.email2, book)
      }
      return {'result': 'sending...'}
    }
    return {'result': 'not sending'}

  }

  //Enviamos los emails, utilizamos MailGun de manera asíncrona.
  async sendEmail(to: string, txt: string) {
    var api_key = MAILGUN_API_KEY;
    var domain = MAILGUN_DOMAIN;
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

    var data = {
      from: MAILGUN_EMAIL_FROM,
      to: to,
      subject: 'Lee las memorias de ' + to,
      text: txt
    };

    mailgun.messages().send(data, function (error: any, body: any) {
      console.log(body)
      return body
    });
  }
}
