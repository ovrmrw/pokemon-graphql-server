import { makeExecutableSchema } from 'graphql-tools';
import { schema } from './schema';
import { resolvers } from './resolvers';


export const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});