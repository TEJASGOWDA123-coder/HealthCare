package com.helthCare.MedNex.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.helthCare.MedNex.Entity.Patient;

public interface PatientRepo extends JpaRepository<Patient, Long> {
    
}
