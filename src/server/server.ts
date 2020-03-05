import { ApolloServer, PubSub } from 'apollo-server'
import { Context } from '~/graph'
import { schema } from '~/graph/nodes'
import { EventsGenerator } from './eventsGenerator'

const pubSub = new PubSub()
const context = new Context(pubSub)

const eventsGenerator = new EventsGenerator(context)

const server = new ApolloServer({
  schema,
  context,
  playground: true,
  tracing: true,
  cors: false,
  subscriptions: {
    path: 'subscriptions'
  }
})

export const start = async () => {
  const { url } = await server.listen({ port: 3000 })
  console.log(`🚀 Server ready at ${url}`)

  eventsGenerator.start()
}

export const stop = async () =>{
  eventsGenerator.stop()
  await server.stop()
}
