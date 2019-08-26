import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './shared/material.module';
import { AdminModule } from './admin/admin.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { ToolbarComponent } from './toolbar/toolbar.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PagenotfoundComponent,
    WelcomeComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AdminModule,
    BookModule,
    UserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FlexLayoutModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
