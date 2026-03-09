package com.mednex.appointment;

import com.mednex.hms_backend.auth.User;
import com.mednex.hms_backend.patients.model.entity.Patient;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "mednex_appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = true)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = true)
    private User doctor; // User with role DOCTOR

    @Column(nullable = true)
    private LocalDateTime startTime;

    @Column(nullable = true)
    private LocalDateTime endTime;

    private String type; // CONSULTATION, SURGERY, etc.
    private String status; // BOOKED, CANCELLED, COMPLETED

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant updatedAt;
}
