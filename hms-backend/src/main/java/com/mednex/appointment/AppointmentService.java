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
}
