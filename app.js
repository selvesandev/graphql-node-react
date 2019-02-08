const express = require('express');
const graphQlHttp = require('express-graphql'); // This is a function we use as a middleware
const {buildSchema} = require('graphql'); // # The buildSchema is a function which will accept a template literal.

const app = express();
app.use(express.json());

const events = [];
app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title:String!
            description:String!
            price:Float!
            date:String!
        }
        
        type RootQuery {
            events:[Event!]!
        }
        
        input EventInput {
            title:String!
            description:String!
            price:Float!
            date:String!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput):Event
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
            return events;
        },
        createEvent: (args) => {

            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date().toISOString()
            };
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

app.get('/', (req, res, next) => {
    res.send("Hello world");
});

app.listen(3002);