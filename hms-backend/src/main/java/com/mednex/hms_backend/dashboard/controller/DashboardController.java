package com.mednex.hms_backend.dashboard.controller;

import com.mednex.hms_backend.admissions.repository.AdmissionRepository;
import com.mednex.hms_backend.dashboard.model.dto.DashboardStatsDto;
import com.mednex.hms_backend.patients.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final PatientRepository patientRepository;
    private final AdmissionRepository admissionRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        long patientCount = patientRepository.count();
        long admissionCount = admissionRepository.count();

        return ResponseEntity.ok(DashboardStatsDto.builder()
                .appointments(admissionCount)
                .appointmentsTrend(0.0)
                .surgeries(0)
                .surgeriesTrend(0.0)
                .totalPatients(patientCount)
                .patientsTrend(0.0)
                .build());
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<Object>> getSchedule() {
        // Returning empty list to "remove default thinks"
        return ResponseEntity.ok(new ArrayList<>());
    }

    @GetMapping("/occupancy")
    public ResponseEntity<List<Object>> getOccupancy() {
        // Returning empty list for now
        return ResponseEntity.ok(new ArrayList<>());
    }
}
