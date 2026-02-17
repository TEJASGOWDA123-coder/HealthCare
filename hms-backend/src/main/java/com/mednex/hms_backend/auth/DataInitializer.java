package com.mednex.hms_backend.auth;

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
        if (userRepository.count() == 0) {
            // Seed Admin
            userRepository.save(User.builder()
                    .email("admin@mednex.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build());

            // Seed Doctor
            userRepository.save(User.builder()
                    .email("doctor@mednex.com")
                    .password(passwordEncoder.encode("doctor123"))
                    .role("DOCTOR")
                    .build());

            // Seed Nurse
            userRepository.save(User.builder()
                    .email("nurse@mednex.com")
                    .password(passwordEncoder.encode("nurse123"))
                    .role("NURSE")
                    .build());

            System.out.println("Default users seeded: admin@mednex.com / admin123, etc.");
        }
    }
}
