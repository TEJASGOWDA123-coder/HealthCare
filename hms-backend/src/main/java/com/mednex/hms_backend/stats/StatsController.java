package com.mednex.hms_backend.stats;

import com.mednex.billing.Invoice;
import com.mednex.billing.InvoiceRepository;
import com.mednex.hms_backend.admissions.repository.AdmissionRepository;
import com.mednex.hms_backend.auth.UserRepository;
import com.mednex.hms_backend.patients.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class StatsController {

    private final PatientRepository patientRepository;
    private final AdmissionRepository admissionRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;

    @GetMapping("/overview")
    public ResponseEntity<StatsDto> getOverview() {
        long patientCount = patientRepository.count();
        long totalAdmissions = admissionRepository.count();
        long activeAdmissions = admissionRepository.findAll().stream()
                .filter(a -> a != null && "Admitted".equalsIgnoreCase(a.getStatus()))
                .count();

        List<Invoice> invoices = invoiceRepository.findAll();

        // Null-safe revenue calculation
        double totalRevenue = invoices.stream()
                .map(Invoice::getAmount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();

        double paidRevenue = invoices.stream()
                .filter(i -> "Paid".equalsIgnoreCase(i.getStatus()))
                .map(Invoice::getAmount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();

        double pendingRevenue = invoices.stream()
                .filter(i -> "Pending".equalsIgnoreCase(i.getStatus()) || "Overdue".equalsIgnoreCase(i.getStatus()))
                .map(Invoice::getAmount)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();

        Map<String, Long> staffDistribution = new HashMap<>();
        userRepository.findAll().forEach(user -> {
            if (user != null) {
                String role = user.getRole();
                if (role != null && !"PATIENT".equalsIgnoreCase(role)) {
                    staffDistribution.put(role, staffDistribution.getOrDefault(role, 0L) + 1);
                }
            }
        });

        return ResponseEntity.ok(StatsDto.builder()
                .totalPatients(patientCount)
                .totalAdmissions(totalAdmissions)
                .activeAdmissions(activeAdmissions)
                .totalRevenue(totalRevenue)
                .paidRevenue(paidRevenue)
                .pendingRevenue(pendingRevenue)
                .staffDistribution(staffDistribution)
                .build());
    }
}
