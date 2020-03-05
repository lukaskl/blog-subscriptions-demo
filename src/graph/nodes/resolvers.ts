import { GraphQLDateTime } from 'graphql-iso-date'
import _ from 'lodash'

import { blogPostResolver } from './blogPost'
import { commentResolver } from './comment'

const getResolvers = () => {
  return _.merge(
    { DateTime: GraphQLDateTime },
    blogPostResolver,
    commentResolver
  )
}

export const resolvers = getResolvers()
