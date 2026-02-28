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

                // Seed Admin
                userRepository.save(User.builder()
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .role("ADMIN")
                        .build());

                // Seed Doctor
                userRepository.save(User.builder()
                        .email("doctor@" + domainSuffix + ".com")
                        .password(passwordEncoder.encode("doctor123"))
                        .role("DOCTOR")
                        .build());

                // Seed Nurse
                userRepository.save(User.builder()
                        .email("nurse@" + domainSuffix + ".com")
                        .password(passwordEncoder.encode("nurse123"))
                        .role("NURSE")
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
}
