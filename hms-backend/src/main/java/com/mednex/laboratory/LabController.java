package com.mednex.laboratory;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/laboratory")
public class LabController {

    private final LabService service;

    public LabController(LabService service) {
        this.service = service;
    }

    @GetMapping("/requests")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public List<LabRequest> getAllRequests() {
        return service.getAllRequests();
    }

    @PostMapping("/requests")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public LabRequest createRequest(@RequestBody LabRequest request) {
        return service.createRequest(request);
    }

    @GetMapping("/requests/patient/{patientId}")
    public List<LabRequest> getRequestsByPatient(@PathVariable Long patientId) {
        return service.getRequestsByPatient(patientId);
    }

    @GetMapping("/requests/{id}")
    public LabRequest getRequestById(@PathVariable Long id) {
        return service.getRequestById(id);
    }

    @PostMapping("/requests/{id}/results")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public LabResult uploadResult(@PathVariable Long id, @RequestBody LabResult result) {
        return service.uploadResult(id, result);
    }

    @GetMapping("/requests/{id}/results")
    public LabResult getResult(@PathVariable Long id) {
        return service.getResultByRequestId(id);
    }
}
