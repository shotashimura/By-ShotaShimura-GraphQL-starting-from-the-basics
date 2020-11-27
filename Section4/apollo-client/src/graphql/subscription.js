import gql from 'graphql-tag'

// サブスクリプション
export const SUBSCRIPTION_POST = gql`
subscription {
  post{
    mutation
  data{
    id
    title
    author
  }
  }
}
`