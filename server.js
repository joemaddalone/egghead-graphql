import Express from 'express';
import GraphHTTP from 'express-graphql';
import Schema from './schema'

const app = Express()
app.use('/graphql', GraphHTTP({ schema: Schema, graphiql: true }))
  .listen(8080, function (err) {
    console.log('Open browser to localhost:8080');
  });