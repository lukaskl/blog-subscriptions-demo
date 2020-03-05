import { PubSub } from 'apollo-server';
import { buildServices, Services } from './services';

export class Context {

  constructor(
    readonly pubSub: PubSub,
    readonly service: Services = buildServices(pubSub),
  ) {

  }

}
