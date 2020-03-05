// a node has to export its:
//  -> Schema
//  -> Resolver
//  -> Interface of a Model (but NOT A DB model, DB model should be used only internally)
//  -> Services (for mutations and business logic) and interface of a Service

export { IBlogPost } from './blogPost'
export { blogPostResolver } from './blogPost.resolver'
export { BlogPostService } from './blogPost.service'
export { default } from './blogPost.gql'
