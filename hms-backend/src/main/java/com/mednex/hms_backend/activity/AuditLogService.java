package com.mednex.hms_backend.activity;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository repository;

    public AuditLogService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void log(String userId, String patientId, String action, String details) {
        AuditLog entry = AuditLog.builder()
                .userId(userId)
                .patientId(patientId)
                .action(action)
                .details(details)
                .build();
        repository.save(entry);
    }

    public List<AuditLog> getAll() {
        return repository.findAll();
    }

    public List<AuditLog> getByPatient(String patientId) {
        return repository.findByPatientId(patientId);
    }
}
