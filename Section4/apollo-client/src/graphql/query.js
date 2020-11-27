import gql from 'graphql-tag'

export const ALL_POSTS = gql`
query{
    posts{
      id
      title
      author
    }
}
`