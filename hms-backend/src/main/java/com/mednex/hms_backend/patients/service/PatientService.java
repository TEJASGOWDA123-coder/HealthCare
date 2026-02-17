package com.mednex.hms_backend.patients.service;

import com.mednex.hms_backend.patients.model.dto.PatientDto;

import java.util.List;

public interface PatientService {
    PatientDto createPatient(PatientDto patientDto);

    List<PatientDto> getAllPatients();

    PatientDto getPatientById(Long id);

    PatientDto updatePatient(Long id, PatientDto patientDto);

    void deletePatient(Long id);
}
