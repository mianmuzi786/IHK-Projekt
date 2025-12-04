import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // Dein Backend gibt nur token zurück, email speichern wir selbst
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Passe die URL an dein Backend an!
  private apiUrl = 'http://localhost:8080/api/auth';
  
  // Signal für Login-Status
  isLoggedIn = signal<boolean>(this.hasToken());

  constructor() {
    // Beim Start prüfen, ob Token vorhanden ist
    this.isLoggedIn.set(this.hasToken());
  }

  // Login-Request an Backend
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Token speichern
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('user_email', email); // Email selbst speichern
          this.isLoggedIn.set(true);
          console.log('✅ Login erfolgreich, Token gespeichert');
        })
      );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
    console.log('✅ Logout erfolgreich');
  }

  // Token vorhanden?
  hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  // Token abrufen
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // User Email abrufen
  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  // User Role abrufen
  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }
}