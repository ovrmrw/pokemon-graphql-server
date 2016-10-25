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
  pokemonByName(name:"bulbasaur"){
    id
    name
    weight
  }
  pokemonById(id:1){
    id
    name
    weight
  }
}
``` 

In this case, the id of "bulbasaur" is 1, therefore API request is sent once not twice.
Moreover, even if you click Run button any number of times, DataLoader sends API request only first once because of its caching feature.

