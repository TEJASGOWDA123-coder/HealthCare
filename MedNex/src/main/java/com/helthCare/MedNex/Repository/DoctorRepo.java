package com.helthCare.MedNex.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.helthCare.MedNex.Entity.Doctor;

@Repository
// public interface User extends JpaRepository<User, Long> {
public interface DoctorRepo extends JpaRepository<Doctor, Long> {

    boolean existsByEmail(String email);
    
}
