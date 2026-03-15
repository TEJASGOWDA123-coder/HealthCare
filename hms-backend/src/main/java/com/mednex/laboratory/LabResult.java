package com.mednex.laboratory;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.Instant;

@Entity
@Table(name = "mednex_lab_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "request_id", nullable = false)
    private LabRequest request;

    @Column(columnDefinition = "TEXT")
    private String resultText;

    private String fileUrl; // Path to PDF or image result

    @Builder.Default
    private Instant createdAt = Instant.now();
}
