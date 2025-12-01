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
  // WICHTIG: Prüfe, ob deine Datei wirklich .component.scss heißt oder nur .scss
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
      time: ['', Validators.required], // Zeit sollte meistens auch Pflicht sein
      duration: [60, [Validators.min(1)]], // Standarddauer 60 min, keine negativen Zahlen
      personName: [''],
      withWhom: [''],
      purpose: [''],
      email: ['', Validators.email], // Optional: Email-Validierung falls Text eingegeben wird
      status: ['pending']
    });

    // 1️⃣ Prüfen, ob ein Termin zur Bearbeitung geladen wird
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      // Achtung: Da wir Signals nutzen, ist getById synchron möglich
      const appointment = this.bookingService.getById(id);
      
      if (appointment) {
        this.isEdit = true;
        this.form.patchValue(appointment);
      } else {
        // Falls Termin gelöscht wurde oder ID falsch ist
        this.router.navigate(['/bookings']);
      }
    }

    // 2️⃣ Prüfen, ob ein Datum über Query-Parameter gesetzt wurde (kommt später vom Kalender)
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.form.patchValue({ date: params['date'] });
      }
    });
  }

  // --- NEUE HILFSMETHODE FÜR DAS HTML ---
  // Prüft, ob ein Feld ungültig UND berührt wurde (für rote Rahmen)
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  save(): void {
    // UX-Tipp für die IHK:
    // Wenn Formular ungültig ist, markieren wir alles als "touched",
    // damit die roten Fehlermeldungen sofort aufleuchten.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val: Appointment = this.form.value;

    if (this.isEdit && val.id) {
      this.bookingService.updateBooking(val);
      // alert('Termin aktualisiert'); -> Alerts sind oft nicht gern gesehen (UX), aber okay für Prototyp
    } else {
      // ID Logik: Im echten Backend macht das die DB. Hier simulieren wir es.
      val.id = this.bookingService.nextId();
      this.bookingService.addBooking(val);
    }

    // Zurück navigieren
    this.navigateBack();
  }

  cancel(): void {
    this.navigateBack();
  }

  // Kleine Hilfsmethode für das Zurücknavigieren
  private navigateBack(): void {
    const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    if (returnTo === 'calendar') {
      this.router.navigate(['/calendar']);
    } else {
      this.router.navigate(['/bookings']);
    }
  }
}