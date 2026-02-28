package com.mednex.hms_backend.config.seed;

import com.mednex.hms_backend.config.TenantContext;
import com.mednex.appointment.Appointment;
import com.mednex.appointment.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class AppointmentSeeder implements CommandLineRunner {

    private final AppointmentRepository appointmentRepository;

    @Override
    public void run(String... args) {
        seedForTenant("tenantA");
        seedForTenant("tenantB");
    }

    private void seedForTenant(String tenantId) {
        TenantContext.setTenant(tenantId);
        try {
            if (appointmentRepository.count() == 0) {
                System.out.println("📅 Seeding appointments for " + tenantId + "...");
                appointmentRepository.saveAll(Arrays.asList(
                        Appointment.builder()
                                .patient("Alice Green")
                                .specialist("Dr. Miller")
                                .dateTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0))
                                .type("Consultation")
                                .status("SCHEDULED")
                                .build(),
                        Appointment.builder()
                                .patient("Bob Wilson")
                                .specialist("Dr. Sarah")
                                .dateTime(LocalDateTime.now().plusDays(2).withHour(14).withMinute(30))
                                .type("Follow-up")
                                .status("SCHEDULED")
                                .build(),
                        Appointment.builder()
                                .patient("Charlie Brown")
                                .specialist("Dr. Smith")
                                .dateTime(LocalDateTime.now().minusDays(1).withHour(9).withMinute(15))
                                .type("Surgery")
                                .status("COMPLETED")
                                .build()));
                System.out.println("✅ " + tenantId + " appointment seeding complete");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Could not seed appointments for " + tenantId + ": " + e.getMessage());
            System.err.println("👉 Please ensure the 'appointments' table exists in database related to " + tenantId);
        } finally {
            TenantContext.clear();
        }
    }
}
