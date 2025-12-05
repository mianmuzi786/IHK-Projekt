import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.scss']
})
export class BookingListComponent {
  
  private bookingService = inject(BookingService);
  public authService = inject(AuthService);

  // 1. Signal für Suchtext
  searchTerm = signal('');

  // 2. Filter-Logik (Jetzt sicher gegen undefined Fehler!)
  filteredBookings = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const all = this.bookingService.appointments();

    if (!term) return all; 

    return all.filter(b => 
      // Wir nutzen ( ... || '') um sicherzugehen, dass es ein String ist
      (b.title || '').toLowerCase().includes(term) ||
      (b.personName || '').toLowerCase().includes(term) ||
      (b.withWhom || '').toLowerCase().includes(term) ||
      (b.date || '').includes(term)
    );
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  deleteBooking(id: number): void {
    if(confirm('Möchtest du diesen Termin wirklich löschen?')) {
      this.bookingService.delete(id);
    }
  }

  confirmBooking(id: number): void {
    this.bookingService.confirmBooking(id);
  }

  rejectBooking(id: number): void {
    this.bookingService.rejectBooking(id);
  }
}