package com.helthCare.MedNex.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
// @ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Doctor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    private String name;
    
    private String specialization;
    private String contactNumber;

    private String experience;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email is mandatory")
    private String email;
    
    private String password;

    @OneToMany(mappedBy = "doctor")
    @JsonManagedReference
    private List<Appointment> appointments = new ArrayList<>();   //is ka table mai column nahi bnega, 

    @OneToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital; // doctor associated with hospital

}
