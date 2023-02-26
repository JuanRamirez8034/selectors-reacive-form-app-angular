import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryComponent } from './pages/country/country.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'country-selectors',
        component: CountryComponent
      },
      {
        path:'**',
        redirectTo:'country-selectors'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }
