import { withFilter } from 'apollo-server'
import { GqlArrRes } from '~/graph/common'
import { IComment } from '~/graph/nodes/comment'
import {
  IGqlBlogPostBase,
  IGqlEventMeta,
  IGqlBlogPostTypeResolver,
  IGqlMutationTypeResolver,
  IGqlQueryTypeResolver,
  IGqlResolver,
  IGqlSubscriptionTypeResolver
} from '~/graph/nodes/schemaDefs.autogen'

import { IBlogPost } from './blogPost'
import { BlogPostEvents } from './blogPost.service'

const getEventMeta = (): IGqlEventMeta => ({ createdAt: new Date(), initiator: 'someUser' })

export const blogPostResolver: IGqlResolver = {
  BlogPost: {
    async comments(obj, args, context): GqlArrRes<IComment> {
      return context.service.comment.getByIds(obj.commentsIds)
    },
    commentsCount(obj, args, context) {
      return obj.commentsIds.length
    }
  } as IGqlBlogPostTypeResolver<IBlogPost>,
  Query: {
    async blogPosts(obj, args, context): GqlArrRes<IBlogPost> {
      return context.service.blogPost.getMany()
    },
    async blogPost(obj, args, context): Promise<IBlogPost> {
      return context.service.blogPost.get(args.id)
    }
  } as IGqlQueryTypeResolver<IBlogPost>,

  Mutation: {
    async createBlogPost(obj, args, context): Promise<IBlogPost> {
      return context.service.blogPost.create(args.content)
    },
    async deleteBlogPost(obj, args, context): Promise<IGqlBlogPostBase> {
      return context.service.blogPost.delete(args.id)
    },
    async updateBlogPost(obj, args, context): Promise<IBlogPost> {
      return context.service.blogPost.update(args.id, args.content)
    },
    async createComment(obj, args, context) {
      return context.service.blogPost.createComment(args.postId, args.content)
    },
    async deleteComment(obj, args, context) {
      return context.service.blogPost.deleteComment(args.postId, args.commentId)
    }
  } as IGqlMutationTypeResolver<{}>,

  Subscription: {
    blogPostCreated: {
      resolve: (parent, args, context, info) => ({
        meta: getEventMeta(),
        payload: parent.blogPost
      }),
      subscribe: (parent, args, context, info) => {
        return context.pubSub.asyncIterator([BlogPostEvents.BLOG_POST_CREATED])
      }
    },
    blogPostDeleted: {
      resolve: (parent, args, context, info) => ({
        meta: getEventMeta(),
        payload: parent.blogPost
      }),
      subscribe: withFilter(
        (parent, args, context, info) =>
          context.pubSub.asyncIterator([BlogPostEvents.BLOG_POST_DELETED]),
        (parent, args, context, info) => (args.postId ? parent.id === args.postId : true)
      )
    },
    blogPostUpdated: {
      resolve: (parent, args, context, info) => ({
        meta: getEventMeta(),
        payload: parent.blogPost
      }),
      subscribe: withFilter(
        (parent, args, context, info) =>
          context.pubSub.asyncIterator([BlogPostEvents.BLOG_POST_UPDATED]),
        (parent, args, context, info) => (args.postId ? parent.id === args.postId : true)
      )
    },
    commentCreated: {
      resolve: (parent, args, context, info) => ({ meta: getEventMeta(), payload: parent }),
      subscribe: withFilter(
        (parent, args, context, info) =>
          context.pubSub.asyncIterator([BlogPostEvents.COMMENT_CREATED]),
        (parent, args, context, info) => (args.postId ? parent.blogPost.id === args.postId : true)
      )
    },
    commentDeleted: {
      resolve: (parent, args, context, info) => ({ meta: getEventMeta(), payload: parent }),
      subscribe: withFilter(
        (parent, args, context, info) =>
          context.pubSub.asyncIterator([BlogPostEvents.COMMENT_DELETED]),
        (parent, args, context, info) => (args.postId ? parent.blogPost.id === args.postId : true)
      )
    }
  } as IGqlSubscriptionTypeResolver
}
