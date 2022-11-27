const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { chats } = require('./seeds/seed');
const connectDB = require('./config/connection');

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('yo');
});
app.get('/api/chat', (req, res) => {
  res.send(chats);
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  connectDB.once('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

//starts the server
startApolloServer(typeDefs, resolvers);
