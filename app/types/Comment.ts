import { UserType } from './User';

export type CommentType = {
  createdAt: string
  id: string
  message: string
  postId: string
  user: UserType
  userId: string
}
