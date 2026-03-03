package com.mednex.hms_backend.config.seed;

import com.mednex.hms_backend.activity.Activity;
import com.mednex.hms_backend.activity.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class ActivitySeeder implements CommandLineRunner {

        private final ActivityRepository activityRepository;

        @Override
        public void run(String... args) {
                if (activityRepository.count() == 0) {
                        activityRepository.saveAll(Arrays.asList(
                                        Activity.builder()
                                                        .type("ADMISSION")
                                                        .title("New Patient Admitted")
                                                        .description("Michael Rodriguez was admitted to Cardiology Dept.")
                                                        .performedBy("Admin Sarah")
                                                        .status("success")
                                                        .timestamp(Instant.now().minus(15, ChronoUnit.MINUTES))
                                                        .build(),
                                        Activity.builder()
                                                        .type("BILLING")
                                                        .title("Invoice Paid")
                                                        .description("Invoice INV-2007 for David Miller was marked as PAID ($15,000.00)")
                                                        .performedBy("System")
                                                        .status("success")
                                                        .timestamp(Instant.now().minus(2, ChronoUnit.HOURS))
                                                        .build(),
                                        Activity.builder()
                                                        .type("APPOINTMENT")
                                                        .title("Appointment Cancelled")
                                                        .description("Dr. John Carter cancelled appointment for Emma Thompson.")
                                                        .performedBy("Dr. John Carter")
                                                        .status("warning")
                                                        .timestamp(Instant.now().minus(5, ChronoUnit.HOURS))
                                                        .build(),
                                        Activity.builder()
                                                        .type("SYSTEM")
                                                        .title("Security Update")
                                                        .description("System firewall rules were updated successfully.")
                                                        .performedBy("Network Admin")
                                                        .status("info")
                                                        .timestamp(Instant.now().minus(1, ChronoUnit.DAYS))
                                                        .build()));
                        System.out.println("✅ Seeded Activity Data");
                }
        }
}
