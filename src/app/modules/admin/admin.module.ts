import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../../shared/components/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmployesModule } from "./employes/employes.module";
import { AdminRoutes } from "./admin.routes";
import { DashboardComponent } from "./dashboard/dashboard.component";

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    AdminRoutes,
    CommonModule,
    EmployesModule,
    MaterialModule
  ]
})
export class AdminModule { }
