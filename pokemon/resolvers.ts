import lodash from 'lodash';
const DataLoader = require('dataloader');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

import { Pokemon } from './schema';


const pokemonLoader = new DataLoader((args: Array<number | string>) => new Promise((resolve, reject) => {
  console.log('args:', args);
  const promises: Promise<any>[] = args.map(arg => P.getPokemonByName(arg));
  Promise.all(promises)
    .then(results => {
      console.log('fetch:', args);
      resolve(results);
    })
    .catch(err => reject(err));
}));


export const resolvers = {
  Query: {
    pokemonById(root: any, { id }: { id: number }): Pokemon {
      console.log(root, id);
      return pokemonLoader.load(id);
    },

    pokemonByName(root: any, { name }: { name: string }): Pokemon {
      console.log(root, name);
      return pokemonLoader.load(name);
    },
  },
};
