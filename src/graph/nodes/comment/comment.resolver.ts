import { withFilter } from 'apollo-server'
import {
  IGqlMutationTypeResolver,
  IGqlQueryTypeResolver,
  IGqlResolver,
  IGqlEventMeta
} from '~/graph/nodes/schemaDefs.autogen'

import { IComment } from './comment'
import { CommentEvents } from './comment.service'

const getEventMeta = (): IGqlEventMeta => ({ createdAt: new Date(), initiator: 'someUser' })

export const commentResolver: IGqlResolver = {
  Query: {
    async comment(obj, args, context): Promise<IComment> {
      return context.service.comment.get(args.id)
    }
  } as IGqlQueryTypeResolver<{}>,

  Mutation: {
    async updateComment(obj, args, context): Promise<IComment> {
      return context.service.comment.update(args.id, args.content)
    }
  } as IGqlMutationTypeResolver<{}>,

  Subscription: {
    commentUpdated: {
      resolve: (parent, args, context, info) => ({ meta: getEventMeta(), payload: parent }),
      subscribe: withFilter(
        (parent, args, context, info) =>
          context.pubSub.asyncIterator([CommentEvents.COMMENT_UPDATED]),
        (parent, args, context, info) => (args.postId ? parent.postId === args.postId : true)
      )
    }
  }
}
