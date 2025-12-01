import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      
      <div class="stats-grid">
        
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="bi bi-collection-fill"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Alle Termine</span>
            <span class="stat-number">{{ totalCount() }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon yellow">
            <i class="bi bi-hourglass-split"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Ausstehend</span>
            <span class="stat-number">{{ pendingCount() }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Bestätigt</span>
            <span class="stat-number">{{ confirmedCount() }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <i class="bi bi-calendar-event-fill"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Heute</span>
            <span class="stat-number">{{ todayCount() }}</span>
          </div>
        </div>

      </div>
      <div class="content-grid">
        
        <div class="card recent-bookings">
          <div class="card-header">
            <h3>Letzte Buchungen</h3>
            <a routerLink="/bookings" class="view-all">Alle ansehen</a>
          </div>
          
          <div class="table-responsive">
            <table class="simple-table">
              <thead>
                <tr>
                  <th>Titel</th>
                  <th>Datum</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of recentBookings()">
                  <td>{{ b.title }}</td>
                  <td>{{ b.date }}</td>
                  <td>
                    <span class="badge" [ngClass]="b.status">{{ b.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="recentBookings().length === 0" class="empty-msg">
              Keine Buchungen vorhanden.
            </div>
          </div>
        </div>

        <div class="card quick-actions">
          <h3>Schnellzugriff</h3>
          <div class="action-buttons">
            <button class="action-btn" routerLink="/bookings/new">
              <span class="big-icon">➕</span>
              Neuen Termin anlegen
            </button>
            <button class="action-btn" routerLink="/calendar">
              <span class="big-icon">📆</span>
              Zum Kalender
            </button>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* --- Stats Grid (Kacheln oben) --- */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .stat-icon.blue { background: #e3f2fd; color: #1565c0; }
    .stat-icon.yellow { background: #fff8e1; color: #f57f17; }
    .stat-icon.green { background: #e8f5e9; color: #2e7d32; }
    .stat-icon.purple { background: #f3e5f5; color: #7b1fa2; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-label { color: #888; font-size: 0.9rem; font-weight: 500; }
    .stat-number { font-size: 1.8rem; font-weight: 700; color: #333; margin-top: 5px; }

    /* --- Content Grid (Unten) --- */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr; /* Links breit, rechts schmal */
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      padding: 1.5rem;
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .card-header h3 { margin: 0; font-size: 1.1rem; color: #444; }
    .view-all { color: #304ffe; text-decoration: none; font-weight: 600; font-size: 0.9rem; }

    /* Tabelle */
    .simple-table { width: 100%; border-collapse: collapse; }
    .simple-table th { text-align: left; color: #888; font-size: 0.85rem; padding-bottom: 10px; border-bottom: 1px solid #eee; }
    .simple-table td { padding: 12px 0; border-bottom: 1px solid #f9f9f9; color: #333; }
    
    .badge { 
      padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; text-transform: uppercase; font-weight: 600; 
    }
    .badge.pending { background: #fff8e1; color: #f57f17; }
    .badge.confirmed { background: #e8f5e9; color: #2e7d32; }
    .badge.rejected { background: #ffebee; color: #c62828; }

    .empty-msg { text-align: center; padding: 2rem; color: #999; }

    /* Action Buttons */
    .action-buttons { display: flex; flex-direction: column; gap: 1rem; }
    .action-btn {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border: 1px solid #eee;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      color: #555;
      transition: all 0.2s;
    }
    .action-btn:hover { background: #eef2ff; border-color: #304ffe; color: #304ffe; }
    .big-icon { font-size: 1.5rem; }

    @media (max-width: 900px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent {
  private bookingService = inject(BookingService);
  
  // Signals direkt nutzen für Live-Updates
  appointments = this.bookingService.appointments;

  // Berechnete Werte (Computed Signals)
  // Angular 17+ Feature: computed() aktualisiert sich automatisch!
  totalCount = computed(() => this.appointments().length);
  
  pendingCount = computed(() => 
    this.appointments().filter(a => a.status === 'pending').length
  );
  
  confirmedCount = computed(() => 
    this.appointments().filter(a => a.status === 'confirmed').length
  );

  todayCount = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    return this.appointments().filter(a => a.date === todayStr).length;
  });

  // Neueste 5 Buchungen
  recentBookings = computed(() => {
    // Kopie erstellen und sortieren, dann slice
    return [...this.appointments()]
      .sort((a, b) => b.id - a.id) // Höchste ID zuerst (Neueste)
      .slice(0, 5);
  });
}