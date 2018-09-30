# GraphQL Apollo React Feedback App

Demo of Apollo GraphQL React Client

## Usage

You can add comments and vote on individual comments. 

### Install

Install dependencies:

```bash
$ npm i
```

## Technology stack

This application integrates the following technologies:
- [Apollo Client 2.0](http://dev.apollodata.com) to communicate with GraphQL Server
- [Create React App](https://github.com/facebook/create-react-app)

## Schema

This is the schema used

```graphql
type Feedback {
  id: ID! @isUnique
  text: String!
  votes: Int!
}
```

### Run
```bash
$ npm start
```

Navigate to `http://localhost:3000`. The app will automatically reload if you change any of the source files.

> Note: requires a node version >=6.x

## Development commands

https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md