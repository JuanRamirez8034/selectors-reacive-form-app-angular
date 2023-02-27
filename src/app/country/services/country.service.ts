import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable, of } from 'rxjs';
import { SeacrhMode, SmallResp, Country } from '../interfaces/country.interface';


@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private API_URL : string = 'https://restcountries.com/v3.1';

  private _regions : string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];//regiones disponibles
  
  constructor(private http :HttpClient) { }

  // metodo para devolver las regiones
  public get regions():string[]{
    return [...this._regions];
  }


  // // funcion para retornar observable de solicitudes http
  // public getData_(mode:SeacrhMode):Observable<SmallResp[]>{

  //   let url = `${this.API_URL}/${mode.mode}/${mode.search}${mode.smallResp ? '?fields=cca2,name' : ''}`;

  //   return this.http.get<SmallResp[]>(url);
  // }

  // funcion para retornar observable de solicitudes http
  public getData(mode:SeacrhMode):Observable<Country[] | SmallResp[] | null>{

    if(!mode.search){
      return of(null);
    }

    let url = `${this.API_URL}/${mode.mode}/${mode.search}${mode.smallResp ? '?fields=cca2,name' : ''}`;

    return mode.smallResp ? this.http.get<SmallResp[]>(url) : this.http.get<Country[]>(url);
  }

  // funcion para retornar observable de solicitudes http
  public getCountry(mode:SeacrhMode):Observable<Country[] | null>{

    if(!mode.search){
      return of(null);
    }

    let url = `${this.API_URL}/${mode.mode}/${mode.search}`;

    return this.http.get<Country[]>(url);
  }

  // funcion para buscar los nombres de los paises, retorna un pais
  public getContrySmallByCode(code:string):Observable<SmallResp>{
    return this.http.get<SmallResp>(`${this.API_URL}/alpha/${code}?fields=cca2,name`);
  }

  // funcion para buscar las capitales, recibe un arreglo de codigos de bordes de paises y retorna un arreglo con los datos de smallResp
  public getCountryByArrayCodes(bordersCodes:string[]):Observable<SmallResp[]>{
    
    if(!bordersCodes || bordersCodes.length <= 0) return of([]);

    // creando el arreglo de peticiones a realizar
    const _request : Observable<SmallResp>[] = bordersCodes.map((code:string)=>{
      return this.getContrySmallByCode(code);
    });

    // ejecutando todas las peticiones y retornando el arreglo de paises
    return combineLatest(_request);
  }
}
