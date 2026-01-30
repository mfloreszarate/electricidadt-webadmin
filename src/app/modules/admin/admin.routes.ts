import { ModuleWithProviders } from "@angular/core"
import { Route, RouterModule, Routes } from "@angular/router"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { AppLayoutComponent } from "../../shared/components/layout/main/layout.component"

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [
          // authGuard,
          //  hasPermission({action:'read', entity: 'Dashboard', isMenuItem:true})
        ],
      },
      {
        path: 'empleados',
        // component: PoolTypes,
        loadChildren: () => import("./employes/employes.module").then(m => m.EmployesModule),
        canActivate: [
          // authGuard,
          // roleGuard([RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN]),
        ],
      },

    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }

]
// export default routes;
export const AdminRoutes: ModuleWithProviders<Route> = RouterModule.forChild(routes)
