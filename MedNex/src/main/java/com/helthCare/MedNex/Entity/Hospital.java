package com.helthCare.MedNex.Entity;
// import com.helthCare.MedNex.Entity.Doctor;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Hospital {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;  // name of hospital
    private String address; // address of hospital

    @OneToMany(mappedBy = "hospital")
    private List<Doctor> doctor;
    // private List<Doctor> doctor; // doctor associated with hospital
}
