import { UserType } from './User';
import { CommentType } from './Comment';
import { HeartType } from './Heart';

export type PostType = {
  body: string;
  comments: CommentType[];
  hearts: HeartType[];
  createdAt: string;
  id: string;
  title: string;
  updateAt: string;
  user: UserType
  userId: string
}
