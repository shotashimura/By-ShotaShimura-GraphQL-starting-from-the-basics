import gql from 'graphql-tag'
// Type Post
// POSTの新規作成
export const CREATE_POST = gql`
    mutation ($title: String!, $author: String!,$postedUser: ID!) {
      createPost(data: { title: $title, author: $author, postedUser: $postedUser}) {
        id
        title
        author
        postedUser{
            id,
            name
            }
        updatedAt
        createdAt
     }
  }`

// POSTの更新
export const UPDATE_POST = gql`
    mutation ($id: ID!, $title: String!, $author: String!) {
      updatePost(id:$id,data: {title: $title, author: $author}) {
        title
        author
        postedUser{
            id,
            name
            }
        updatedAt
        createdAt
        }
    }
`

// POSTの削除
export const DELETE_POST = gql`
    mutation ($id: ID!) {
      deletePost(id:$id){
        id
        title
        author
        }
    }
`

// Type User
// Userの新規作成
export const CREATE_USER = gql`
mutation ($name: String!, $email: String!, $password: String!) {
    createUser(data:{name:$name,email:$email,password:$password}){
        token
        user{
            id
            name
            email
            password
            updatedAt
            createdAt
            }
        }
     }
`

//ログイン
export const LOGIN = gql`
mutation ($email: String!, $password: String!) {
    login(data:{email:$email,password:$password}){
        token
        user{
            id
            name
            email
            password
            updatedAt
            createdAt
            }
        }
    }
`
