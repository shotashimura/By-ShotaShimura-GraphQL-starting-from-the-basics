const {gql} = require('apollo-server');

const typeDefs = gql`
type Query {
  posts(query: String): [Post!]!
  # 新しく追加
  users(query: String): [User!]!
}

type Mutation {
  createPost(data: CreatePostInput!): Post!
  deletePost(id: ID!): Post!
  updatePost(id: ID!, data: UpdatePostInput!): Post!
  # 新しく追加
  createUser(data: CreateUserInput!): AuthPayload!
  login(data: LoginUserInput!): AuthPayload!
}

# サブスクリプション
type Subscription {
  post: PostSubscriptionPayload!
}

# 変更
input CreatePostInput {
  title: String!
  author: String!
  # 投稿するユーザーのid
  postedUser: ID!
}

input UpdatePostInput {
  title: String
  author: String!
}

type Post {
  id: ID!
  title: String!
  author: String!
  # リレーション
  postedUser: User!
  # 作成時間と更新時間
  updatedAt: String!
  createdAt: String!
}


enum MutationType {
  CREATED
  UPDATED
  DELETED
}

# サブスクリプションのフィールド
type PostSubscriptionPayload {
  mutation: MutationType!
  data: Post!
}

# 下記以降新しく追加
type AuthPayload {
  token: String!
  user: User!
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
}

input LoginUserInput {
  email: String!
  password: String!
}

type User {
  id: ID!
  name: String!
  email: String
  password: String!
  # リレーション
  posts: [Post!]!
  # 作成時間と更新時間
  updatedAt: String!
  createdAt: String!
}
`
module.exports = typeDefs;