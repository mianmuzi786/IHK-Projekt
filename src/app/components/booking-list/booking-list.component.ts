import { Component, inject } from '@angular/core'; // <--- 'inject' importieren
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.scss']
})
export class BookingListComponent {
  
  // STATT Constructor nutzen wir inject():
  private bookingService = inject(BookingService);

  // Jetzt funktioniert diese Zeile, weil bookingService oben schon da ist
  bookings = this.bookingService.appointments;

  // Der Constructor kann jetzt komplett weg (oder leer bleiben)
  // constructor() {} 

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