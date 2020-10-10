import { ApolloServer } from 'apollo-server';

import resolvers from './graphql/resolvers';
import typeDefs from './graphql/schemas';
import context from './graphql/context';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    playground: true,
    tracing: true,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
