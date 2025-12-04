import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// Importiere deine Sidebar (Pfad ggf. anpassen)
import { SidebarComponent } from '../sidebar/sidebar'; 

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
            <span>Muzzafar Ahmad</span>
            <div style="width:32px; height:32px; background:#3f51b5; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">MA</div>
          </div>
        </header>
        
        <div class="content-area">
          <router-outlet></router-outlet> 
        </div>
      </main>
    </div>
  `,
  // Das CSS für das Layout direkt hier, damit es sicher geladen wird
  styles: [`
    :host { display: block; height: 100vh; font-family: 'Segoe UI', sans-serif; }
    .app-container { display: flex; height: 100vh; width: 100vw; background-color: #f5f7fb; overflow: hidden; }
    .main-content { flex: 1; display: flex; flex-direction: column; height: 100%; min-width: 0; }
    .top-bar { height: 70px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); flex-shrink: 0; }
    .user-info { display: flex; align-items: center; gap: 10px; font-weight: 600; }
    .content-area { flex: 1; overflow-y: auto; padding: 2rem; }
  `]
})
export class MainLayoutComponent {}