package com.mednex.hms_backend.patients.service;

import com.mednex.hms_backend.patients.model.dto.PatientDto;
import com.mednex.hms_backend.patients.model.entity.Patient;
import com.mednex.hms_backend.patients.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository repository;

    @Override
    public PatientDto createPatient(PatientDto dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Patient with this email already exists");
        }
        Patient patient = mapToEntity(dto);
        Patient savedPatient = repository.save(patient);
        return mapToDto(savedPatient);
    }

    @Override
    public List<PatientDto> getAllPatients() {
        return repository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDto getPatientById(Long id) {
        Patient patient = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
        return mapToDto(patient);
    }

    @Override
    public PatientDto updatePatient(Long id, PatientDto dto) {
        Patient patient = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setEmail(dto.getEmail());
        patient.setPhoneNumber(dto.getPhoneNumber());
        patient.setGender(dto.getGender());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setAge(dto.getAge());
        patient.setCondition(dto.getCondition());
        patient.setStatus(dto.getStatus());
        patient.setRoom(dto.getRoom());
        patient.setLastVisit(dto.getLastVisit());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setAddress(dto.getAddress());
        patient.setMedicalHistory(dto.getMedicalHistory());

        Patient updatedPatient = repository.save(patient);
        return mapToDto(updatedPatient);
    }

    @Override
    public void deletePatient(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Patient not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private Patient mapToEntity(PatientDto dto) {
        return Patient.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .gender(dto.getGender())
                .dateOfBirth(dto.getDateOfBirth())
                .age(dto.getAge())
                .condition(dto.getCondition())
                .status(dto.getStatus())
                .room(dto.getRoom())
                .lastVisit(dto.getLastVisit())
                .bloodGroup(dto.getBloodGroup())
                .address(dto.getAddress())
                .medicalHistory(dto.getMedicalHistory())
                .build();
    }

    private PatientDto mapToDto(Patient patient) {
        return PatientDto.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phoneNumber(patient.getPhoneNumber())
                .gender(patient.getGender())
                .dateOfBirth(patient.getDateOfBirth())
                .age(patient.getAge())
                .condition(patient.getCondition())
                .status(patient.getStatus())
                .room(patient.getRoom())
                .lastVisit(patient.getLastVisit())
                .bloodGroup(patient.getBloodGroup())
                .address(patient.getAddress())
                .medicalHistory(patient.getMedicalHistory())
                .build();
    }
}
