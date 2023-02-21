import { UserType } from './User';
import { CommentType } from './Comment';

export type PostType = {
  body: string
  comments: CommentType[]
  createdAt: string;
  id: string;
  title: string;
  updateAt: string;
  user: UserType
  userId: string
}
