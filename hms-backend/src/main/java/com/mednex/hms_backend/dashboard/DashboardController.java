package com.mednex.hms_backend.dashboard;

import com.mednex.hms_backend.admissions.repository.AdmissionRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final AdmissionRepository admissionRepository;
    private final int TOTAL_BEDS = 100; // Example total capacity

    public DashboardController(AdmissionRepository admissionRepository) {
        this.admissionRepository = admissionRepository;
    }

    @GetMapping("/bed-occupancy")
    public Map<String, Long> getBedOccupancy() {
        long occupied = admissionRepository.countByStatus("ACTIVE");
        long available = TOTAL_BEDS - occupied;

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", (long) TOTAL_BEDS);
        stats.put("occupied", occupied);
        stats.put("available", available);
        return stats;
    }
}
