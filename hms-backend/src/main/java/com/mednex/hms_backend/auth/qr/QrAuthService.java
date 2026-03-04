package com.mednex.hms_backend.auth.qr;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class QrAuthService {

    private final Map<String, QrSessionInfo> sessions = new ConcurrentHashMap<>();

    public String createSession() {
        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, new QrSessionInfo("PENDING"));
        return sessionId;
    }

    public void authorizeSession(String sessionId, String email, String role) {
        QrSessionInfo info = sessions.get(sessionId);
        if (info != null) {
            info.setStatus("AUTHORIZED");
            info.setEmail(email);
            info.setRole(role);
        }
    }

    public QrSessionInfo getSession(String sessionId) {
        return sessions.get(sessionId);
    }

    public void removeSession(String sessionId) {
        sessions.remove(sessionId);
    }

    public boolean isValidSession(String sessionId) {
        return sessions.containsKey(sessionId);
    }

    public static class QrSessionInfo {
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
