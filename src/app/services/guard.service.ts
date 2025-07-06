import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const guard: CanActivateFn = async () => {
  
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = await auth.waitForAuthInit(); 

  if (user) {
    return true;
  } else {
    router.navigate(['sign-in']);
    return false;
  }
};
