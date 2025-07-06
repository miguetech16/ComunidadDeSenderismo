import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const noUserGuard: CanActivateFn = async () => {
  
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = await auth.waitForAuthInit(); 

  if (user) {
    router.navigate(['routes']);
    return false;
  } else {
    return true;
  }
};
