import {Entity, hasMany, model, property} from '@loopback/repository';
import {Chapter} from './chapter.model';

@model()
export class Memory extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  subtitle?: string;

  @property({
    type: 'date',
    required: true,
  })
  created: Date;

  @property({
    type: 'string',
  })
  userId?: string;

  @hasMany(() => Chapter)
  chapters: Chapter[];

  constructor(data?: Partial<Memory>) {
    super(data);
  }
}

export interface MemoryRelations {
  // describe navigational properties here
}

export type MemoryWithRelations = Memory & MemoryRelations;
