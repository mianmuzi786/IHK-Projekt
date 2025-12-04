import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ← Pfad anpassen!

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = '';
  password = '';
  errorMsg = '';
  isLoading = false;

  login() {
    // Validierung
    if (!this.email || !this.password) {
      this.errorMsg = 'Bitte alle Felder ausfüllen.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    // Echte Backend-Authentifizierung
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('✅ Login erfolgreich:', response);
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        console.error('❌ Login fehlgeschlagen:', err);
        this.isLoading = false;
        
        // Benutzerfreundliche Fehlermeldung
        if (err.status === 401) {
          this.errorMsg = 'Falsche E-Mail oder Passwort.';
        } else if (err.status === 0) {
          this.errorMsg = 'Backend nicht erreichbar. Läuft Spring Boot?';
        } else {
          this.errorMsg = 'Login fehlgeschlagen. Bitte erneut versuchen.';
        }
      }
    });
  }
}