import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name= createPokemonDto.name.toLowerCase();
    try {
      const pokemon= await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term:string) {
    let pokemon :Pokemon; //variable de tipo entity
    
    if ( !isNaN(+term)){ //si esto es un número
      pokemon =await this.pokemonModel.findOne({no: term});
    }

    //MongoI
    if ( !pokemon && isValidObjectId(term)){ //No evalue si ya tenemos un pokemon 
      pokemon=await this.pokemonModel.findById(term);
    }

    //Name
    if( !pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()})
    }

    if( !pokemon) //Excepción controlada
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);

   return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
  
    const pokemon =await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name=updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
      //updatePokemonDto tiene la info actualizada, espacir el pokemon JSON es decir espacir todas las propiedades que tiene
      //sobreescribir las propiedades (actualizadas) que tiene el pokemonDto
      
    } catch (error) {
       this.handleExceptions(error);
    }
  }

  async remove(id:string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne()
    //const result  = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});
    if (deletedCount ===0)
      throw new BadGatewayException(`Pokemon with id "${id}" not found`);

    return ;
  }

  //Excepciones no controladas
  private handleExceptions(error :any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in DB  ${JSON.stringify(error.keyValue)} ` )
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);  

  }
}