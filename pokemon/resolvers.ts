import hapi from 'hapi';
import lodash from 'lodash';
import firebase from 'firebase';
import { Observable } from 'rxjs/Rx';
const DataLoader = require('dataloader');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

import { Pokemon, First } from './schema';


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
    pokemonById(root: any, args: { id: number }, context: Context): Promise<Pokemon> {
      console.log({ root, args, context: context.firebase.auth().currentUser });
      return pokemonLoader.load(args.id);
    },

    pokemonByName(root: any, args: { name: string }, context: Context): Promise<Pokemon> {
      console.log({ root, args, context: context.auth });
      return pokemonLoader.load(args.name);
    },

    first(root: any, args: any, context: Context): Promise<First> {
      console.log({ root, args, context: context.firebase.auth().currentUser });
      const promise = firebase.database().ref('first').once('value') as Promise<any>;
      return Observable.from(promise)
        .map<First>(snapshot => snapshot.val())
        .timeoutWith(1000 * 10, Observable.empty())
        .toPromise();
    },
  },
};


interface DataLoader<T> {
  load(arg: any): Promise<T>;
}

type Context = hapi.Request & { firebase: firebase.app.App }; 