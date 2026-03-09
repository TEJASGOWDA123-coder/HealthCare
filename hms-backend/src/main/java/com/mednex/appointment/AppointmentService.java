package com.mednex.appointment;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    public List<Appointment> all() {
        return repo.findAll();
    }

    public Appointment save(Appointment a) {
        if (hasConflict(a)) {
            throw new RuntimeException("Conflict detected: Doctor already has an appointment in this time slot.");
        }
        Appointment saved = repo.save(a);
        try {
            emailService.sendAppointmentConfirmation(saved);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
        return saved;
    }

    public boolean hasConflict(Appointment a) {
        // Skip conflict check if doctor, startTime, or endTime is null
        if (a.getDoctor() == null || a.getStartTime() == null || a.getEndTime() == null) {
            return false;
        }
        List<Appointment> overlaps = repo.findOverlappingAppointments(
                a.getDoctor().getId(),
                a.getStartTime(),
                a.getEndTime());

        // If updating, exclude the current appointment from conflict check
        return overlaps.stream().anyMatch(existing -> !existing.getId().equals(a.getId()));
    }

    public Appointment findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    public List<Appointment> getByDoctor(Long doctorId) {
        return repo.findByDoctorId(doctorId);
    }

    public Appointment cancel(Long id) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setStatus("CANCELLED");
                    return repo.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }
}
