import _ from 'lodash'
import { CommentService } from '~/graph/nodes'
import { IGqlBlogPostCreate, IGqlBlogPostUpdate, IGqlCommentCreate } from '~/graph/nodes/schemaDefs.autogen'

import { IBlogPost } from './blogPost'
import { PubSub } from 'apollo-server'
import { ErrorMessages } from '~/graph/common'
import { IComment } from '../comment'

export const enum BlogPostEvents {
  BLOG_POST_CREATED = 'BLOG_POST_CREATED',
  BLOG_POST_DELETED = 'BLOG_POST_DELETED',
  BLOG_POST_UPDATED = 'BLOG_POST_UPDATED',
  COMMENT_CREATED = 'COMMENT_CREATED',
  COMMENT_DELETED = 'COMMENT_DELETED'
}

let latestId = 0
const blogPosts: IBlogPost[] = []

export class BlogPostService {

  constructor(protected readonly commentsService: CommentService, protected readonly pubSub: PubSub) {}

  get(id: string): IBlogPost {
    const blogPost = blogPosts.find(x => x.id === id)
    if (!blogPost) throw new Error(ErrorMessages.notFound)
    return blogPost
  }

  getMany(): IBlogPost[] {
    return blogPosts
  }

  create = (args: IGqlBlogPostCreate) => {
    const blogPost: IBlogPost = {
      ...args,
      id: `${latestId++}`,
      commentsIds: []
    }
    blogPosts.push(blogPost)
    this.pubSub.publish(BlogPostEvents.BLOG_POST_CREATED, { blogPost })

    return blogPost
  }

  update = (id: string, args: IGqlBlogPostUpdate) => {
    const blogPost = blogPosts.find(x => x.id === id)
    if (!blogPost) throw new Error(ErrorMessages.notFound)
    Object.assign(blogPost, args)
    this.pubSub.publish(BlogPostEvents.BLOG_POST_UPDATED, { blogPost })
    return blogPost
  }

  delete = (id: string) => {
    const blogPost = blogPosts.find(x => x.id === id)
    if (!blogPost) throw new Error(ErrorMessages.notFound)
    blogPosts.splice(blogPosts.indexOf(blogPost), 1)
    this.pubSub.publish(BlogPostEvents.BLOG_POST_DELETED, { blogPost })
    return blogPost
  }

  createComment = (postId: string, comment: IGqlCommentCreate) => {
    const blogPost = blogPosts.find(x => x.id === postId)
    if (!blogPost) throw new Error(ErrorMessages.notFound)

    const createdComment = this.commentsService.create(comment, blogPost.id)
    blogPost.commentsIds.push(createdComment.id)

    const result = { blogPost, comment: createdComment }
    this.pubSub.publish(BlogPostEvents.COMMENT_CREATED, result)
    return result
  }

  deleteComment = (postId: string, commentId: string) => {
    const blogPost = blogPosts.find(x => x.id === postId)
    if (!blogPost) throw new Error(ErrorMessages.notFound)

    const comment = this.commentsService.delete(commentId)
    blogPost.commentsIds.splice(blogPost.commentsIds.indexOf(commentId), 1)

    const result = { blogPost, comment }
    this.pubSub.publish(BlogPostEvents.COMMENT_DELETED, result)
    return result
  }
}
