package com.mednex.hms_backend.dashboard.model.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long appointments;
    private double appointmentsTrend;
    private long surgeries;
    private double surgeriesTrend;
    private long totalPatients;
    private double patientsTrend;
}
