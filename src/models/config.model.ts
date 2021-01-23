import {Entity, model, property} from '@loopback/repository';

@model()
export class Config extends Entity {
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
  email1: string;

  //relation
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
  })
  email2?: string;

  @property({
    type: 'date',
  })
  discover?: string;


  constructor(data?: Partial<Config>) {
    super(data);
  }
}

export interface ConfigRelations {
  // describe navigational properties here
}

export type ConfigWithRelations = Config & ConfigRelations;
