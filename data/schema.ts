import { makeExecutableSchema } from 'graphql-tools';

import { resolveFunctions as resolvers } from './resolvers';


const schema = `
type Author {
  id: Int! # the ! means that every author object _must_ have an id
  firstName: String
  lastName: String
  posts: [Post] # the list of Posts by this author
}
type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}
# the schema allows the following query:
type Query {
  posts: [Post]
}
# this schema allows the following mutation:
type Mutation {
  upvotePost (
    postId: Int!
  ): Post
}
`;


export const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});