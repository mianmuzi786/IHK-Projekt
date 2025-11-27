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
  private bookingService = inject(BookingService);
  private router = inject(Router);

  currentDate = new Date();
  selectedDay = signal<Date | null>(null);

  viewMode: 'week' | 'month' = 'week';

  get appointments(): Appointment[] {
    return this.bookingService.getAll();
  }

  /** -------------------------- Umschalten ---------------------------- */
  setView(mode: 'week' | 'month') {
    this.viewMode = mode;
  }

  /** -------------------------- Woche ---------------------------- */
  getWeekDates(): Date[] {
    const start = new Date(this.currentDate);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  prevWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.currentDate = new Date(this.currentDate);
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.currentDate = new Date(this.currentDate);
  }

  /** -------------------------- Monat ---------------------------- */
  getMonthDates(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const start = new Date(firstDay);
    const weekday = firstDay.getDay();
    const diff = weekday === 0 ? -6 : 1 - weekday;
    start.setDate(start.getDate() + diff);

    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
  }

  /** -------------------------- Buchungen ---------------------------- */
  getBookingsForDay(day: Date) {
    return this.appointments.filter(
      a => new Date(a.date).toDateString() === day.toDateString()
    );
  }

  selectDay(day: Date) {
    this.selectedDay.set(day);
  }

  clearSelection() {
    this.selectedDay.set(null);
  }

  createBooking(day: Date) {
    const formatted = day.toISOString().split('T')[0];
    this.router.navigate(['/bookings/new'], {
      queryParams: { date: formatted, returnTo: 'calendar' }
    });
  }
}
