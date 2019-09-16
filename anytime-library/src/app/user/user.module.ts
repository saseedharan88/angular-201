import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../shared/material.module';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent, BookReturnDialogComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ProfileComponent, DashboardComponent, BookReturnDialogComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    BookReturnDialogComponent
  ],
  providers: [],
})
export class UserModule { }
