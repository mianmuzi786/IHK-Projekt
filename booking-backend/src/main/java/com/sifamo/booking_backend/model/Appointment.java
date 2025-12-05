package com.sifamo.booking_backend.model;

import jakarta.persistence.*;
import lombok.Data; // Spart uns Getter & Setter
import java.time.LocalDate;

@Entity // Sagt Spring: "Mach daraus eine Datenbank-Tabelle"
@Data   // Lombok: Erstellt automatisch Getter, Setter, toString, etc.
@Table(name = "appointments") // Name der Tabelle in MySQL
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-Increment (1, 2, 3...)
    private Long id;

    private String title;

    // Wir nutzen LocalDate für das Datum (YYYY-MM-DD)
    private LocalDate date;

    // Wir speichern Zeit erstmal als String ("10:00"), das ist am einfachsten für den Anfang
    private String time;

    private Integer duration;

    private String personName;
    private String withWhom;
    private String purpose;
    private String email;

    // Status: "pending", "confirmed", "rejected"
    private String status;
}