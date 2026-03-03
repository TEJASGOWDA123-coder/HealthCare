package com.mednex.hms_backend.auth;

import com.mednex.hms_backend.config.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedForTenant("tenantA", "hospitalA");
        seedForTenant("tenantB", "hospitalB");
    }

    private void seedForTenant(String tenantId, String domainSuffix) {
        TenantContext.setTenant(tenantId);
        try {
            String adminEmail = "admin@" + domainSuffix + ".com";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                System.out.println("🌱 Seeding users for " + tenantId + "...");

                userRepository.save(User.builder()
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .role("ADMIN")
                        .fullName("Hospital Admin")
                        .build());

                // Specialized Doctors
                seedDoctor(domainSuffix, "cardio", "Dr. Arjun Mehta", "Cardiology");
                seedDoctor(domainSuffix, "ortho", "Dr. Priya Sharma", "Orthopedics");
                seedDoctor(domainSuffix, "neuro", "Dr. Ravi Kumar", "Neurology");
                seedDoctor(domainSuffix, "general", "Dr. Sneha Patel", "General Medicine");
                seedDoctor(domainSuffix, "pulmo", "Dr. Ali Hassan", "Pulmonology");
                seedDoctor(domainSuffix, "gastro", "Dr. Meena Joshi", "Gastroenterology");

                userRepository.save(User.builder()
                        .email("nurse@" + domainSuffix + ".com")
                        .password(passwordEncoder.encode("nurse123"))
                        .role("NURSE")
                        .fullName("Head Nurse")
                        .build());

                // Sample Patient User
                userRepository.save(User.builder()
                        .email("patient@" + domainSuffix + ".com")
                        .password(passwordEncoder.encode("patient123"))
                        .role("PATIENT")
                        .fullName(domainSuffix.equals("hospitalA") ? "John Doe" : "Jane Doe")
                        .build());

                System.out.println("✅ " + tenantId + " seeding complete: " + adminEmail + " / admin123");
            } else {
                System.out.println("ℹ️ Users already seeded for " + tenantId);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Could not seed users for " + tenantId + ": " + e.getMessage());
            System.err.println("👉 Please ensure the 'users' table exists in database related to " + tenantId);
        } finally {
            TenantContext.clear();
        }
    }

    private void seedDoctor(String domainSuffix, String prefix, String fullName, String specialization) {
        String email = prefix + ".doctor@" + domainSuffix + ".com";
        if (userRepository.findByEmail(email).isEmpty()) {
            userRepository.save(User.builder()
                    .email(email)
                    .password(passwordEncoder.encode("doctor123"))
                    .role("DOCTOR")
                    .fullName(fullName)
                    .specialization(specialization)
                    .build());
        }
    }
}
