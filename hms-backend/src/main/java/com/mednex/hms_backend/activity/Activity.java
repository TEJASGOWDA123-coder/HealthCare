package com.mednex.hms_backend.activity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // ADMISSION, APPOINTMENT, BILLING, SYSTEM
    private String title;
    private String description;
    private String performedBy;

    @Builder.Default
    private Instant timestamp = Instant.now();

    private String status; // info, success, warning, error
}
