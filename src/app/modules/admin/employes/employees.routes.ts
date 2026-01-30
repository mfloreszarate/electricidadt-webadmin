import { Route, RouterModule, Routes } from "@angular/router"
import { ModuleWithProviders } from "@angular/core"
import { EmployeesListComponent } from "./list/employees.component"

const routes: Routes = [
  {
    path: '',
    component: EmployeesListComponent
  },
]
export const EmployeesRoutes: ModuleWithProviders<Route> = RouterModule.forChild(routes)
