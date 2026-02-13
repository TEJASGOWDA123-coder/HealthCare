package com.helthCare.MedNex.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.helthCare.MedNex.Entity.Appointment;
import com.helthCare.MedNex.Entity.Doctor;
import com.helthCare.MedNex.Entity.Patient;
import com.helthCare.MedNex.Exception.UserException;
import com.helthCare.MedNex.Repository.AppointmentRepo;
import com.helthCare.MedNex.Repository.DoctorRepo;
import com.helthCare.MedNex.Repository.PatientRepo;

@Service
public class UserServices {

    @Autowired
    private DoctorRepo doctorRepo;

    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private AppointmentRepo appointmentRepo;
    
    public Doctor addDoctor(Map<String, String> request) {

        
        String name = request.get("name");
        String specialization = request.get("specialization");
        String contactNumber = request.get("contactNumber");
        String experience = request.get("experience");
        String email = request.get("email");
        String password = request.get("password");
      
        Doctor doctor = new Doctor();


        if (doctorRepo.existsByEmail(email)) {
            throw new UserException("Email already exists!");
        }
        doctor.setName(name);
        doctor.setSpecialization(specialization);
        doctor.setContactNumber(contactNumber);
        doctor.setExperience(experience);

        doctor.setEmail(email);
        doctor.setPassword(password);
        
        doctorRepo.save(doctor);
        
        // System.out.println("Adding doctor: " + name + ", Specialization: " + specialization + ", Contact: " + contactNumber + ", Experience: " + experience);
        return doctor;
     
    }
    public List<Doctor> getAlldoctor() {
        return doctorRepo.findAll();
    }


    ///////////patient related services //////////// i am working for online only now
    
    public Patient addPatient(Map<String, String> request) {
        String patientName = request.get("patientName");
        int patientAge = Integer.parseInt(request.get("patientAge"));
        String patientGender = request.get("patientGender");
        String phoneNumber = request.get("phoneNumber");
        String address = request.get("address");
        String email = request.get("email");
        String password = request.get("password");

        Patient patient = new Patient();
        patient.setPatientName(patientName);
        patient.setPatientAge(patientAge);
        patient.setPatientGender(patientGender);
        patient.setPhoneNumber(phoneNumber);
        patient.setAddress(address);
        patient.setEmail(email);
        patient.setPassword(password);

        return patientRepo.save(patient);
    }
    public List<Patient> getAllPatient() {
        return patientRepo.findAll();
    }

    public Appointment bookAppointment(String patientid, String doctorid, Map<String, String> request) {
        // TODO Auto-generated method stub
        Patient patient = patientRepo.findById(Long.parseLong(patientid)).orElseThrow(() -> new UserException("Patient not found with id: " + patientid));
        Doctor doctor = doctorRepo.findById(Long.parseLong(doctorid)).orElseThrow(() -> new UserException("Doctor not found with id: " + doctorid));
        
        String appointmentDate = request.get("appointmentDate");
        String appointmentTime = request.get("appointmentTime");

        LocalTime start = LocalTime.parse(appointmentTime);
        LocalTime end = start.plusMinutes(30);
        
        // long count = appointmentRepo.existsOverlapping(doctor,start,end, LocalDate.parse(appointmentDate));
        
        List<Appointment> appointments =
        appointmentRepo.findByDoctorAndAppointmentDate(doctor, LocalDate.parse(appointmentDate));


        for (Appointment a : appointments) {

            LocalTime existingStart = a.getAppointmentTime();
            LocalTime existingEnd = existingStart.plusMinutes(30);

            if (start.isBefore(existingEnd) && end.isAfter(existingStart)) {
                throw new UserException("Doctor already booked within 30 minutes");
            }
        }
        // if(appointmentRepo.existsOverlapping(doctor,start,end, LocalDate.parse(appointmentDate))){
        //     throw new UserException("Doctor is not available at this time!");
        
        // if(count > 0){
        //     throw new UserException("Doctor is not available at this time!");
        // }

        if (appointmentRepo.existsByDoctorAndAppointmentDateAndAppointmentTime(doctor, LocalDate.parse(appointmentDate), LocalTime.parse(appointmentTime))) {
            throw new UserException("Appointment already exists!");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        //{
        //   "appointmentDate": "2026-02-20",
        //   "appointmentTime": "14:30"
        // }
        // before saving appointment we have to check with this doctor any previos appointment or not
        // also can you tell me how appointmetn Date and time will look like


        appointment.setAppointmentDate(LocalDate.parse(appointmentDate));
        appointment.setAppointmentTime(LocalTime.parse(appointmentTime));
        
        patient.getAppointments().add(appointment);
        doctor.getAppointments().add(appointment);

        return appointmentRepo.save(appointment);
        
        // patientRepo.save(patient);
        // doctorRepo.save(doctor);
        
        // return "Appointment booked successfully";
    }


    public List<Appointment> getAppointmentsByDoctor(String doctorid) {
        Doctor doctor = doctorRepo.findById(Long.parseLong(doctorid)).orElseThrow(() -> new UserException("Doctor not found with id: " + doctorid));
        return appointmentRepo.findByDoctor(doctor);
    }

    public List<Appointment> getAllAppointment() {
        return appointmentRepo.findAll();
    }
}
