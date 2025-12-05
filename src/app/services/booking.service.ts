import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../models/appointment.model';
import { tap } from 'rxjs/operators'; // WICHTIG für das Signal-Update

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/appointments';
  
  // Unser zentraler Speicher (Signal)
  private appointmentsSignal = signal<Appointment[]>([]);
  appointments = this.appointmentsSignal.asReadonly();

  constructor() {
    this.loadAll();
  }

  // --- 1. ALLE LADEN (GET) ---
  loadAll(): void {
    // Hier nutzen wir noch subscribe, da es im Hintergrund passiert
    this.http.get<Appointment[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.appointmentsSignal.set(data);
        console.log('✅ Daten geladen:', data.length);
      },
      error: (err) => console.error('❌ Fehler beim Laden:', err)
    });
  }

  // --- 2. HINZUFÜGEN (POST) ---
  // Gibt Observable zurück -> Komponente kümmert sich um Subscribe & Fehleranzeige
  addBooking(appointment: Appointment) {
    const backendPayload = {
      title: appointment.title,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      personName: appointment.personName,
      withWhom: appointment.withWhom,
      purpose: appointment.purpose,
      email: appointment.email,
      status: 'pending'
    };

    return this.http.post<Appointment>(this.apiUrl, backendPayload).pipe(
      tap(savedAppointment => {
        // Erfolgsfall: Wir aktualisieren sofort unser lokales Signal
        const current = this.appointmentsSignal();
        this.appointmentsSignal.set([...current, savedAppointment]);
      })
    );
  }

  // --- 3. LÖSCHEN (DELETE) ---
  // Gibt Observable zurück (falls wir später auch hier Fehler anzeigen wollen)
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.appointmentsSignal();
        this.appointmentsSignal.set(current.filter(a => a.id !== id));
      })
    ).subscribe(); // Hier subscribe ich direkt, da Delete meist ohne Feedback läuft (oder man ändert es auch)
  }

  // --- 4. UPDATE (PUT) ---
  // Gibt Observable zurück -> Komponente zeigt Erfolg/Fehler
  updateBooking(appointment: Appointment) {
    return this.http.put<Appointment>(`${this.apiUrl}/${appointment.id}`, appointment).pipe(
      tap(updatedAppointment => {
        const current = this.appointmentsSignal();
        this.appointmentsSignal.set(
          current.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
        );
      })
    );
  }

  // --- Hilfsmethoden für Buttons in der Liste ---
  confirmBooking(id: number): void {
    const booking = this.getById(id);
    if (booking) {
      const updated = { ...booking, status: 'confirmed' as const };
      // Wir subscriben hier direkt, da es nur ein Klick in der Liste ist
      this.updateBooking(updated).subscribe(); 
    }
  }

  rejectBooking(id: number): void {
    const booking = this.getById(id);
    if (booking) {
      const updated = { ...booking, status: 'rejected' as const };
      this.updateBooking(updated).subscribe();
    }
  }

  getById(id: number): Appointment | undefined {
    return this.appointmentsSignal().find(a => a.id === id);
  }
}