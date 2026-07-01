import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  // Variáveis conectadas ao ngModel do HTML
  usuarioDigitado: string = '';
  senhaDigitada: string = '';
  exibirErroLogin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  // CORRIGIDO: Adicionada a função que o evento (input) do HTML estava procurando
  onChaveDigitada(): void {
    // Aqui você pode deixar a lógica do RxJS ou apenas o monitoramento temporário
    console.log('Usuário digitando:', this.usuarioDigitado);
  }

  // Função disparada no (submit) do formulário: busca/valida o usuário no back-end (Passo 3)
  validarAcesso(): void {
    this.exibirErroLogin = false;

    this.authService.login(this.usuarioDigitado.trim(), this.senhaDigitada).subscribe({
      next: () => {
        localStorage.setItem('logado', 'true');
        this.router.navigate(['/home']);
      },
      error: () => {
        this.exibirErroLogin = true;
        // App roda em modo zoneless: sem isso a view não percebe a mudança vinda do subscribe
        this.cdr.markForCheck();
      },
    });
  }
}