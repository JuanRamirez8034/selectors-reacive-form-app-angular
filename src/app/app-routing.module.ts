import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./shared/pages/not-found/not-found.component";

const routes : Routes = [
  {
    path:'selectors',
    loadChildren : ()=> import('./country/country.module') .then(m => m.CountryModule)
  },
  {
    path:'404',
    component:NotFoundComponent
  },
  {
    path:'**',
    redirectTo:'404'
  }
];

@NgModule({
  imports:[
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule{ }