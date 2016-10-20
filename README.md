# pokemon-graphql-server
GraphQL server for Poke API.

---

## Setup
```
$ npm install
```

## Run
```
$ npm start
```

Open `http://localhost:3000/graphiql` on your browser.

## Run Query
Input a query in a textarea on the screen as below.

```
{
  posts {
    id
    title
    votes
    author {
      id
      firstName
      lastName
      posts {
        id
        title
      }
    }
  }
}
``` 

Then click "Execute Query" button, now you can see the result on the right hand side on the screen.
