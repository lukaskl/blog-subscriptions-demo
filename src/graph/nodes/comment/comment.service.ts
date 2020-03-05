import { IGqlCommentCreate, IGqlCommentUpdate } from '~/graph/nodes/schemaDefs.autogen'
import { IComment } from './comment'
import { PubSub } from 'apollo-server'
import { ErrorMessages } from '~/graph/common'

export const enum CommentEvents {
  COMMENT_UPDATED = 'COMMENT_UPDATED'
}

let latestId = 0
const comments: IComment[] = []

export class CommentService {
  constructor(readonly pubSub: PubSub) {}

  get(id: string) {
    const comment = comments.find(x => x.id === id)
    if (!comment) throw new Error(ErrorMessages.notFound)
    return comment
  }

  getByIds(ids: string[]) {
    return comments.filter(c => ids.includes(c.id))
  }

  create = (args: IGqlCommentCreate, postId: string) => {
    const comment: IComment = {
      ...args,
      postId,
      id: `${latestId++}`
    }
    comments.push(comment)
    return comment
  }

  update = (id: string, args: IGqlCommentUpdate) => {
    const comment = comments.find(x => x.id === id)
    if (!comment) throw new Error(ErrorMessages.notFound)
    Object.assign(comment, args)
    return comment
  }

  delete = (id: string) => {
    const comment = comments.find(x => x.id === id)
    if (!comment) throw new Error(ErrorMessages.notFound)
    comments.splice(comments.indexOf(comment), 1)
    return comment
  }
}
