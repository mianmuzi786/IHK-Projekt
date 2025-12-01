import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.html',
  styleUrls: ['./calendar-view.scss']
})
export class CalendarView {
  
public bookingService = inject(BookingService);
  public router = inject(Router);

  // Wir nutzen ein Signal für das aktuelle Datum, damit sich alles automatisch aktualisiert
  currentDate = signal(new Date());
  
  selectedDay = signal<Date | null>(null);

  // Wir holen die Termine aus dem Service
  appointmentsSignal = this.bookingService.appointments;

  constructor() {
    // DEBUG: Das zeigt dir in der Browser-Konsole (F12), ob Daten da sind
    console.log("Kalender geladen. Aktuelle Termine:", this.appointmentsSignal());
  }

  /** -------------------------- Navigation ---------------------------- */
  
  prevMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  goToToday() {
    this.currentDate.set(new Date());
  }

  /** -------------------------- Gitter-Berechnung ---------------------------- */
  
  // Diese Methode berechnet die Tage für das Grid
  // Da currentDate jetzt ein Signal ist, nutzen wir computed() oder rufen es als Getter auf
  get monthDates(): Date[] {
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();

    // Der 1. des Monats
    const firstDay = new Date(year, month, 1);
    
    // Wochentag des 1. (0=So, 1=Mo...)
    const weekday = firstDay.getDay(); 
    
    // Montag als Starttag erzwingen:
    // Wenn 1. = So (0) -> -6 Tage
    // Wenn 1. = Mo (1) -> 0 Tage
    const diff = weekday === 0 ? -6 : 1 - weekday;
    
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() + diff);

    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }

  /** -------------------------- Buchungs-Logik ---------------------------- */

  // WICHTIG: Sichere Umwandlung von Date -> String "YYYY-MM-DD"
  // Ohne Zeitzonen-Verschiebung!
  private formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getBookingsForDay(day: Date): Appointment[] {
    const dayKey = this.formatDateKey(day);
    
    const dailyAppointments = this.appointmentsSignal().filter(a => a.date === dayKey);
    
    return dailyAppointments.sort((a, b) => {
      // Wir nutzen (a.time || '') -> Das bedeutet: "Nimm a.time, aber wenn es leer ist, nimm ''"
      // Damit ist TypeScript zufrieden, weil es immer ein String ist.
      const timeA = a.time || '';
      const timeB = b.time || '';
      return timeA.localeCompare(timeB);
    });
  }

  /** -------------------------- Helfer ---------------------------- */

  isToday(date: Date): boolean {
    const today = new Date();
    return this.formatDateKey(date) === this.formatDateKey(today);
  }

  isSameMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate().getMonth();
  }

  isSelected(date: Date): boolean {
    const selected = this.selectedDay();
    if (!selected) return false;
    return this.formatDateKey(selected) === this.formatDateKey(date);
  }

  // NEU: Prüft, ob ein Datum in der Vergangenheit liegt (Gestern oder früher)
  isPast(date: Date): boolean {
    const today = new Date();
    // Wir vergleichen einfach die Strings "2025-11-30" < "2025-12-01"
    // Das funktioniert alphabetisch perfekt für ISO-Daten
    return this.formatDateKey(date) < this.formatDateKey(today);
  }

  selectDay(day: Date) {
    this.selectedDay.set(day);
  }

  clearSelection() {
    this.selectedDay.set(null);
  }

  createBooking(day: Date) {
    // 1. Sicherheits-Check: Ist es in der Vergangenheit?
    if (this.isPast(day)) {
      alert("Buchungen in der Vergangenheit sind nicht möglich.");
      return; // Abbruch
    }

    // 2. Datum formatieren (wir nutzen jetzt die Hilfsmethode, das ist sauberer)
    const formatted = this.formatDateKey(day);
    
    // 3. Weiterleiten
    this.router.navigate(['/bookings/new'], {
      queryParams: { date: formatted, returnTo: 'calendar' }
    });
  }

  deleteBooking(id: number) {
    if(confirm('Termin wirklich löschen?')) {
      this.bookingService.delete(id);
    }
  }
}