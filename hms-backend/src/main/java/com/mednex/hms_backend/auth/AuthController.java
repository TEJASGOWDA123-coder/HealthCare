package com.mednex.hms_backend.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private com.mednex.hms_backend.auth.qr.QrAuthService qrAuthService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");

        System.out.println("🔑 AuthController: Login attempt for email - " + email);

        // Set tenant based on email domain
        String tenant = "tenantA";
        if (email != null && email.contains("hospitalB")) {
            tenant = "tenantB";
        } else if (email != null && email.contains("hospitalA")) {
            tenant = "tenantA";
        }
        System.out.println("🔑 AuthController: Detected tenant - " + tenant);
        com.mednex.hms_backend.config.TenantContext.setTenant(tenant);

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));

            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            // Create a QR session for 2FA
            String sessionId = qrAuthService.createSession();

            return Map.of(
                    "requires2fa", true,
                    "sessionId", sessionId,
                    "role", user.getRole(),
                    "email", user.getEmail());
        } finally {
            com.mednex.hms_backend.config.TenantContext.clear();
        }
    }
}
