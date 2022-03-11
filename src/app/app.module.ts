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
import { NewStoryComponent } from './forms/new-story/new-story.component';
import { RateLevelComponent } from './forms/rate-level/rate-level.component'
@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS,
    NewStoryComponent,
    RateLevelComponent
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
