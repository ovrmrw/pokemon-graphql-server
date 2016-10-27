import 'babel-polyfill';
import hapi from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'graphql-server-hapi';

// import { executableSchema as dataSchema } from './data';
import { executableSchema as pokemonSchema } from './pokemon';


const server = new hapi.Server();

const HOST = 'localhost';
const PORT = 3000;

server.connection({
  host: HOST,
  port: PORT,
});


server.register({
  register: graphqlHapi,
  options: {
    path: '/graphql',
    // graphqlOptions: {
    //   schema: pokemonSchema,
    // },
    graphqlOptions: (request) => {
      return {
        schema: pokemonSchema,
        context: request,
      };
    },
    route: {
      cors: true
    }
  },
});


server.register({
  register: graphiqlHapi,
  options: {
    path: '/graphiql',
    graphiqlOptions: {
      endpointURL: '/graphql',
    },
  },
});


server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
