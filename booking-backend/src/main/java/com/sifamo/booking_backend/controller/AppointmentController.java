package com.sifamo.booking_backend.controller;

import com.sifamo.booking_backend.model.Appointment;
import com.sifamo.booking_backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;             // <--- WICHTIG
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException; // <--- WICHTIG

import java.time.LocalTime;   // <--- DAS HAT GEFEHLT!
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:4200")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // 1. Alle Termine holen
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // 2. Neuen Termin anlegen (MIT KONFLIKTPRÜFUNG)
    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment newApp) {

        // A) Wir suchen nur Termine, die DIESE Person an DIESEM Tag schon hat
        List<Appointment> existingApps = appointmentRepository.findByDateAndPersonName(
                newApp.getDate(),
                newApp.getPersonName()
        );

        // B) Berechne Start- und Endzeit des NEUEN Termins
        // LocalTime.parse("10:00") wandelt den String in ein rechenbares Zeitobjekt um
        LocalTime newStart = LocalTime.parse(newApp.getTime());
        LocalTime newEnd = newStart.plusMinutes(newApp.getDuration());

        // C) Prüfe auf Kollisionen
        for (Appointment existing : existingApps) {
            LocalTime existingStart = LocalTime.parse(existing.getTime());
            LocalTime existingEnd = existingStart.plusMinutes(existing.getDuration());

            // Die Logik: Wenn sich die Zeiten überschneiden
            boolean overlap = newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);

            if (overlap) {
                // Fehler 409 (Conflict) zurücksenden
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Konflikt! " + newApp.getPersonName() + " hat da schon einen Termin: " + existing.getTitle());
            }
        }

        // D) Wenn alles gut ist: Speichern
        return appointmentRepository.save(newApp);
    }

    // 3. Termin löschen
    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
    }

    // 4. Termin bearbeiten
    @PutMapping("/{id}")
    public Appointment updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setTitle(appointmentDetails.getTitle());
                    appointment.setDate(appointmentDetails.getDate());
                    appointment.setTime(appointmentDetails.getTime());
                    appointment.setDuration(appointmentDetails.getDuration());
                    appointment.setPersonName(appointmentDetails.getPersonName());
                    appointment.setWithWhom(appointmentDetails.getWithWhom());
                    appointment.setPurpose(appointmentDetails.getPurpose());
                    appointment.setStatus(appointmentDetails.getStatus());
                    return appointmentRepository.save(appointment);
                })
                .orElse(null);
    }
}