package com.mednex.hms_backend.config.seed;

import com.mednex.hms_backend.config.TenantContext;
import com.mednex.appointment.Appointment;
import com.mednex.appointment.AppointmentRepository;
import com.mednex.hms_backend.auth.UserRepository;
import com.mednex.hms_backend.auth.User;
import com.mednex.hms_backend.patients.model.entity.Patient;
import com.mednex.hms_backend.patients.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class AppointmentSeeder implements CommandLineRunner {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    @Override
    public void run(String... args) {
        seedForTenant("tenantA");
        seedForTenant("tenantB");
    }

    private void seedForTenant(String tenantId) {
        TenantContext.setTenant(tenantId);
        try {
            System.out.println("📅 Seeding appointments for " + tenantId + "...");
            appointmentRepository.deleteAll(); // Force refresh for development

            // Get or create dummy patient and doctor for seeding
            Patient patient = patientRepository.findAll().stream().findFirst().orElse(null);
            User doctor = userRepository.findAll().stream()
                    .filter(u -> "DOCTOR".equals(u.getRole()))
                    .findFirst().orElse(null);

            if (patient != null && doctor != null) {
                appointmentRepository.saveAll(Arrays.asList(
                        Appointment.builder()
                                .patient(patient)
                                .doctor(doctor)
                                .startTime(LocalDateTime.now().plusHours(2))
                                .endTime(LocalDateTime.now().plusHours(3))
                                .type("Consultation")
                                .status("BOOKED")
                                .build(),
                        Appointment.builder()
                                .patient(patient)
                                .doctor(doctor)
                                .startTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0))
                                .endTime(LocalDateTime.now().plusDays(1).withHour(11).withMinute(0))
                                .type("Follow-up")
                                .status("BOOKED")
                                .build()));
                System.out.println("✅ " + tenantId + " appointment seeding complete");
            } else {
                System.out.println(
                        "ℹ️ Skipping appointment seeding for " + tenantId + " because patient or doctor not found.");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Could not seed appointments for " + tenantId + ": " + e.getMessage());
        } finally {
            TenantContext.clear();
        }
    }
}
