package com.helthCare.MedNex.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.helthCare.MedNex.Entity.Appointment;
import com.helthCare.MedNex.Entity.Doctor;

public interface AppointmentRepo extends JpaRepository<Appointment, Long>   {

    boolean existsByDoctorAndAppointmentDateAndAppointmentTime(
        Doctor doctor,
        LocalDate appointmentDate,
        LocalTime appointmentTime
);

//existsOverlapping
    
//   @Query("""
//     SELECT COUNT(a)
//     FROM Appointment a
//     WHERE a.doctor = :doctor
//     AND a.appointmentDate = :appointmentDate
//     AND a.appointmentTime > :newEnd
//     AND a.appointmentTime+30 < :newStart
// """)
//     long existsOverlapping(Doctor doctor, LocalTime newStart, LocalTime newEnd, LocalDate appointmentDate);
    

    List<Appointment> findByDoctor(Doctor doctor);

    List<Appointment> findByDoctorAndAppointmentDate(Doctor doctor, LocalDate appointmentDate);

} 


// fun(doc , newstart, newend, appointmentDate){
//     // select * from appointment where doctor_id = ? and appointment_date = ? and (appointment_time between ? and ?)
//     // find all appointment for this doctor = doc.id;
//     // list of appointment haing date and time and end time

//     // first find appontment on same date
//     // now if data is same the check time
//     int startAppointment = Appointment.getTime();
//     int endAppointment = startAppointment + 30; // assuming 30-minute appointments

    
//     // Check for overlap
//     if(newend < startAppointment || newstart > endAppointment){
//         // no overlap
//     } else {
//         // overlap exists
//     }

// }