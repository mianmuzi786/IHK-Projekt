import { Routes } from '@angular/router';
import { BookingListComponent } from './components/booking-list/booking-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { CalendarView } from './components/calendar-view/calendar-view';

export const routes: Routes = [
  { path: '', redirectTo: '/bookings', pathMatch: 'full' },
  { path: 'bookings', component: BookingListComponent },
  { path: 'bookings/new', component: BookingFormComponent },
  { path: 'bookings/:id', component: BookingFormComponent },
  { path: 'calendar', component: CalendarView },
];
