import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';


export const routes: Routes = [
  // Se entrar no endereço vazio, vai direto para o Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Caminhos das nossas páginas
  { path: 'login', component: LoginComponent },

  
  // Se digitar qualquer coisa errada, volta para o login
  { path: '**', redirectTo: 'login' }
  
];
