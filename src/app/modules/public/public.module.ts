import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/components/shared.module";
import { MaterialModule } from "../../shared/components/material.module";
import { PublicRoutes } from "./public.routes";


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    PublicRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ]
})
export class PublicModule { }
