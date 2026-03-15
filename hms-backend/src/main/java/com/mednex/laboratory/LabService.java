package com.mednex.laboratory;

import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service
public class LabService {

    private final LabRequestRepository requestRepo;
    private final LabResultRepository resultRepo;

    public LabService(LabRequestRepository requestRepo, LabResultRepository resultRepo) {
        this.requestRepo = requestRepo;
        this.resultRepo = resultRepo;
    }

    public List<LabRequest> getAllRequests() {
        return requestRepo.findAll();
    }

    public LabRequest createRequest(LabRequest request) {
        request.setStatus("PENDING");
        request.setCreatedAt(Instant.now());
        return requestRepo.save(request);
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
        request.setStatus("COMPLETED");
        request.setUpdatedAt(Instant.now());
        requestRepo.save(request);

        result.setRequest(request);
        result.setCreatedAt(Instant.now());
        return resultRepo.save(result);
    }

    public LabResult getResultByRequestId(Long requestId) {
        return resultRepo.findByRequestId(requestId);
    }
}
