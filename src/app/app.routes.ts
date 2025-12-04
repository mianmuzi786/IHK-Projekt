import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { DashboardComponent } from './components/dashboard/dashboard';
import { BookingListComponent } from './components/booking-list/booking-list.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { CalendarView } from './components/calendar-view/calendar-view';

export const routes: Routes = [
  // 1. Start -> Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Login (OHNE Layout)
  { path: 'login', component: LoginComponent },

  // 3. Geschützter Bereich (MIT Sidebar)
  {
    path: 'app',  // ← WICHTIG: Einen eindeutigen Pfad geben!
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // app/ → app/dashboard
      { path: 'dashboard', component: DashboardComponent },
      { path: 'bookings', component: BookingListComponent },
      { path: 'bookings/new', component: BookingFormComponent },
      { path: 'bookings/:id', component: BookingFormComponent },
      { path: 'calendar', component: CalendarView }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];