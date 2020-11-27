import gql from 'graphql-tag'

export const ALL_POSTS = gql`
query{
  posts{
    id
    title
    author
    postedUser{
      id
      name
    }
    updatedAt
    createdAt
  }
}
`

export const ALL_USERS = gql`
query{
 users{
   id
   name
   email
   updatedAt
  posts{
    title
    author
  }
}
}
`