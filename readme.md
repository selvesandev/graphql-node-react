# GRAPH QL NODE JS AND REACT SPA



## What is GRAPH QL?
A graph ql is replacement or alternative to restful api. A rest api
has couple of endpoints which is independent from the client. Doest not have view and only
contains data which is shared with web or mobile application.  

A graph QL is alternative to the rest api which offers more flexibility.

### Rest Full Api Limitations.
```
{
    id:1,
    title:'News title',
    content:{...},
    creator:{...}
}
```
In rest api you always send back all the data what if we only want the `id` of the data.
If you want less data you simply create a different rest api. eg: `post-slim` which will result in lot of endpoints.

#### Solution.
With `GRAPH QL` we can build a backend which exposes a endpoint which is very flexible regarding
the query that is sent to it therefore the frontend developer can request data in all kinds of shape.
 
#### How does graph QL work?
When we have a client i.e browser or the mobile app and we have the server where the graph ql api runs. In reset api
we send the GET, POST, PUT etc request with Graph QL you always send a `POST` request even when you are getting the data to a single endpoint eg: `/graphql`.

The reason for sending a post request is that the graph ql basically `exposes a query language to the frontend` like we have on sql or no sql database. Therefore the frontend can send
commands to the backend with such a post request to fetch the data.

**Why not GET because it does not have a POST BODY**


#### Graph QL Query Example.
```
{
    query {
        user {
            name
            age
        }
    }
}
```
This is what we send to the server as a POST body. Then the server will parse it to return the data.

**Misconception: graph ql is here to help you query the facebook's knowledge graph or that it only works with react  because fb invented graph ql and first implemented on react.**

**Graph QL is an alternative to rest api and it works with any server side languages and with any frontend framework or even with vanilla js**


```
{
    (operation type (query,mutaion,subscription))query {
        (endpoint we want to target with that query)user {
            (fields data we want to get back) name
            (fields) age
        }
    }
}
```

#### Operations
_**`QUERY`**_ ==>       RETRIEVE DATA (GET) but sent as POST  
_**`MUTATION`**_ ==>    CHANGE DATA (POST, PUT, PATCH, DELETE) but sent as POST  
_**`MUTATION`**_ ==>    Setup real time connection via web sockets.  

#### Graph QL BIGGER PICTURE.
* We have Client,
* We have server with the GRAPH QL API RUNNING on it
* We have Subscription definition on the server 
* We have some types definition because Graph QL is basically a typed language. (it is not a programming language but
since it is evolved by facebook and uses types so we are very clear about which types of data is returned from a given endpoint)
* We have resolvers which contains your server side coding.



## Project Starts Here.
#### Node quick setup.
`npm init` to generate a json file.  
`npm install --save express` to install the express framework.  
`npm install --save-dev nodemon` Node monitor.

```
const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res, next) => {
    res.send("Hello world");
});
app.listen(3002);
```

### Graph QL Setup. The Core IDEA.
> GraphQL On Action  


`npm install --save express-graphql`   
package that can be used as a middleware which allows us to point out at schema, or resolvers
and automatically connect all of that for us.

`npm install --save graphql`   
Allows us to define the schema that follows the special graph ql definitions. It will parse 
our schema which we can use in our express application. 

```
const graphQlHttp = require('express-graphql'); // This is a function we use as a middleware

app.use('/graphql', graphQlHttp({
    // Here..
}));
```

The graphQl middleware expects two keys inside it as an object.
```
app.use('/graphql', graphQlHttp({
    schema: null,
}));
```
The schema is generated with the help of `express-graphql` for now it is just null.    
  
The other key is `rootValue` key which will point to an js object which will have all the resolver function in it.
The resolver function need to match our schema endpoints by name.
```
app.use('/graphql', graphQlHttp({
    rootValue: {},
}));
```
Now we are almost ready to make our graph ql api work.

##### Adding a schema. 
For this we will first require `graphql` and get the `buildSchema` from it by es6 object destructuring.
```
const {buildSchema} = require('graphql'); // # The buildSchema is a function which will accept a template literal.
```

The `builSchema` is a function that will take the javascript string literal which will be then used to define schema.
```
app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        schema {
            query: 
            mutation: 
        }
    `)
}));
```
The `buildSchema` contains a `schema` which will have two 
keywords properties defined inside it the `query` and the `mutation`.  
`query` meaning we want to receive the data.  
`mutation` meaning we want to change the data meaning (updating,deleting or inserting).  
There are subscriptions as well we will use them later.

> Remember the `schema` `query` and `mutaion` is a key work of graph ql specification. 


The buildSchema also creates a `type` with a name here `RootQuery` you can name it any thing you want which is also an object.
This is where we construct different endpoints for incoming queries. and we will also do the same for our mutation here `RootMutation`
```
app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type RootQuery {
        }
        
        type RootMutation {
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
}));
```
Now we can add as many queries and mutation as we want.  

**Creating a query `events` that will send a list of data**
```
app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type RootQuery {
            events:[String!]!
        }     
    `)
}));

```
Now we have a query `events` which returns a list of string. Graph ql is a typed language
therefore we should specify the data types. `String`,`Integer`,`Float`,`Boolean` etch are some of the types that it supports.
the `!` sign represents it cannot be null. 

**Creating mutation where we can update data this is generally a name for a function**
```
app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type RootMutation {
            createEvent(name: String):String
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)
}));
```
Here we have a function `createEvent` which accepts a string and returns a string.  
Now we have these two commands for `RootQuery` and `RootMutation` that our graph ql api should support.  

  
Still we have no logic to interact with the defined `commands` i.e to request a list of data and to create a event.
We add this logic in the `rootValue` property which is called a resolver.
  
The resolvers for your command `events` and `createEvent` must have the exact same name.  
```
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
    `),
    rootValue: {
        events: () => {
            return ['Romantic Cooking', ' Sailing', 'All Night Coding'];
        },
        createEvent: (args) => {
            return args.name;
        }
    }
}));
``` 
The resolver is just a function that returns a object. Here we have created two
resolvers   
* one for the `events` query which will trigger for the `events` query that return a list of strings
* one for the `createEvent` mutation that returns the value passed to it. The `args` received by the resolver `createEvent: (args)`
is the object of value sent.

We can test these all by unlocking the third property we passed to `graphQlHttp` object i.e `graphiql`:`true`.
```
app.use('/graphql', graphQlHttp({
    schema: buildSchema(
    `),
    rootValue: {
    },
    graphiql: true
}));

```
Now you can test this with the `localhost:3000/graphql`.

* Test the query.
```
query {
    events
} // Will returs the list of string that we have built
```

* Test the mutation.
```
mutation {
    createEvent(name: "Selvesan")
}
```

### Types
Till now we have a `RootQuery` with `events` which is the single endpoint we have, `RootMutation` in which `createEvent` for storing data and a resolver function in `rootValue` we return a dummy data and echo dummy data you want to store.
###### Defining a custom type.
```

app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title:String!
            description:String!
            price:Float!
            date:String!
        }
    `)
}));
``` 
Here we have created a `Event type`. Every events needs a `ID!` the exclamation marks make it non nullable which make the `_id` a key specifier.  
  
Now lets modify our `RootQuery` so that it returns the `Event` object instead of string which it does now.

```
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
    `)
}));
```
We also want to return the event when we create it so modifying the `RootMutation` as well.
```
type RootMutation {
    createEvent(name: String):Event
}
```
Creating a `input` type which is used as our mutation `createEvent` argument placeholder.
```

input EventInput {
    title:String!
    description:String!
    price:Float!
    date:String!
}

type RootMutation {
    createEvent(eventInput: EventInput):Event
}
```
Now lets use these definitions in our resolver function.
```
const events=[];//defined globally

    rootValue: {
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
```
Now lets query the events from our graph ql UI. `localhost:3002/graphql`
```
query {
  events {
    title
    price
  }
}
```
Now you can specify which part of the api that you want here I only need the title and the price.
  
  

  
Now lets create our data with the `createEvent` mutaion.
```
mutation{
  createEvent(eventInput:{
    title:"My new Event",
    description:"Check if this works",
    price:10.22,
    date:"2012-12-12"
  }){
    title
    price
    description
  }
}
```
The above createEvent mutation is called with a payload also after the `createEvent` mutation is called we are also
retrieving the `title`,`price`,`description` that is sent as the response.

