// a node has to export its:
//  -> Schema
//  -> Resolver
//  -> Interface of a Model (but NOT A MongoDB model, mongodb model should be used only internally)
//  -> Services (for mutations and business logic) and interface of a Service

export { IComment } from './comment';
export { commentResolver } from './comment.resolver';
export { CommentService } from './comment.service';
export { default } from './comment.gql';
