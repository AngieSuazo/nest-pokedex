import {  MinLength,IsString, IsInt, IsPositive,Min} from 'class-validator';
export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    @IsString()
    @MinLength(1)
    name: string;


}
