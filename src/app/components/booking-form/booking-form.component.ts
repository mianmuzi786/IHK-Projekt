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
    // Formular initialisieren
    this.form = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: [''],
      duration: [30],
      personName: [''],
      withWhom: [''],
      purpose: [''],
      email: [''],
      status: ['pending']
    });

    // 1️⃣ Prüfen, ob ein Termin zur Bearbeitung geladen wird
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const appointment = this.bookingService.getById(id);
      if (appointment) {
        this.form.patchValue(appointment);
        this.isEdit = true;
      } else {
        alert('Termin nicht gefunden');
        this.router.navigate(['/bookings']);
      }
    }

    // 2️⃣ Prüfen, ob ein Datum über Query-Parameter gesetzt wurde (Kalenderansicht)
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.form.patchValue({ date: params['date'] });
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const val: Appointment = this.form.value;
    if (this.isEdit && val.id) {
      this.bookingService.updateBooking(val);
      alert('Termin aktualisiert');
    } else {
      val.id = this.bookingService.nextId();
      this.bookingService.addBooking(val);
      alert('Termin angelegt');
    }

    // Prüfen, ob Redirect-Ziel vorhanden
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    if (returnTo === 'calendar') {
      this.router.navigate(['/calendar']);
    } else {
      this.router.navigate(['/bookings']);
    }
  }


  cancel(): void {
    this.router.navigate(['/bookings']);
  }
}
