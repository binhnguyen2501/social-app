import { PostType } from "./Post"

export type AuthPostType = {
  email: string
  emailVerified: null
  id: string
  image: string
  name: string
  password: null
  posts: PostType[]
}
