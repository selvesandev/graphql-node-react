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