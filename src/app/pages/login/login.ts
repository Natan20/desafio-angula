import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// Uso da biblioteca RxJS: Importando a engrenagem Subject e os operadores solicitados
import { Subject, Subscription } from 'rxjs';
import { map, debounceTime, filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Módulos essenciais para as diretivas funcionarem
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  // Diretivas do Angular: Variáveis ligadas ao ngModel do HTML
  usuarioDigitado: string = '';
  senhaDigitada: string = '';
  
  // Diretivas do Angular: Controla a exibição do bloco de erro com o ngIf
  exibirErroLogin: boolean = false;

  // RxJS: Canal reativo (Subject) que vai receber os eventos de digitação do e-mail
  private monitorDigitacao$ = new Subject<string>();
  private inscricaoRxjs!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Uso da biblioteca RxJS por meio de seus operadores encadeados dentro do pipe()
    this.inscricaoRxjs = this.monitorDigitacao$.pipe(
      // Operator 1 (filter): Bloqueia e impede a continuação se o texto for muito curto ou vazio
      filter(texto => texto.trim().length > 0),
      
      // Operator 2 (debounceTime): Aguarda 400 milissegundos de pausa na digitação para disparar o fluxo
      debounceTime(400),
      
      // Operator 3 (distinctUntilChanged): Ignora se o valor atual for idêntico ao último verificado
      distinctUntilChanged(),
      
      // Operator 4 (map): Transforma os caracteres digitados para letras minúsculas de forma reativa
      map(texto => texto.toLowerCase())
    ).subscribe(textoTratado => {
      // Executa uma ação em segundo plano com o dado tratado pelo RxJS
      console.log('E-mail tratado pelo RxJS pronto para validação:', textoTratado);
    });
  }

  // Função chamada pelo evento (input) do HTML a cada caractere inserido
  onChaveDigitada(): void {
    this.monitorDigitacao$.next(this.usuarioDigitado);
  }

  validarAcesso(): void {
    // Reseta o estado do alerta do ngIf antes de testar
    this.exibirErroLogin = false;

    if (this.usuarioDigitado.trim() === 'admin' && this.senhaDigitada === '123456') {
      localStorage.setItem('logado', 'true');
      this.router.navigate(['/home']);
    } else {
      // Diretivas do Angular: Ativa a flag para o ngIf renderizar o alerta do Bootstrap na tela
      this.exibirErroLogin = true;
    }
  }

  ngOnDestroy(): void {
    // Boa prática profissional: Desinscreve do fluxo RxJS ao sair da tela para evitar vazamento de memória
    if (this.inscricaoRxjs) {
      this.inscricaoRxjs.unsubscribe();
    }
  }
}