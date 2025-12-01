import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // RouterLink kann weg!

// Deine Sidebar importieren
import { SidebarComponent } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  // Nur das importieren, was wir im app.html wirklich nutzen:
  imports: [CommonModule, RouterOutlet, SidebarComponent], 
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {} // Oder class App, wie du es hattest