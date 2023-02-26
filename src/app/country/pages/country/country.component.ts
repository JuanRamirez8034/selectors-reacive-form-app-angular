import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap, switchMap } from 'rxjs';
import { Country, SmallResp } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit{

  public selectorForm : FormGroup;//variable para el formulario reactivo

  public regions    : string[] = [];
  public countries !: SmallResp[] | null;
  public borders   !: string[]    | null;
  public loading    : boolean = false;

  constructor(private contryService : CountryService) {

    // inicializando el formulario reactivo
    this.selectorForm = new FormGroup({
      region  : new FormControl(null, [Validators.required]),
      country : new FormControl(null, [Validators.required]),
      borders : new FormControl(null, [Validators.required])
    });

  }

  ngOnInit(): void {
    // obteniendo las regiones desde el servicio
    this.regions = this.contryService.regions;

    // trabajando con el selector de regiones
    this.selectorForm.get('region')?.valueChanges //capturando los valores cargados en el elemento y operando con estos
      .pipe(  //alterando las respuestas
        //utilizando el operador "tap (grifo)"  para realizar operacion de reset del campo "country" del formulario
        tap((value:string) => { 
          this.selectorForm.get('country')?.reset(''); 
          this.loading = true;
          this.selectorForm.get('borders')?.disable();
          this.borders = null;
        }),

        // utilizando el operador "sitchMap (interruptor de mapeo)" para converir realizar la consulta y retornar la respuest (arreglo de paises)
        switchMap((_region:string) => this.contryService.getData({mode:'region', search:_region, smallResp:true}))
      )
      .subscribe((_countries:Country[] | SmallResp[] | null)=>{//suscribiendonos al observable
        console.log(_countries);
        this.countries = _countries;
        this.loading = false;
    });

        
    // trabajando con el selector de paises
    this.selectorForm.get('country')?.valueChanges
      .pipe(
        tap((value:string) => { 
          this.selectorForm.get('borders')?.reset(''); 
          this.loading = true;
          this.selectorForm.get('borders')?.disable();
        }),
        switchMap((_alphaCode:string) => this.contryService.getCountry({mode:'alpha', search:_alphaCode, smallResp:false}))
      )
      .subscribe((_countries:Country[] | null)=>{
        if(_countries === null) {
          return;
        }
        console.log(_countries[0]?.borders);
        this.borders = _countries[0]?.borders || [];
        this.loading = false;
        if(this.borders.length > 0){
          this.selectorForm.get('borders')?.enable();
        }
    })
  
  }

  public save(){
    console.log('disp....');
    
    this.contryService.getData({mode:'region', search:this.selectorForm.get('region')?.value})
    .subscribe((resp:Country[] | SmallResp[] | null) => {
      resp?.forEach(element => {
        console.log(element.name.common +' -> ' + element.cca2);
        
      });
      
    });
  }


}
