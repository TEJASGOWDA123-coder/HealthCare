package com.mednex.laboratory;

import com.mednex.hms_backend.activity.AuditLogService;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
public class LabService {

    private final LabRequestRepository requestRepo;
    private final LabResultRepository resultRepo;
    private final AuditLogService auditLogService;

    public LabService(LabRequestRepository requestRepo, LabResultRepository resultRepo,
            AuditLogService auditLogService) {
        this.requestRepo = requestRepo;
        this.resultRepo = resultRepo;
        this.auditLogService = auditLogService;
    }

    public List<LabRequest> getAllRequests() {
        return requestRepo.findAll();
    }

    public LabRequest createRequest(LabRequest request) {
        request.setStatus("PENDING");
        request.setCreatedAt(Instant.now());
        LabRequest saved = requestRepo.save(request);
        auditLogService.logAction("LAB_REQUEST",
                "New lab request: " + saved.getTestType() + " for patient ID: " + saved.getPatient().getId());
        return saved;
    }

    public List<LabRequest> getRequestsByPatient(Long patientId) {
        return requestRepo.findByPatientId(patientId);
    }

    public LabRequest getRequestById(Long id) {
        return requestRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab Request not found with id: " + id));
    }

    public LabResult uploadResult(Long requestId, LabResult result) {
        LabRequest request = getRequestById(requestId);

        // Prevent duplicate results
        if (resultRepo.findByRequestId(requestId) != null) {
            throw new RuntimeException("Result already exists for this request");
        }

        request.setStatus("COMPLETED");
        request.setUpdatedAt(Instant.now());
        requestRepo.save(request);

        result.setRequest(request);
        result.setCreatedAt(Instant.now());
        LabResult saved = resultRepo.save(result);
        auditLogService.logAction("LAB_RESULT_UPLOAD", "Lab result uploaded for request ID: " + requestId);
        return saved;
    }

    public LabResult getResultByRequestId(Long requestId) {
        return resultRepo.findByRequestId(requestId);
    }
}
