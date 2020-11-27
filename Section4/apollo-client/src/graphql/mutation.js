import gql from 'graphql-tag'

// POSTの新規追加
export const CREATE_POST = gql`
mutation ($title: String!, $author: String!) {
    createPost(data: { title: $title, author: $author}) {
        id
         title
        author
     }
  }`

// POSTの更新
export const UPDATE_POST = gql`
mutation ($id: ID!, $title: String!, $author: String!) {
        updatePost(id:$id,data: {title: $title, author: $author}) {
            id
            title
            author
        }
    }
`

// // POSTの削除
export const DELETE_POST = gql`
mutation ($id: ID!) {
        deletePost(id:$id){
            title
            author
        }
    }
`