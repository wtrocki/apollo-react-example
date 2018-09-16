import gql from 'graphql-tag';

export const FEEDBACKS = gql`
  query feedbacks {
    allFeedbacks { id text votes }
  }
`

export const ADD_FEEDBACK = gql`
  mutation addFeedback($text: String!) {
    createFeedback(text: $text, votes: 0) { id text votes }
  }
`

export const VOTE_FEEDBACK = gql`
  mutation voteOnFeedback($id: ID!, $votes: Int!) {
    updateFeedback(id: $id, votes: $votes) { id votes }
  }
`

export const FEEDBACK_SUBSCRIPTION = gql`
  subscription {
    Feedback(filter: {
      mutation_in: [CREATED, UPDATED, DELETED]
    }) {
      mutation
      node {
        id
        text 
        votes
      }
      previousValues {
        id
        text
        votes
      }
    }
  }
`