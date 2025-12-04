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

  currentDate = signal(new Date());
  selectedDay = signal<Date | null>(null);
  appointmentsSignal = this.bookingService.appointments;

  constructor() {
    console.log("Kalender geladen. Aktuelle Termine:", this.appointmentsSignal());
  }

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

  get monthDates(): Date[] {
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1);
    const weekday = firstDay.getDay(); 
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
      const timeA = a.time || '';
      const timeB = b.time || '';
      return timeA.localeCompare(timeB);
    });
  }

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

  isPast(date: Date): boolean {
    const today = new Date();
    return this.formatDateKey(date) < this.formatDateKey(today);
  }

  selectDay(day: Date) {
    this.selectedDay.set(day);
  }

  clearSelection() {
    this.selectedDay.set(null);
  }

  // ✅ KORRIGIERT: /app/ hinzugefügt!
  createBooking(day: Date) {
    if (this.isPast(day)) {
      alert("Buchungen in der Vergangenheit sind nicht möglich.");
      return;
    }

    const formatted = this.formatDateKey(day);
    
    // HIER WAR DER FEHLER! Jetzt mit /app/
    this.router.navigate(['/app/bookings/new'], {
      queryParams: { date: formatted, returnTo: 'calendar' }
    });
  }

  deleteBooking(id: number) {
    if(confirm('Termin wirklich löschen?')) {
      this.bookingService.delete(id);
    }
  }
}