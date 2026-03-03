package com.mednex.hms_backend.config.seed;

import com.mednex.hms_backend.config.TenantContext;
import com.mednex.appointment.Appointment;
import com.mednex.appointment.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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
            System.out.println("📅 Seeding appointments for " + tenantId + "...");
            appointmentRepository.deleteAll(); // Force refresh for development
            if (appointmentRepository.count() == 0) {
                appointmentRepository.saveAll(Arrays.asList(
                        Appointment.builder()
                                .patientName("Alice Green")
                                .doctorName("Dr. Miller")
                                .department("Cardiology")
                                .date("2026-03-04")
                                .time("10:00 AM")
                                .type("Consultation")
                                .status("Confirmed")
                                .build(),
                        Appointment.builder()
                                .patientName("Bob Wilson")
                                .doctorName("Dr. Sarah")
                                .department("Neurology")
                                .date("2026-03-05")
                                .time("02:30 PM")
                                .type("Follow-up")
                                .status("Confirmed")
                                .build(),
                        Appointment.builder()
                                .patientName("Charlie Brown")
                                .doctorName("Dr. Smith")
                                .department("Orthopedics")
                                .date("2026-03-02")
                                .time("09:15 AM")
                                .type("Surgery")
                                .status("Completed")
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
