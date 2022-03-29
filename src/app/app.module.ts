import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationInterceptor } from './authentication/authentication.interceptor';
import {MAT_MODULES} from './mat.modules'
import {COMPONENTS} from './components';
import { ForgotPwComponent } from './authentication/forgot-pw/forgot-pw.component';
import { ResetPwComponent } from './authentication/reset-pw/reset-pw.component';

@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS,
    ForgotPwComponent,
    ResetPwComponent
  ],
  imports: [
    MAT_MODULES,
    BrowserModule, 
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers:[   { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi:true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
