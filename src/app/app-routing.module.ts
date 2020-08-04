import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { WelcomeComponent } from "./welcome/welcome.component";

const routes: Routes = [
  {path: 'login', pathMatch:'full', component : LoginComponent},
  {path: 'register', pathMatch:'full', component : RegisterComponent},
  {path: 'welcome', pathMatch:'full', component : WelcomeComponent},
  {path: '', pathMatch:'full', component : LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingcomponents  = [LoginComponent, RegisterComponent ]
