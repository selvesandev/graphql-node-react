const express = require('express');
const graphQlHttp = require('express-graphql'); // This is a function we use as a middleware
const {buildSchema} = require('graphql'); // # The buildSchema is a function which will accept a template literal.

const app = express();
app.use(express.json());
app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type RootQuery {
            events:[String!]!
        }
        
        type RootMutation {
            createEvent(name: String):String
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),//query is for fetching and mutation is for changing. The graphql will parse our string into a valid schema object.

    rootValue: {
        //This is an object which has all the resolver functions in it.
        //And these resolver functions need to match our schema endpoints by name.
        events: () => {
            return ['Romantic Cooking', ' Sailing', 'All Night Coding'];
        },
        createEvent: (args) => {
            return args.name;
        }
    },
    graphiql: true
}));

app.get('/', (req, res, next) => {
    res.send("Hello world");
});

app.listen(3002);