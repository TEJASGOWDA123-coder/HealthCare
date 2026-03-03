package com.mednex.hms_backend.admissions.controller;

import com.mednex.hms_backend.admissions.model.dto.AdmissionDto;
import com.mednex.hms_backend.admissions.repository.AdmissionRepository;
import com.mednex.hms_backend.admissions.service.AdmissionService;
import com.mednex.hms_backend.auth.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admissions")
@CrossOrigin(origins = "http://localhost:4200")
// @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.mednex.hms_backend.patients.repository.PatientRepository patientRepository;

    // Returns admissions assigned to the currently logged-in doctor
    @GetMapping("/my")
    public ResponseEntity<List<AdmissionDto>> getMyAdmissions(Authentication authentication) {
        if (authentication == null)
            return ResponseEntity.ok(List.of());
        return userRepository.findByEmail(authentication.getName())
                .map(user -> ResponseEntity.ok(
                        admissionRepository.findByAssignedDoctorId(user.getId())
                                .stream()
                                .map(a -> AdmissionDto.builder()
                                        .id(a.getId())
                                        .patientId(a.getPatientId())
                                        .patientName(a.getPatientName())
                                        .admissionDate(a.getAdmissionDate())
                                        .roomNumber(a.getRoomNumber())
                                        .doctorInCharge(a.getDoctorInCharge())
                                        .assignedDoctorId(a.getAssignedDoctorId())
                                        .status(a.getStatus())
                                        .createdAt(a.getCreatedAt())
                                        .build())
                                .collect(Collectors.toList())))
                .orElse(ResponseEntity.ok(List.of()));
    }

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

    @GetMapping("/me")
    public ResponseEntity<List<AdmissionDto>> getMyAdmissionsForPatient(Authentication authentication) {
        String email = authentication.getName();
        return patientRepository.findByEmail(email)
                .map(patient -> ResponseEntity.ok(
                        admissionRepository.findByPatientId(patient.getId())
                                .stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList())))
                .orElse(ResponseEntity.ok(List.of()));
    }

    private AdmissionDto mapToDto(com.mednex.hms_backend.admissions.model.entity.Admission a) {
        return AdmissionDto.builder()
                .id(a.getId())
                .patientId(a.getPatientId())
                .patientName(a.getPatientName())
                .admissionDate(a.getAdmissionDate())
                .roomNumber(a.getRoomNumber())
                .doctorInCharge(a.getDoctorInCharge())
                .assignedDoctorId(a.getAssignedDoctorId())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
