import { Component, OnInit, inject } from '@angular/core';
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
  
  // --- Modal Steuerung ---
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['10:00', Validators.required],
      duration: [60],
      personName: ['', Validators.required],
      withWhom: [''],
      purpose: [''],
      email: [''],
      status: ['pending']
    });

    // Prüfen, ob wir bearbeiten (ID in URL)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      const id = Number(idParam);
      const entry = this.bookingService.getById(id);
      if (entry) {
        this.isEdit = true;
        this.form.patchValue(entry);
      }
    }
    
    // Prüfen, ob Datum aus Kalender übergeben wurde
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

    // HIER ist die Änderung: Wir holen das Observable vom Service
    const requestObservable = this.isEdit && val.id 
      ? this.bookingService.updateBooking(val) 
      : this.bookingService.addBooking(val);

    // ... und abonnieren es HIER (subscribe), damit wir reagieren können
    requestObservable.subscribe({
      next: () => {
        // Erfolg!
        this.openModal('success', 'Gespeichert', 'Der Termin wurde erfolgreich angelegt.');
        // Nach 1.5 Sekunden zurück zum Dashboard
        setTimeout(() => this.router.navigate(['/app/dashboard']), 1500);
      },
      error: (err) => {
        // Fehler!
        console.error('Fehler im Formular:', err);
        let msg = 'Ein unbekannter Fehler ist aufgetreten.';

        // Backend Fehler auswerten
        if (err.status === 409) {
          msg = err.error?.message || 'Konflikt: Zu dieser Zeit existiert bereits ein Termin für diese Person.';
        } else if (err.status === 401 || err.status === 403) {
          msg = 'Sitzung abgelaufen. Bitte neu anmelden.';
        }

        this.openModal('error', 'Fehler', msg);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/app/dashboard']);
  }

  // Modal Methoden
  openModal(type: 'success' | 'error', title: string, message: string) {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}