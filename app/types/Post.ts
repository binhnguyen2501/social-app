import { CommentType } from './Comment';

export type PostType = {
  body: string
  comments: CommentType[]
  createdAt: string;
  id: string;
  title: string;
  updateAt: string;
  user: {
    id: string
    name: string
    email: string
    emailVerified: null,
    password: null,
    image: string | null
  }
  userId: string
}
