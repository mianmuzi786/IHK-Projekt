import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router'; // Router importieren
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      
      <main class="main-content">
        <header class="top-bar">
          <h2>Terminverwaltung</h2>
          
          <div class="user-info">
            <div class="user-details">
              <span class="name">{{ authService.currentUserEmail() }}</span>
              <span class="role-badge">{{ authService.currentUserRole() }}</span>
            </div>
            <div class="avatar">
              {{ authService.currentUserEmail().charAt(0).toUpperCase() }}
            </div>
            <button (click)="authService.logout()" class="logout-btn" title="Abmelden">⏻</button>
          </div>
        </header>
        
        <div class="content-area">
          <router-outlet></router-outlet> 
        </div>

      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; font-family: 'Segoe UI', sans-serif; }
    .app-container { display: flex; height: 100vh; width: 100vw; background-color: #f5f7fb; overflow: hidden; }
    .main-content { flex: 1; display: flex; flex-direction: column; height: 100%; min-width: 0; }
    .top-bar { height: 70px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-shrink: 0; }
    
    .user-info { display: flex; align-items: center; gap: 12px; }
    .user-details { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.2; }
    .name { font-weight: 600; font-size: 0.9rem; color: #333; }
    .role-badge { font-size: 0.7rem; background: #eee; padding: 2px 6px; border-radius: 4px; color: #666; font-weight: bold; }
    .avatar { background: #3f51b5; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .logout-btn { background: none; border: 1px solid #ddd; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; color: #d32f2f; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .logout-btn:hover { background: #ffebee; border-color: #d32f2f; }

    /* WICHTIG: Damit der Inhalt sichtbar ist */
    .content-area { flex: 1; overflow-y: auto; padding: 2rem; }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
}