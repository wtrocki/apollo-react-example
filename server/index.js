const { ApolloServer, gql } = require('apollo-server');

// This is a (sample) collection of feedback that we can query
const feedback = [
  {
    id: 1,
    text: 'How versioning works with GraphQL?',
    votes: 7,
  },
  {
    id: 2,
    text: 'Is GraphQL another Hype?',
    votes: 53,
  },
];

// Schema
const typeDefs = gql`

    type Feedback {
      id: ID!
      text: String!
      votes: Int!
    }

    type Query {
      allFeedbacks: [Feedback]
    }
    
    type Mutation {
      createFeedback(text: String!, votes: Int!): Feedback
     
      updateFeedback(id: ID!, text: String, votes: Int): Feedback

      ## Increment counter for specific feedback
      vote(id: ID!): Feedback
    }
  `;

// Resolvers define the technique for fetching the types in the
// schema.  
const resolvers = {
  Query: {
    allFeedbacks: () => feedback,
  },

  Mutation: {
    createFeedback: (obj, args, context, info) => {
      args.id = new Date().getTime();
      feedback.push(args)
      return args;
    },
    updateFeedback: (obj, args, context, info) => {
      for (item of feedback) {
        if (args.id == item.id) {
          item.votes = args.votes;
          item.text = args.text;
          return item;
        }
      }
      throw new Error(`Couldn't find feedback with id ${args.id}`);
    },
    vote: (obj, args, context, info) => {
      for (item of feedback) {
        if (args.id === item.id) {
          item.votes += 1;
          return item;
        }
      }
      throw new Error(`Couldn't find feedback with id ${args.id}`);
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: process.env.ENGINE_API_KEY && {
    apiKey: process.env.ENGINE_API_KEY,
  },
  playground: {
    tabs: [{
      query: `
      query all {
        allFeedbacks{
          id
          text
          votes
        }
      }
      
      mutation createFeedback{
       createFeedback(text:"Test", votes: 0){
          id
          text
          votes
       }
      }
      
      mutation updateFeedback{
       updateFeedback(id: 1 , text:"fsadf", votes: 5){
           id
          text
          votes
       }
      }
      
      `}]
  }
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
