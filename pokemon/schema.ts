export const schema = `

type Pokemon {
  id: Int!
  name: String!
  order: Int!
  weight: Int!
  base_experience: Int!
}

type First {
  test: Int
  test2: Int
  test3: Int
}

type Query {
  pokemonById(id: Int): Pokemon
  pokemonByName(name: String): Pokemon
  first: First 
}

`;


export interface Pokemon {
  forms?: Form[];
  abilities?: Ability[];
  stats?: Stat[];
  name?: string;
  weight?: number;
  base_experience?: number;
  types?: Type[];
  sprites?: Sprite;
  id?: number;
  order?: number;
  game_indices?: GameIndex[];
}

export interface Form extends UrlAndName {
  url: string;
  name: string;
}

export interface Ability {
  slot: number;
  is_hidden: boolean;
  ability: UrlAndName;
}

export interface Stat {
  stat: UrlAndName;
  effort: number;
  base_stat: number;
}

export interface Type {
  slot: number;
  type: UrlAndName;
}

export interface Sprite {
  back_female?: string;
  back_shiny_female?: string;
  back_default?: string;
  front_female?: string;
  front_shiny_female?: string;
  back_shiny?: string;
  front_default?: string;
  front_shiny?: string;
}

export interface GameIndex {
  version: UrlAndName;
  game_index: number;
}

export interface UrlAndName {
  url: string;
  name: string;
}

export interface First {
  test: number
  test2: number
  test3: number
}