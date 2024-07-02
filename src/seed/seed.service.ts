import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapater';


@Injectable()
export class SeedService {
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly http:AxiosAdapter,
    ){}


 async executeSeed(){

  await this.pokemonModel.deleteMany({}); //delete * from pokemons

  const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
 

  const pokemonToInsert: {name:String, no:number} [] =[];
  data.results.forEach(({name,url})=>{ //Ver nombre y número de pokemon 
    const segments =url.split('/');
    const no = +segments [segments.length -2]; //url viene como string hacemos conversión con + a number 
    pokemonToInsert .push({name, no});// [{name:bulbasaur, no:1}] Arreglo que contiene la definición del pokemon que queremos insertar
  }) ;
  
  await this.pokemonModel.insertMany(pokemonToInsert); //UNA INSERCIÓN CON MUCHAS ENTRADAS
      //? insert into pokemons (name, no) pov SQL
      //? (name:bulbasaur, no:1)
      //? (name:bulbasaur2, no:2) ...

  return 'Seed executed';

  
 }
}








  //HACEMOS MÚLTIPLES INSERCIONES  
  //const insertPromisesArray =[];
  // data.results.forEach(({name,url})=>{ //Ver nombre y número de pokemon 
  //   const segments =url.split('/');
  //   const no = +segments [segments.length -2]; //url viene como string hacemos conversión con + a number 
  //   //const pokemon= await this.pokemonModel.create({name,no}); //insertar
  //   insertPromisesArray.push(
  //     this.pokemonModel.create({name,no}) //insertando promesas
  //   );
  // }) ;
  // await Promise.all(insertPromisesArray); //Todas inserciones simultáneas