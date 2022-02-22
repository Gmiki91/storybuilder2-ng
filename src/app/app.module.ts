import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationInterceptor } from './authentication/authentication.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { DailyComponent } from './daily/daily.component';
import { StoryCardComponent } from './components/story-card/story-card.component';
import { SortByComponent } from './home/sort-by/sort-by.component';
import { FilterComponent } from './home/filter/filter.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    DailyComponent,
    StoryCardComponent,
    SortByComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers:[   { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi:true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
