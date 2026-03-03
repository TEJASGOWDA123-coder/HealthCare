package com.mednex.hms_backend.auth;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ADMIN, DOCTOR, NURSE, PATIENT

    private String fullName; // Display name e.g. "Dr. Sarah Khan"

    private String specialization; // e.g. Cardiology, Orthopedics, General Medicine
}
