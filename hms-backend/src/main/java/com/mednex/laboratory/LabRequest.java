package com.mednex.laboratory;

import com.mednex.hms_backend.auth.User;
import com.mednex.hms_backend.patients.model.entity.Patient;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.Instant;

@Entity
@Table(name = "mednex_lab_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @Column(nullable = false)
    private String testType; // BLOOD_WORK, X_RAY, MRI, etc.

    private String status; // PENDING, PROCESSING, COMPLETED, CANCELLED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant updatedAt;
}
