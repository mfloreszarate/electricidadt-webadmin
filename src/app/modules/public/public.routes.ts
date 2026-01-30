import { ModuleWithProviders } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { Route, RouterModule, Routes } from "@angular/router"


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
]

export const PublicRoutes: ModuleWithProviders<Route> = RouterModule.forChild(routes)
