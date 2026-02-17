package com.mednex.appointment;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.time.Instant;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateTime;
    private String patient;
    private String specialist;
    private String type;

    private String status; // SCHEDULED / COMPLETED / CANCELLED

    @Builder.Default
    private Instant createdAt = Instant.now();
}
