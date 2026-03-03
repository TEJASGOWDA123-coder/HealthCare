package com.mednex.hms_backend.admissions.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionDto {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    private String patientName;

    @NotNull(message = "Admission date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate admissionDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dischargeDate;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotBlank(message = "Doctor in charge is required")
    private String doctorInCharge;

    private String medicalHistory;

    private Long assignedDoctorId;
    private String status; // PENDING, ACTIVE, DISCHARGED

    private Instant createdAt;
    private Instant updatedAt;
}
