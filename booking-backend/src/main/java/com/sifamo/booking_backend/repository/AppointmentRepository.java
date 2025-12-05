package com.sifamo.booking_backend.repository;

import com.sifamo.booking_backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // ALT (zu allgemein):
    // List<Appointment> findByDate(LocalDate date);

    // NEU (Besser): Finde alle Termine an einem Tag für eine bestimmte Person
    List<Appointment> findByDateAndPersonName(LocalDate date, String personName);

}