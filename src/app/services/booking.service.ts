import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/appointments';
  private appointmentsSignal = signal<Appointment[]>([]);
  
  appointments = this.appointmentsSignal.asReadonly();

  constructor() {
    this.loadAll();
  }

  // --- 1. ALLE LADEN (GET) ---
  loadAll(): void {
    this.http.get<Appointment[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.appointmentsSignal.set(data);
        console.log('✅ Daten vom Backend geladen:', data);
      },
      error: (err) => console.error('❌ Fehler beim Laden:', err)
    });
  }

  // --- 2. HINZUFÜGEN (POST) ---
  // --- 2. HINZUFÜGEN (POST) ---
  addBooking(appointment: Appointment): void {
    // WICHTIG: Wir erstellen ein sauberes Objekt für das Backend
    const backendPayload = {
      title: appointment.title,
      date: appointment.date, // Muss "YYYY-MM-DD" sein
      time: appointment.time,
      duration: appointment.duration,
      personName: appointment.personName,
      withWhom: appointment.withWhom,
      purpose: appointment.purpose,
      email: appointment.email,
      status: 'pending' // Standard-Status setzen
      // WICHTIG: Wir senden KEINE 'id', damit Java nicht verwirrt ist
    };

    console.log('📤 Sende an Backend:', backendPayload);

    this.http.post<Appointment>(this.apiUrl, backendPayload).subscribe({
      next: (savedAppointment) => {
        console.log('✅ Erfolgreich gespeichert:', savedAppointment);
        const current = this.appointmentsSignal();
        this.appointmentsSignal.set([...current, savedAppointment]);
        
        // Optional: Alert oder Toast hier, damit du siehst, dass es geklappt hat
        alert('Termin wurde gespeichert!');
      },
      error: (err) => {
        console.error('❌ Fehler beim Speichern:', err);
        if (err.status === 403) {
          alert('Fehler: Nicht eingeloggt oder Token abgelaufen. Bitte neu anmelden.');
        } else if (err.status === 400) {
          alert('Fehler: Datenformat falsch. Prüfe Konsole.');
        } else {
          alert('Unbekannter Fehler: ' + err.message);
        }
      }
    });
  }

  // --- 3. LÖSCHEN (DELETE) ---
  delete(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        const current = this.appointmentsSignal();
        this.appointmentsSignal.set(current.filter(a => a.id !== id));
        console.log('✅ Termin gelöscht');
      },
      error: (err) => console.error('❌ Fehler beim Löschen:', err)
    });
  }

  // --- 4. UPDATE / STATUS ÄNDERN (PUT) ---
  updateBooking(appointment: Appointment): void {
    this.http.put<Appointment>(`${this.apiUrl}/${appointment.id}`, appointment).subscribe({
      next: (updatedAppointment) => {
        const current = this.appointmentsSignal();
        this.appointmentsSignal.set(
          current.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
        );
        console.log('✅ Termin aktualisiert:', updatedAppointment);
      },
      error: (err) => console.error('❌ Fehler beim Update:', err)
    });
  }

  // Hilfsmethode für Confirm/Reject Buttons
  confirmBooking(id: number): void {
    const booking = this.getById(id);
    if (booking) {
      const updated = { ...booking, status: 'confirmed' as const };
      this.updateBooking(updated);
    }
  }

  rejectBooking(id: number): void {
    const booking = this.getById(id);
    if (booking) {
      const updated = { ...booking, status: 'rejected' as const };
      this.updateBooking(updated);
    }
  }

  // Hilfsmethode (Lokal suchen)
  getById(id: number): Appointment | undefined {
    return this.appointmentsSignal().find(a => a.id === id);
  }
  
  // ✅ nextId() gelöscht - wird nicht mehr gebraucht!
}