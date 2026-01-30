import { NgModule } from "@angular/core";
import { EmployeesListComponent } from "./list/employees.component";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../../../shared/components/material.module";
import { EmployeeEditComponent } from "./create/employee-edit.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmployeesRoutes } from "./employees.routes";

@NgModule({
  declarations: [
    EmployeesListComponent,
    EmployeeEditComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeesRoutes,
  ],
})
export class EmployesModule { }
