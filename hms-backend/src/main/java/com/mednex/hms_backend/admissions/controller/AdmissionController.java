package com.mednex.hms_backend.admissions.controller;

import com.mednex.hms_backend.admissions.model.dto.AdmissionDto;
import com.mednex.hms_backend.admissions.service.AdmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admissions")
@CrossOrigin(origins = "http://localhost:4200")
// @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;

    @PostMapping
    public ResponseEntity<AdmissionDto> create(@Valid @RequestBody AdmissionDto dto) {
        return ResponseEntity.ok(admissionService.createAdmission(dto));
    }

    @GetMapping
    public ResponseEntity<List<AdmissionDto>> getAll() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdmissionDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(admissionService.getAdmissionById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AdmissionDto>> getByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(admissionService.getByPatientId(patientId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdmissionDto> update(@PathVariable Long id, @Valid @RequestBody AdmissionDto dto) {
        return ResponseEntity.ok(admissionService.updateAdmission(id, dto));
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        admissionService.deleteAdmission(id);
        return ResponseEntity.noContent().build();
    }
}
