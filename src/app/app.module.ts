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
import { RateLevelComponent } from './forms/rate-level/rate-level.component';
import { EditStoryComponent } from './forms/edit-story/edit-story.component';
import { TimerComponent } from './daily/timer/timer.component';
import { StatsComponent } from './profile/stats/stats.component';
import { NewPageComponent } from './forms/new-page/new-page.component';
import { AuthorComponent } from './components/author/author.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { NotesComponent } from './notes/notes.component'
@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS,
    NewStoryComponent,
    RateLevelComponent,
    EditStoryComponent,
    TimerComponent,
    StatsComponent,
    NewPageComponent,
    AuthorComponent,
    NotFoundComponent,
    SettingsComponent,
    NotesComponent
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
