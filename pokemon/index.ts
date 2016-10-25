import { makeExecutableSchema } from 'graphql-tools';
import { schema as typeDefs } from './schema';
import { resolvers } from './resolvers';


export const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});