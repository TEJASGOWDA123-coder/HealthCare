package com.mednex.hms_backend.auth.qr;

import com.mednex.hms_backend.auth.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/qr")
@CrossOrigin(origins = "*")
public class QrAuthController {

    @Autowired
    private QrAuthService qrAuthService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/session")
    public Map<String, String> createSession() {
        return Map.of("sessionId", qrAuthService.createSession());
    }

    @PostMapping("/authorize")
    public Map<String, String> authorizeSession(@RequestBody Map<String, String> body) {
        String sessionId = body.get("sessionId");
        String mobileToken = body.get("mobileToken");

        System.out.println("DEBUG: Authorizing session: " + sessionId);
        System.out.println("DEBUG: Mobile token: " + (mobileToken != null ? "PRESENT" : "MISSING"));

        if (sessionId == null || !qrAuthService.isValidSession(sessionId)) {
            System.err.println("DEBUG: Invalid session ID.");
            return Map.of("status", "ERROR", "message",
                    "Invalid or expired session. Please refresh the QR code on your computer.");
        }

        String email;
        String role;

        if ("SIMULATED_MOBILE_TOKEN".equals(mobileToken)) {
            System.out.println("DEBUG: Using simulated mobile token for demo.");
            email = body.getOrDefault("email", "admin@hospitalA.com");
            role = body.getOrDefault("role", "ADMIN");
        } else {
            // Validate mobile token and extract user
            try {
                if (!jwtService.isTokenValid(mobileToken)) {
                    System.err.println("DEBUG: Token validation failed.");
                    return Map.of("status", "ERROR", "message",
                            "Invalid mobile session. Please ensure you are logged in on your mobile app.");
                }
                email = jwtService.extractEmail(mobileToken);
                role = jwtService.extractRole(mobileToken);
            } catch (Exception e) {
                System.err.println("DEBUG: Token parsing failed: " + e.getMessage());
                return Map.of("status", "ERROR", "message", "Error processing mobile token.");
            }
        }

        qrAuthService.authorizeSession(sessionId, email, role);
        return Map.of("status", "SUCCESS");
    }

    @GetMapping("/status/{sessionId}")
    public Map<String, Object> getStatus(@PathVariable String sessionId) {
        QrAuthService.QrSessionInfo info = qrAuthService.getSession(sessionId);

        if (info == null) {
            return Map.of("status", "EXPIRED");
        }

        if ("AUTHORIZED".equals(info.getStatus())) {
            // Generate a web token for the user
            String webToken = jwtService.generateToken(info.getEmail(), info.getRole());

            // Clean up session
            qrAuthService.removeSession(sessionId);

            return Map.of(
                    "status", "SUCCESS",
                    "token", webToken,
                    "role", info.getRole(),
                    "email", info.getEmail());
        }

        return Map.of("status", info.getStatus());
    }
}
