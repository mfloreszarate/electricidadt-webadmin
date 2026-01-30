import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "./material.module";
import { ConfirmDialogComponent } from "./common/confirm-dialog/confirm-dialog.component";
import { ConnectionIndicatorComponent } from "./common/connection-indicator/connection-indicator.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { QuickAccessComponent } from "./common/quick-access/quick-access.component";
import { AppLayoutComponent } from "./layout/main/layout.component";


@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ConnectionIndicatorComponent,
    SidebarComponent,
    QuickAccessComponent,
    AppLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ]
})
export class SharedModule {
}
