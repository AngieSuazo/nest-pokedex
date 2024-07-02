export interface HttpAdapter{
    get<T>(url: string): Promise<T>;
}

//Clase adaptadora  para paquetes de terceros 
//Generico T: tipo de datos que recibo será del mismo tipo que devuelvo
//Luego inyección de dependencias en el constructor private readonly "http":HttpAdapter
//El HttpAdapater puede implementar a una clase, 
//ejm " export class PokeApiAdapter implements HttpAdapater"
//    " export class PokeFetchAdapter implements HttpAdapater"

