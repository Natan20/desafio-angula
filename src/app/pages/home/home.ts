import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  // Injeção do serviço de rotas para navegação programática
  constructor(private router: Router) {}

  // Recarrega ou mantém o fluxo na própria página Home
  irParaHome(): void {
    this.router.navigate(['/home']);
  }

  // Passo 7: Disponibiliza o link/comando de acesso para a página Dashboard
  irParaDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  // Passo 5: Item de logout que limpa a credencial local e expulsa o usuário para a tela de login
  efetuarLogout(): void {
    localStorage.removeItem('logado'); // Remove a flag de autenticação
    this.router.navigate(['/login']);  // Redireciona para a entrada
  }
}