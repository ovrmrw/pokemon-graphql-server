import 'babel-polyfill';
import hapi from 'hapi';
import { apolloHapi, graphiqlHapi } from 'apollo-server';

import { executableSchema } from './data';


const server = new hapi.Server();

const HOST = 'localhost';
const PORT = 3000;

server.connection({
  host: HOST,
  port: PORT,
});


server.register({
  register: apolloHapi,
  options: {
    path: '/graphql',
    apolloOptions: {
      schema: executableSchema,
      context: {}
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
