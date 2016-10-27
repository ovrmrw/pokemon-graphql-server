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

In this case, fetching pokemon by name "bulbasaur" and by id 1 are cached when they are fetched once.
Even if you click Run button any number of times, DataLoader will send API request only once for the first time because of its caching feature.
