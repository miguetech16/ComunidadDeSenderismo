import { Routes } from '@angular/router';
import { SignInComponent } from './component/forms/sign-in/sign-in.component'; 
import { SignUpComponent } from './component/forms/sign-up/sign-up.component'; 
import { RoutesComponent } from './page/routes/routes.component'
import { UserProfileComponent } from './page/user-profile/user-profile.component';
import { CustomRoutesComponent } from './page/custom-routes/custom-routes.component';
import { PlannedRoutesComponent } from './page/planned-routes/planned-routes.component';
import { CommunityComponent } from './page/community/community.component';
import { RouteDescriptionComponent } from './page/route-description/route-description.component';
import { EditProfileComponent } from './page/edit-profile/edit-profile.component';
import { UserChatComponent } from './component/user-chat/user-chat.component';
import { ChatListComponent } from './page/chat-list/chat-list.component';
import { PlannedViewComponent } from './page/planned-view/planned-view.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { ForgotPasswordComponent } from './component/forms/forgot-password/forgot-password.component';
import { PlannedInviteComponent } from './component/planned-invite/planned-invite.component';
import { noUserGuard } from './services/no-user-guard';
import { guard } from './services/guard.service';

export const routes: Routes = [

  { path: '', redirectTo: 'routes', pathMatch: 'full' }, 

  // No Guards - no Input
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'community', component: CommunityComponent},

  // No Guards - Input
  { path: 'route-description/:routeid', component: RouteDescriptionComponent},

  // Guards - no Input
  { path: 'forgot-pass', component: ForgotPasswordComponent,
    canActivate: [noUserGuard]  },
  
  { path: 'planned-routes', component: PlannedRoutesComponent,
    canActivate: [guard] },

  { path: 'custom-routes', component: CustomRoutesComponent,
    canActivate: [guard] },

  // Guards - Imput
  
  { path: 'chat-list/:userid', component: ChatListComponent,
    canActivate: [guard]  },

  { path: 'user-chat/:chatId', component: UserChatComponent,
    canActivate: [guard]  },
  
  {path: 'edit-profile/:userid', component: EditProfileComponent,
    canActivate: [guard] },
    
  { path: 'user-profile/:userid', component: UserProfileComponent,
    canActivate: [guard] },

  { path: 'planned-view/:plannedid', component: PlannedViewComponent,
    canActivate: [guard]  },

    { path: 'planned-invite/:plannedid', component: PlannedInviteComponent,
    canActivate: [guard]  },
    
  { path: 'planned-routes/:routeid', component: PlannedRoutesComponent,
    canActivate: [guard] },

  {
    path: '**', component: NotFoundComponent
  }

];