package com.mednex.hms_backend.admissions.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionDto {
    private Long id;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Admission date is required")
    private LocalDateTime admissionDate;

    private LocalDateTime dischargeDate;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotBlank(message = "Doctor in charge is required")
    private String doctorInCharge;

    private Map<String, Object> medicalHistory;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
