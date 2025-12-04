import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.scss'] 
})
export class BookingFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],  // ← WICHTIG: null statt 0!
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      duration: [60, [Validators.min(1)]],
      personName: [''],
      withWhom: [''],
      purpose: [''],
      email: ['', Validators.email],
      status: ['pending']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const appointment = this.bookingService.getById(id);
      
      if (appointment) {
        this.isEdit = true;
        this.form.patchValue(appointment);
      } else {
        // ✅ KORRIGIERT: /app/ hinzugefügt
        this.router.navigate(['/app/bookings']);
      }
    }

    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.form.patchValue({ date: params['date'] });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const val: Appointment = this.form.value;

  if (this.isEdit && val.id) {
    this.bookingService.updateBooking(val);
  } else {
    // ✅ DIESE ZEILE LÖSCHEN: val.id = this.bookingService.nextId();
    this.bookingService.addBooking(val);  // Die ID wird automatisch auf null gesetzt im Service
  }

  this.navigateBack();
}
  cancel(): void {
    this.navigateBack();
  }

  // ✅ KORRIGIERT: Alle Pfade haben jetzt /app/ am Anfang
  private navigateBack(): void {
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    if (returnTo === 'calendar') {
      this.router.navigate(['/app/calendar']);  // ← HIER WAR DER FEHLER!
    } else {
      this.router.navigate(['/app/bookings']);  // ← UND HIER!
    }
  }
}