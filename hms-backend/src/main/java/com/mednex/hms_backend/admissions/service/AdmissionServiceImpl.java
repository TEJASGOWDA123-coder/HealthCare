package com.mednex.hms_backend.admissions.service;

import com.mednex.hms_backend.admissions.model.dto.AdmissionDto;
import com.mednex.hms_backend.admissions.model.entity.Admission;
import com.mednex.hms_backend.admissions.repository.AdmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdmissionServiceImpl implements AdmissionService {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Override
    public AdmissionDto createAdmission(AdmissionDto dto) {
        Admission admission = Admission.builder()
                .patientId(dto.getPatientId())
                .admissionDate(dto.getAdmissionDate())
                .dischargeDate(dto.getDischargeDate())
                .roomNumber(dto.getRoomNumber())
                .doctorInCharge(dto.getDoctorInCharge())
                .medicalHistory(dto.getMedicalHistory())
                .build();

        Admission saved = admissionRepository.save(admission);
        return mapToDto(saved);
    }

    @Override
    public List<AdmissionDto> getAllAdmissions() {
        return admissionRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AdmissionDto getAdmissionById(Long id) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
        return mapToDto(admission);
    }

    @Override
    public List<AdmissionDto> getByPatientId(Long patientId) {
        return admissionRepository.findByPatientId(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AdmissionDto updateAdmission(Long id, AdmissionDto dto) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        admission.setPatientId(dto.getPatientId());
        admission.setAdmissionDate(dto.getAdmissionDate());
        admission.setDischargeDate(dto.getDischargeDate());
        admission.setRoomNumber(dto.getRoomNumber());
        admission.setDoctorInCharge(dto.getDoctorInCharge());
        admission.setMedicalHistory(dto.getMedicalHistory());

        Admission saved = admissionRepository.save(admission);
        return mapToDto(saved);
    }

    @Override
    public void deleteAdmission(Long id) {
        admissionRepository.deleteById(id);
    }

    private AdmissionDto mapToDto(Admission admission) {
        return AdmissionDto.builder()
                .id(admission.getId())
                .patientId(admission.getPatientId())
                .admissionDate(admission.getAdmissionDate())
                .dischargeDate(admission.getDischargeDate())
                .roomNumber(admission.getRoomNumber())
                .doctorInCharge(admission.getDoctorInCharge())
                .medicalHistory(admission.getMedicalHistory())
                .createdAt(admission.getCreatedAt())
                .updatedAt(admission.getUpdatedAt())
                .build();
    }
}
