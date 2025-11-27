import { Injectable, signal } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  // Signal für alle Termine → Änderungen werden automatisch erkannt
  private appointmentsSignal = signal<Appointment[]>([]);

  appointments = this.appointmentsSignal.asReadonly();

  constructor() {
    // Beispiel-Daten
    this.appointmentsSignal.set([
      {
        id: 1,
        title: 'Meeting',
        date: '2025-10-01',
        time: '10:00',
        duration: 60,
        personName: 'Max',
        withWhom: 'Anna',
        purpose: 'Projektbesprechung',
        email: 'max@example.com',
        status: 'pending'
      }
    ]);
  }

  getAll(): Appointment[] {
    return this.appointmentsSignal();
  }

  getById(id: number): Appointment | undefined {
    return this.appointmentsSignal().find(a => a.id === id);
  }

  addBooking(appointment: Appointment): void {
    const current = this.appointmentsSignal();
    this.appointmentsSignal.set([...current, appointment]);
  }

  updateBooking(appointment: Appointment): void {
    this.appointmentsSignal.set(
      this.appointmentsSignal().map(a =>
        a.id === appointment.id ? appointment : a
      )
    );
  }

  confirmBooking(id: number): void {
    this.updateStatus(id, 'confirmed');
  }

  rejectBooking(id: number): void {
    this.updateStatus(id, 'rejected');
  }

  delete(id: number): void {
    this.appointmentsSignal.set(
      this.appointmentsSignal().filter(a => a.id !== id)
    );
  }

  nextId(): number {
    const ids = this.appointmentsSignal().map(a => a.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private updateStatus(id: number, status: 'pending' | 'confirmed' | 'rejected') {
    const updated = this.appointmentsSignal().map(a =>
      a.id === id ? { ...a, status } : a
    );
    this.appointmentsSignal.set(updated);
  }
}
