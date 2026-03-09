package com.mednex.hms_backend.activity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String patientId;
    private String action; // e.g., "VIEW_RECORDS", "EXPORT_PDF"

    @Builder.Default
    private Instant timestamp = Instant.now();

    private String details;
}
