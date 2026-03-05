package com.mednex.appointment;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    public List<Appointment> all() {
        return repo.findAll();
    }

    public Appointment save(Appointment a) {
        return repo.save(a);
    }

    public Appointment findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    public Appointment update(Long id, Appointment updatedAppointment) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setPatientName(updatedAppointment.getPatientName());
                    existing.setDoctorName(updatedAppointment.getDoctorName());
                    existing.setDepartment(updatedAppointment.getDepartment());
                    existing.setDate(updatedAppointment.getDate());
                    existing.setTime(updatedAppointment.getTime());
                    existing.setType(updatedAppointment.getType());
                    existing.setStatus(updatedAppointment.getStatus());
                    return repo.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }
}
