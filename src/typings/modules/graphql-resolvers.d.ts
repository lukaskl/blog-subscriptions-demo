declare module 'graphql-resolvers' {
  import { GraphQLFieldResolver } from "graphql";
  export interface IResolverFunction extends GraphQLFieldResolver<any, any, any> { }

  export function allResolvers(resolvers: Array<IResolverFunction>): IResolverFunction
  export function resolveDependee(dependeeName: string): IResolverFunction
  export function resolveDependee(resolver: IResolverFunction): IResolverFunction
  export function pipeResolvers(...resolvers: Array<IResolverFunction>): IResolverFunction
  export function combineResolvers(...resolvers: Array<IResolverFunction>): IResolverFunction
  export const skip: any;

}
