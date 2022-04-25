import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPwComponent } from './authentication/forgot-pw/forgot-pw.component';
import { LoginComponent } from './authentication/login/login.component';
import { ResetPwComponent } from './authentication/reset-pw/reset-pw.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyComponent } from './faq/privacy.component';
import { TermsComponent } from './faq/terms.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { StatsComponent } from './profile/stats/stats.component';
import { PublicGuard } from './shared/public.guard';
import { StoryComponent } from './story/story.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent, canActivate:[PublicGuard]},
  {path:'signup',component:SignupComponent, canActivate:[PublicGuard]},
  {path:'profile',component:ProfileComponent},
  {path:'story/:id',component:StoryComponent},
  {path:'stats',component:StatsComponent},
  {path:'forgot',component:ForgotPwComponent},
  {path:'reset/:token',component:ResetPwComponent},
  {path:'faq',component:FaqComponent},
  {path:'privacy',component:PrivacyComponent},
  {path:'terms',component:TermsComponent},
  {path:'**',component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
