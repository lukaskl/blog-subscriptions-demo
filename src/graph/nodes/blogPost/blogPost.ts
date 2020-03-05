export interface IBlogPost {
  id: string
  isPublic?: boolean
  name: string
  description?: string
  commentsIds: string[]
}
