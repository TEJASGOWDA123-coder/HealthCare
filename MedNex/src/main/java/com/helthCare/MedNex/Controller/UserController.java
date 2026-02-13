package com.helthCare.MedNex.Controller;

import java.util.List;
import java.util.Map;

import org.apache.catalina.connector.Response;
import org.postgresql.util.Gettable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.helthCare.MedNex.Entity.Appointment;
import com.helthCare.MedNex.Entity.Doctor;
import com.helthCare.MedNex.Entity.Patient;
import com.helthCare.MedNex.Services.UserServices;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class UserController {
    
    // create admin //create doctor // create nurse //hospital
    @Autowired
    private UserServices userServices;
    // create hospital 
    @PostMapping("/Addedhospital")
    public String createHospital(@RequestBody Map<String , String> request){
        
        return "Hospital created successfully";
    }


    ////////////////////////////Doctor related apis ////////////////////////////
    @PostMapping("AddedDoctor")
    public ResponseEntity<Object> AddingDoctor(@Valid @RequestBody Map<String , String> request) {
        //TODO: process POST request
        
        Doctor doc = userServices.addDoctor(request);
        System.out.println(doc);
        return ResponseEntity.ok(doc);
    } 

    @GetMapping("getAllDoctor")
    public ResponseEntity<Object> getAllDoctor() {
        List<Doctor> doc = userServices.getAlldoctor();
        return ResponseEntity.ok(doc);
    }

    //////////////////////Patient related apis ////////////////////////////
    @PostMapping("/AddedPatient")
    public ResponseEntity<Object> AddingPatient(@RequestBody Map<String , String> request){
        
        Patient patient = userServices.addPatient(request);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/getAllPatient")
    public ResponseEntity<Object> getAllPatient(){
        List<Patient> patients = userServices.getAllPatient();
        return ResponseEntity.ok(patients);
    }

    ////////////////////////////Appointment related apis ////////////////////////////
    ///create patient having name, age , appointment ,  
    @PostMapping("/bookAppointment")
    public ResponseEntity<Object> BookAppointment(@RequestParam String patientid, @RequestParam String doctorid, @RequestBody Map<String, String> request) {
        
        return ResponseEntity.ok(userServices.bookAppointment(patientid, doctorid, request));
    }
    
    // get Appointmnet by Doctor
    @GetMapping("/getAppointmentsByDoctor/{doctorid}")
    public ResponseEntity<Object> getAppointmentsByDoctor(@PathVariable String doctorid){
        List<Appointment> appointments = userServices.getAppointmentsByDoctor(doctorid);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/getAllAppointment")
    public ResponseEntity<Object> getAllAppointment() {
        return ResponseEntity.ok(userServices.getAllAppointment());
    }
    
    
    
}
