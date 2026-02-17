package com.mednex.hms_backend.admissions.service;

import com.mednex.hms_backend.admissions.model.dto.AdmissionDto;

import java.util.List;

public interface AdmissionService {
    AdmissionDto createAdmission(AdmissionDto admissionDto);

    List<AdmissionDto> getAllAdmissions();

    AdmissionDto getAdmissionById(Long id);

    List<AdmissionDto> getByPatientId(Long patientId);

    AdmissionDto updateAdmission(Long id, AdmissionDto admissionDto);

    void deleteAdmission(Long id);
}
