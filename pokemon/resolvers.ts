import hapi from 'hapi';
import lodash from 'lodash';
const DataLoader = require('dataloader');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

import { Pokemon } from './schema';


const pokemonLoader: DataLoader<Pokemon> = new DataLoader((args: (number | string)[]) => new Promise((resolve, reject) => {
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
    pokemonById(root: any, args: { id: number }, context: hapi.Request): Pokemon {
      console.log({ root, args, context: context.auth });
      return pokemonLoader.load(args.id);
    },

    pokemonByName(root: any, args: { name: string }, context: hapi.Request): Pokemon {
      console.log({ root, args, context: context.auth });
      return pokemonLoader.load(args.name);
    },
  },
};


interface DataLoader<T> {
  load(arg: any): Promise<T>;
}
