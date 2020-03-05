import { BlogPostService, CommentService } from '~/graph/nodes'
import { PubSub } from 'apollo-server'

export class Services {
  constructor(readonly blogPost: BlogPostService, readonly comment: CommentService) {}
}

export const buildServices = (pubSub: PubSub): Services => {
  const commentService = new CommentService(pubSub)
  const blogPostService = new BlogPostService(commentService, pubSub)
  const services = new Services(blogPostService, commentService)
  return services
}
