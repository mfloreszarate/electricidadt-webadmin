import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => import("./modules/admin/admin.module").then(m => m.AdminModule),
    // canActivate: [authGuard]
  },
  // {
  //   path: "unauthorized",
  //   loadComponent: () =>
  //     import('./shared/components/unauthorized/unauthorized.component')
  //       .then(c => c.UnauthorizedComponent)

  // },
  {
    path: "",
    loadChildren: () => import("./modules/public/public.module").then(m => m.PublicModule),
    // canActivate: [redirectGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
