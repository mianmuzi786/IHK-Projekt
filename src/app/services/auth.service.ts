import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

// Das Interface passen wir an die neue Backend-Antwort an
interface LoginResponse {
  token: string;
  email: string;
  role: string; // NEU: Das Backend schickt jetzt "ADMIN" oder "USER"
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:8080/api/auth';
  
  // WICHTIG: Der Name muss zum Interceptor passen! 
  // Wir nutzen hier 'auth_token', da wir das im Interceptor so festgelegt haben.
  private tokenKey = 'auth_token'; 

  // --- SIGNALS FÜR DIE OBERFLÄCHE ---
  // Damit können wir im HTML direkt {{ authService.currentUserEmail() }} schreiben
  currentUserEmail = signal<string>(localStorage.getItem('auth_email') || '');
  currentUserRole = signal<string>(localStorage.getItem('auth_role') || '');

  // Login
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // 1. Alles im Browser-Speicher ablegen (fürs Neuladen der Seite)
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('auth_email', response.email);
          localStorage.setItem('auth_role', response.role);

          // 2. Signals sofort updaten (damit sich Header/Menü sofort ändern)
          this.currentUserEmail.set(response.email);
          this.currentUserRole.set(response.role);
          
          console.log('✅ Login erfolgreich als:', response.role);
        })
      );
  }

  // Logout
  logout() {
    // Alles löschen
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_role');
    
    // Signals leeren
    this.currentUserEmail.set('');
    this.currentUserRole.set('');
    
    // Zum Login leiten
    this.router.navigate(['/login']);
  }

  // --- HILFSMETHODEN ---

  // Prüft, ob jemand eingeloggt ist (Token existiert)
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // NEU: Prüft, ob der aktuelle User ein Admin ist
  // Das brauchen wir gleich für das *ngIf bei den Buttons
  isAdmin(): boolean {
    return this.currentUserRole() === 'ADMIN';
  }
}