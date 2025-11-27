import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Appointment } from '../../models/appointment.model';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-list.component.html'
})
export class BookingListComponent implements OnInit {
  bookings: Appointment[] = [];

  constructor(private bookingService: BookingService, public router: Router) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookings = this.bookingService.getAll();
  }

  deleteBooking(id: number): void {
    this.bookingService.delete(id);
    this.loadBookings();
  }

  confirmBooking(id: number): void {
    this.bookingService.confirmBooking(id);
    this.loadBookings();
  }

  rejectBooking(id: number): void {
    this.bookingService.rejectBooking(id);
    this.loadBookings();
  }

}
