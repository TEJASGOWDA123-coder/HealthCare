package com.mednex.hms_backend.stats;

import lombok.*;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {
    private long totalPatients;
    private long totalAdmissions;
    private long activeAdmissions;
    private double totalRevenue;
    private double paidRevenue;
    private double pendingRevenue;
    private Map<String, Long> staffDistribution;
}
