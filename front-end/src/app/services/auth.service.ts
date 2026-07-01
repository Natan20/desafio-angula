import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface UsuarioLogado {
  id: number | string;
  nome: string;
  email: string;
}

// Serviço responsável pela busca/autenticação do usuário no back-end (Passo 3)
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  login(nome: string, senha: string): Observable<UsuarioLogado> {
    return this.http.post<UsuarioLogado>(`${this.apiUrl}/login`, { nome, senha }).pipe(
      catchError((erro) => throwError(() => erro))
    );
  }

  estaLogado(): boolean {
    return localStorage.getItem('logado') === 'true';
  }

  logout(): void {
    localStorage.removeItem('logado');
  }
}
