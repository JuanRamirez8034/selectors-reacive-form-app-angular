import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CountryRoutingModule } from './country-routing.module';
import { CountryComponent } from './pages/country/country.component';


@NgModule({
  declarations: [
    CountryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CountryRoutingModule
  ]
})
export class CountryModule { }
