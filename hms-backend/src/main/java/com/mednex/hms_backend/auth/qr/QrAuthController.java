package com.mednex.hms_backend.auth.qr;

import com.mednex.hms_backend.auth.JwtService;
import com.mednex.hms_backend.auth.User;
import com.mednex.hms_backend.auth.UserRepository;
import com.mednex.hms_backend.config.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth/qr")
@CrossOrigin(origins = "*")
public class QrAuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    // In-memory session storage (SessionId -> SessionInfo)
    private static final Map<String, QrSessionInfo> sessions = new ConcurrentHashMap<>();

    @GetMapping("/session")
    public Map<String, String> createSession() {
        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, new QrSessionInfo("PENDING"));
        return Map.of("sessionId", sessionId);
    }

    @PostMapping("/authorize")
    public Map<String, String> authorizeSession(@RequestBody Map<String, String> body) {
        String sessionId = body.get("sessionId");
        String mobileToken = body.get("mobileToken");

        if (sessionId == null || !sessions.containsKey(sessionId)) {
            throw new RuntimeException("Invalid session");
        }

        // Validate mobile token and extract user
        if (!jwtService.isTokenValid(mobileToken)) {
            throw new RuntimeException("Invalid mobile token");
        }

        String email = jwtService.extractEmail(mobileToken);
        String role = jwtService.extractRole(mobileToken);

        // Update session
        QrSessionInfo info = sessions.get(sessionId);
        info.setStatus("AUTHORIZED");
        info.setEmail(email);
        info.setRole(role);

        return Map.of("status", "SUCCESS");
    }

    @GetMapping("/status/{sessionId}")
    public Map<String, Object> getStatus(@PathVariable String sessionId) {
        QrSessionInfo info = sessions.get(sessionId);

        if (info == null) {
            return Map.of("status", "EXPIRED");
        }

        if ("AUTHORIZED".equals(info.getStatus())) {
            // Generate a web token for the user
            String webToken = jwtService.generateToken(info.getEmail(), info.getRole());

            // Clean up session
            sessions.remove(sessionId);

            return Map.of(
                    "status", "SUCCESS",
                    "token", webToken,
                    "role", info.getRole(),
                    "email", info.getEmail());
        }

        return Map.of("status", info.getStatus());
    }

    private static class QrSessionInfo {
        private String status;
        private String email;
        private String role;

        public QrSessionInfo(String status) {
            this.status = status;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
