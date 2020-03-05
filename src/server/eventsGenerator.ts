import faker from 'faker'
import { Context } from '~/graph'
import { IBlogPost } from '~/graph/nodes'

export class EventsGenerator {
  private handle?: NodeJS.Timeout
  constructor(private readonly context: Context) {}

  fillBlogPosts = () => {
    const service = this.context.service
    const blogPosts = service.blogPost.getMany()
    ;[...Array(Math.max(3 - blogPosts.length, 0))].forEach(() => {
      service.blogPost.create({
        name: faker.lorem.sentence(),
        description: faker.lorem.sentences(5),
        isPublic: faker.random.boolean()
      })
    })
  }

  fillComments = () => {
    const service = this.context.service
    const blogPosts = service.blogPost.getMany()
    blogPosts.forEach(blogPost => {
      ;[...Array(Math.max(5 - blogPost.commentsIds.length, 0))].forEach(() => {
        service.blogPost.createComment(blogPost.id, {
          title: faker.random.words(4),
          content: faker.lorem.sentences(2)
        })
      })
    })
  }

  updateFirstComment = () => {
    const service = this.context.service
    const blogPosts = service.blogPost.getMany()
    blogPosts.forEach(blogPost => {
      service.comment.update(blogPost.commentsIds[0], {
        title: faker.random.words(4),
        content: faker.lorem.sentences(2)
      })
    })
  }

  deleteSecondComment = () => {
    const service = this.context.service
    const blogPosts = service.blogPost.getMany()
    blogPosts.forEach(blogPost => {
      service.blogPost.deleteComment(blogPost.id, blogPost.commentsIds[1])
    })
  }

  generate = () => {
    this.fillBlogPosts()
    this.fillComments()
    this.updateFirstComment()
    this.deleteSecondComment()
  }

  start = () => {
    this.handle = setInterval(this.generate, 500)
  }

  stop = () => {
    if (this.handle) {
      clearInterval(this.handle)
    }
  }
}
