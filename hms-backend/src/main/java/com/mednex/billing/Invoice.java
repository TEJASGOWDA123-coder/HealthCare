package com.mednex.billing;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber;
    private String patientName;
    private LocalDate date;
    private String method;

    private Double amount;

    private String status; // PAID, PENDING, OVERDUE

    @Builder.Default
    private Instant createdAt = Instant.now();
}
