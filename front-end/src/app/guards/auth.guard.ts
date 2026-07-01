import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protege as rotas home/dashboard: só entra quem passou pelo login
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaLogado()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
